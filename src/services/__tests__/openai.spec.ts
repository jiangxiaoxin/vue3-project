import { describe, expect, it, vi } from 'vitest'
import {
  OpenAIRequestError,
  buildChatCompletionsUrl,
  streamChat
} from '../openai'

const encoder = new TextEncoder()

function createStreamResponse(text: string) {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      }
    }),
    { status: 200 }
  )
}

describe('buildChatCompletionsUrl', () => {
  it('removes trailing slashes before adding the endpoint', () => {
    expect(buildChatCompletionsUrl('https://example.com/v1///')).toBe(
      'https://example.com/v1/chat/completions'
    )
  })
})

describe('streamChat', () => {
  it('posts the fixed model, messages, auth header, and emits deltas', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      createStreamResponse(
        'data: {"choices":[{"delta":{"content":"answer"}}]}\n\n' +
          'data: [DONE]\n\n'
      )
    )
    const onDelta = vi.fn()
    const messages = [{ role: 'user' as const, content: 'question' }]

    await streamChat({
      baseUrl: 'https://example.com/v1/',
      apiKey: 'secret-key',
      messages,
      onDelta,
      fetchImpl: fetchImpl as typeof fetch
    })

    expect(fetchImpl).toHaveBeenCalledOnce()
    const [url, request] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://example.com/v1/chat/completions')
    expect(request.headers).toEqual({
      Authorization: 'Bearer secret-key',
      'Content-Type': 'application/json'
    })
    expect(JSON.parse(request.body)).toEqual({
      model: 'gpt-5.5',
      stream: true,
      messages
    })
    expect(onDelta).toHaveBeenCalledWith('answer')
  })

  it('uses the compatible API error message for a non-2xx response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'invalid key' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    await expect(
      streamChat({
        baseUrl: 'https://example.com/v1',
        apiKey: 'secret-key',
        messages: [{ role: 'user', content: 'question' }],
        onDelta: vi.fn(),
        fetchImpl: fetchImpl as typeof fetch
      })
    ).rejects.toMatchObject({
      name: 'OpenAIRequestError',
      message: 'invalid key',
      status: 401
    })
  })

  it('reports a missing response body', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, body: null })

    await expect(
      streamChat({
        baseUrl: 'https://example.com/v1',
        apiKey: 'secret-key',
        messages: [{ role: 'user', content: 'question' }],
        onDelta: vi.fn(),
        fetchImpl: fetchImpl as typeof fetch
      })
    ).rejects.toBeInstanceOf(OpenAIRequestError)
  })
})
