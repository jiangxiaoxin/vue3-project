import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamChat } from '@/services/openai'
import OpenAIView from '../index.vue'

vi.mock('@/services/openai', () => ({
  streamChat: vi.fn()
}))

const streamChatMock = vi.mocked(streamChat)

async function fillConfig(wrapper: ReturnType<typeof mount>) {
  await wrapper
    .get('[data-testid="base-url"]')
    .setValue('https://example.com/v1')
  await wrapper.get('[data-testid="api-key"]').setValue('secret-key')
}

async function submitMessage(
  wrapper: ReturnType<typeof mount>,
  content: string
) {
  await wrapper.get('[data-testid="message-input"]').setValue(content)
  await wrapper.get('form').trigger('submit')
  await flushPromises()
}

describe('OpenAIView', () => {
  beforeEach(() => {
    streamChatMock.mockReset()
  })

  it('provides an associated label for the message composer', () => {
    const wrapper = mount(OpenAIView)
    const textarea = wrapper.get('[data-testid="message-input"]')
    const label = wrapper.get('label[for="message-input"]')

    expect(textarea.attributes('id')).toBe('message-input')
    expect(label.text()).toContain('输入消息')
  })

  it('validates config and message before sending', async () => {
    const wrapper = mount(OpenAIView)

    await wrapper.get('form').trigger('submit')

    expect(streamChatMock).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain(
      '请输入 Base URL'
    )
  })

  it('renders streaming deltas before the request completes', async () => {
    let emitDelta: ((delta: string) => void) | undefined
    let resolveStream: (() => void) | undefined
    streamChatMock.mockImplementation(({ onDelta }) => {
      emitDelta = onDelta
      return new Promise<void>((resolve) => {
        resolveStream = resolve
      })
    })
    const wrapper = mount(OpenAIView)
    await fillConfig(wrapper)

    await wrapper.get('[data-testid="message-input"]').setValue('Hi')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.findAll('[data-role="user"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-role="assistant"]')).toHaveLength(1)

    emitDelta?.('Hello')
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-role="assistant"]').text()).toContain('Hello')

    emitDelta?.(' world')
    resolveStream?.()
    await flushPromises()
    expect(wrapper.get('[data-role="assistant"]').text()).toContain(
      'Hello world'
    )
  })

  it('sends all completed history when the switch is enabled', async () => {
    streamChatMock
      .mockImplementationOnce(async ({ onDelta }) => onDelta('First answer'))
      .mockImplementationOnce(async ({ onDelta }) => onDelta('Second answer'))
    const wrapper = mount(OpenAIView)
    await fillConfig(wrapper)

    await submitMessage(wrapper, 'First question')
    await submitMessage(wrapper, 'Second question')

    expect(streamChatMock.mock.calls[1][0].messages).toEqual([
      { role: 'user', content: 'First question' },
      { role: 'assistant', content: 'First answer' },
      { role: 'user', content: 'Second question' }
    ])
  })

  it('sends only the latest user message when history is disabled', async () => {
    streamChatMock
      .mockImplementationOnce(async ({ onDelta }) => onDelta('First answer'))
      .mockImplementationOnce(async ({ onDelta }) => onDelta('Second answer'))
    const wrapper = mount(OpenAIView)
    await fillConfig(wrapper)

    await submitMessage(wrapper, 'First question')
    await wrapper.get('[data-testid="include-history"]').setValue(false)
    await submitMessage(wrapper, 'Second question')

    expect(streamChatMock.mock.calls[1][0].messages).toEqual([
      { role: 'user', content: 'Second question' }
    ])
  })

  it('keeps partial output and marks the assistant message after failure', async () => {
    streamChatMock.mockImplementation(async ({ onDelta }) => {
      onDelta('Partial answer')
      throw new Error('stream interrupted')
    })
    const wrapper = mount(OpenAIView)
    await fillConfig(wrapper)

    await submitMessage(wrapper, 'Question')

    expect(wrapper.get('[data-role="assistant"]').text()).toContain(
      'Partial answer'
    )
    expect(wrapper.get('[data-role="assistant"]').classes()).toContain(
      'message--error'
    )
    expect(wrapper.get('[role="alert"]').text()).toContain(
      'stream interrupted'
    )
  })

  it('renders assistant markdown as HTML instead of raw text', async () => {
    streamChatMock.mockImplementation(async ({ onDelta }) => {
      onDelta('### 住宿建议\n\n| 区域 | 优点 |\n| --- | --- |\n| 老城区 | 方便 |')
    })
    const wrapper = mount(OpenAIView)
    await fillConfig(wrapper)

    await submitMessage(wrapper, '青岛住宿建议')

    const assistant = wrapper.get('[data-role="assistant"]')
    expect(assistant.find('h3').exists()).toBe(true)
    expect(assistant.find('h3').text()).toBe('住宿建议')
    expect(assistant.find('table').exists()).toBe(true)
    expect(assistant.text()).not.toContain('### 住宿建议')
  })
})
