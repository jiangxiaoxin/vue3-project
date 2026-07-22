import { parseOpenAIStream } from '@/utils/parseOpenAIStream'

export interface ChatRequestMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamChatOptions {
  baseUrl: string
  apiKey: string
  messages: ChatRequestMessage[]
  onDelta: (content: string) => void
  signal?: AbortSignal
  fetchImpl?: typeof fetch
}

export class OpenAIRequestError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'OpenAIRequestError'
    this.status = status
  }
}

export function buildChatCompletionsUrl(baseUrl: string): string {
  return `${baseUrl.trim().replace(/\/+$/, '')}/chat/completions`
}

async function getResponseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string }
    }

    if (body.error?.message) {
      return body.error.message
    }
  } catch {
    // The fallback below handles non-JSON error responses.
  }

  return `请求失败（HTTP ${response.status}）`
}

export async function streamChat({
  baseUrl,
  apiKey,
  messages,
  onDelta,
  signal,
  fetchImpl = fetch
}: StreamChatOptions): Promise<void> {
  const response = await fetchImpl(buildChatCompletionsUrl(baseUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5.5',
      stream: true,
      messages
    }),
    signal
  })

  if (!response.ok) {
    throw new OpenAIRequestError(
      await getResponseError(response),
      response.status
    )
  }

  if (!response.body) {
    throw new OpenAIRequestError('响应中没有可读取的数据流', response.status)
  }

  await parseOpenAIStream(response.body, onDelta)
}
