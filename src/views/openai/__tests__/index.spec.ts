import 'fake-indexeddb/auto'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { streamChat } from '@/services/openai'
import {
  clearChatHistory,
  loadRecentChatRounds,
  saveChatMessages
} from '@/services/chatHistoryDb'
import OpenAIView from '../index.vue'

vi.mock('@/services/openai', () => ({
  streamChat: vi.fn()
}))

const streamChatMock = vi.mocked(streamChat)
const wrappers: VueWrapper[] = []

function mountView() {
  const wrapper = mount(OpenAIView)
  wrappers.push(wrapper)
  return wrapper
}

/** IndexedDB 回调不在 Vue 微任务队列内，需额外等待。 */
async function settleIndexedDb() {
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await flushPromises()
}

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
  await settleIndexedDb()
}

describe('OpenAIView', () => {
  beforeEach(async () => {
    streamChatMock.mockReset()
    await clearChatHistory()
    await settleIndexedDb()
  })

  afterEach(async () => {
    while (wrappers.length > 0) {
      wrappers.pop()?.unmount()
    }
    await settleIndexedDb()
    await clearChatHistory()
  })

  it('provides an associated label for the message composer', async () => {
    const wrapper = mountView()
    await settleIndexedDb()
    const textarea = wrapper.get('[data-testid="message-input"]')
    const label = wrapper.get('label[for="message-input"]')

    expect(textarea.attributes('id')).toBe('message-input')
    expect(label.text()).toContain('输入消息')
  })

  it('validates config and message before sending', async () => {
    const wrapper = mountView()
    await settleIndexedDb()

    await wrapper.get('form').trigger('submit')

    expect(streamChatMock).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain(
      '请输入 Base URL'
    )
  })

  it('restores recent local history on mount', async () => {
    await saveChatMessages([
      {
        id: 'u1',
        role: 'user',
        content: '历史问题',
        createdAt: 1,
        sort: 1
      },
      {
        id: 'a1',
        role: 'assistant',
        content: '历史回答',
        status: 'complete',
        createdAt: 2,
        sort: 2
      }
    ])
    await settleIndexedDb()

    const wrapper = mountView()
    await vi.waitFor(() => {
      expect(wrapper.get('[data-role="user"]').text()).toContain('历史问题')
    })
    expect(wrapper.get('[data-role="assistant"]').text()).toContain(
      '历史回答'
    )
  })

  it('persists the finished turn into IndexedDB', async () => {
    streamChatMock.mockImplementation(async ({ onDelta }) => {
      onDelta('本地回答')
    })
    const wrapper = mountView()
    await settleIndexedDb()
    await fillConfig(wrapper)

    await submitMessage(wrapper, '本地问题')

    const stored = await loadRecentChatRounds()
    expect(stored.some((item) => item.content === '本地问题')).toBe(true)
    expect(stored.some((item) => item.content === '本地回答')).toBe(true)
  })

  it('clears local history and the message list', async () => {
    await saveChatMessages([
      {
        id: 'u1',
        role: 'user',
        content: '旧问题',
        createdAt: 1,
        sort: 1
      },
      {
        id: 'a1',
        role: 'assistant',
        content: '旧回答',
        status: 'complete',
        createdAt: 2,
        sort: 2
      }
    ])
    await settleIndexedDb()

    const wrapper = mountView()
    await vi.waitFor(() => {
      expect(wrapper.findAll('[data-role="user"]')).toHaveLength(1)
    })

    await wrapper.get('[data-testid="clear-history"]').trigger('click')
    await settleIndexedDb()

    expect(wrapper.findAll('[data-role="user"]')).toHaveLength(0)
    expect(wrapper.findAll('[data-role="assistant"]')).toHaveLength(0)
    await expect(loadRecentChatRounds()).resolves.toEqual([])
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
    const wrapper = mountView()
    await settleIndexedDb()
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
    const wrapper = mountView()
    await settleIndexedDb()
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
    const wrapper = mountView()
    await settleIndexedDb()
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
    const wrapper = mountView()
    await settleIndexedDb()
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
    const wrapper = mountView()
    await settleIndexedDb()
    await fillConfig(wrapper)

    await submitMessage(wrapper, '青岛住宿建议')

    const assistant = wrapper.get('[data-role="assistant"]')
    expect(assistant.find('h3').exists()).toBe(true)
    expect(assistant.find('h3').text()).toBe('住宿建议')
    expect(assistant.find('table').exists()).toBe(true)
    expect(assistant.text()).not.toContain('### 住宿建议')
  })

  it('renders assistant math formulas with KaTeX', async () => {
    streamChatMock.mockImplementation(async ({ onDelta }) => {
      onDelta('公式 $E=mc^2$')
    })
    const wrapper = mountView()
    await settleIndexedDb()
    await fillConfig(wrapper)

    await submitMessage(wrapper, '能量公式')

    const assistant = wrapper.get('[data-role="assistant"]')
    expect(assistant.find('.katex').exists()).toBe(true)
    expect(assistant.text()).not.toContain('$E=mc^2$')
  })

  it('aborts the active SSE request when stop is clicked', async () => {
    let abortSignal: AbortSignal | undefined
    streamChatMock.mockImplementation(({ onDelta, signal }) => {
      abortSignal = signal
      onDelta('Partial')
      return new Promise<void>((_resolve, reject) => {
        signal?.addEventListener('abort', () => {
          const error = new Error('Aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    })
    const wrapper = mountView()
    await settleIndexedDb()
    await fillConfig(wrapper)

    await wrapper.get('[data-testid="message-input"]').setValue('开始生成')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[data-testid="stop-stream"]').exists()).toBe(true)

    await wrapper.get('[data-testid="stop-stream"]').trigger('click')
    await flushPromises()

    expect(abortSignal?.aborted).toBe(true)
    expect(wrapper.find('[data-testid="stop-stream"]').exists()).toBe(false)
    expect(wrapper.get('[data-role="assistant"]').text()).toContain('Partial')
    expect(wrapper.get('[data-role="assistant"]').classes()).toContain(
      'message--error'
    )
    expect(wrapper.get('[role="alert"]').text()).toContain('已停止生成')
  })
})
