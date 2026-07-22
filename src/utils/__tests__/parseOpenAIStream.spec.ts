import { describe, expect, it, vi } from 'vitest'
import {
  OpenAIStreamParseError,
  parseOpenAIStream
} from '../parseOpenAIStream'

const encoder = new TextEncoder()

function streamFromChunks(chunks: Uint8Array[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk))
      controller.close()
    }
  })
}

describe('parseOpenAIStream', () => {
  it('emits content from multiple SSE events in one chunk', async () => {
    const stream = streamFromChunks([
      encoder.encode(
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n' +
          'data: {"choices":[{"delta":{"content":" world"}}]}\n\n' +
          'data: [DONE]\n\n'
      )
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta.mock.calls.map(([content]) => content)).toEqual([
      'Hello',
      ' world'
    ])
  })

  it('reassembles a JSON event split across chunks', async () => {
    const event =
      'data: {"choices":[{"delta":{"content":"split"}}]}\n\ndata: [DONE]\n\n'
    const bytes = encoder.encode(event)
    const stream = streamFromChunks([
      bytes.slice(0, 17),
      bytes.slice(17, 39),
      bytes.slice(39)
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta).toHaveBeenCalledOnce()
    expect(onDelta).toHaveBeenCalledWith('split')
  })

  it('decodes a UTF-8 character split across byte chunks', async () => {
    const event =
      'data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n'
    const bytes = encoder.encode(event)
    const firstChineseByte = bytes.findIndex((byte) => byte > 0x7f)
    const stream = streamFromChunks([
      bytes.slice(0, firstChineseByte + 1),
      bytes.slice(firstChineseByte + 1)
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta).toHaveBeenCalledWith('你好')
  })

  it('ignores role-only events, comments, blank lines, and other fields', async () => {
    const stream = streamFromChunks([
      encoder.encode(
        ': keep-alive\n' +
          'event: message\n' +
          'data: {"choices":[{"delta":{"role":"assistant"}}]}\n\n' +
          'data: [DONE]\n\n'
      )
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta).not.toHaveBeenCalled()
  })

  it('processes a final data line even without a trailing newline', async () => {
    const stream = streamFromChunks([
      encoder.encode('data: {"choices":[{"delta":{"content":"final"}}]}')
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta).toHaveBeenCalledWith('final')
  })

  it('stops parsing after the DONE event', async () => {
    const stream = streamFromChunks([
      encoder.encode(
        'data: [DONE]\n\n' +
          'data: {"choices":[{"delta":{"content":"ignored"}}]}\n\n'
      )
    ])
    const onDelta = vi.fn()

    await parseOpenAIStream(stream, onDelta)

    expect(onDelta).not.toHaveBeenCalled()
  })

  it('throws an explicit error for invalid JSON data', async () => {
    const stream = streamFromChunks([
      encoder.encode('data: {invalid-json}\n\n')
    ])

    await expect(parseOpenAIStream(stream, vi.fn())).rejects.toBeInstanceOf(
      OpenAIStreamParseError
    )
  })
})
