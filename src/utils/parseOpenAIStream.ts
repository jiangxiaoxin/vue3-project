interface OpenAIStreamPayload {
  choices?: Array<{
    delta?: {
      content?: string | null
    }
  }>
}

export class OpenAIStreamParseError extends Error {
  constructor(payload: string) {
    super(`无法解析流式响应数据：${payload}`)
    this.name = 'OpenAIStreamParseError'
  }
}

function processDataLine(
  line: string,
  onDelta: (content: string) => void
): boolean {
  const normalizedLine = line.endsWith('\r') ? line.slice(0, -1) : line

  if (!normalizedLine.startsWith('data:')) {
    return false
  }

  const data = normalizedLine.slice(5).trimStart()

  if (data === '[DONE]') {
    return true
  }

  if (!data) {
    return false
  }

  let payload: OpenAIStreamPayload

  try {
    payload = JSON.parse(data) as OpenAIStreamPayload
  } catch {
    throw new OpenAIStreamParseError(data)
  }

  const content = payload.choices?.[0]?.delta?.content

  if (typeof content === 'string' && content.length > 0) {
    onDelta(content)
  }

  return false
}

export async function parseOpenAIStream(
  stream: ReadableStream<Uint8Array>,
  onDelta: (content: string) => void
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      buffer += decoder.decode()
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (processDataLine(line, onDelta)) {
        await reader.cancel()
        return
      }
    }
  }

  if (buffer && processDataLine(buffer, onDelta)) {
    return
  }
}
