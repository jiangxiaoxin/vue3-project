/**
 * OpenAI 兼容 SSE（Server-Sent Events）流式响应解析器。
 *
 * 设计约束：
 * 1. 一个网络 chunk 可能包含多个 SSE 事件，也可能只包含半个 JSON 行；
 *    因此必须使用跨 read 的文本缓冲区，不能按 chunk 直接 JSON.parse。
 * 2. UTF-8 多字节字符可能被拆到两个 chunk；TextDecoder 必须以 stream 模式解码，
 *    并在流结束时再 flush 一次，避免截断中文等字符。
 * 3. 仅处理 `data:` 行；注释行（以 `:` 开头）、其它字段、空行一律忽略。
 * 4. `data: [DONE]` 表示服务端正常结束；收到后应停止继续读取并取消 reader。
 * 5. 无效 JSON 不得吞掉，必须抛出 OpenAIStreamParseError，供上层展示给用户。
 */

/** OpenAI chat.completions 流式增量里我们关心的最小结构。 */
interface OpenAIStreamPayload {
  choices?: Array<{
    delta?: {
      /** 文本增量；角色宣告等事件中通常为 undefined / null。 */
      content?: string | null
    }
  }>
}

/**
 * SSE `data:` 行无法按 JSON 解析时抛出。
 * message 中会带上原始 payload，便于排查；调用方不得把其中可能含敏感信息的内容再写入日志之外的持久层。
 */
export class OpenAIStreamParseError extends Error {
  constructor(payload: string) {
    super(`无法解析流式响应数据：${payload}`)
    this.name = 'OpenAIStreamParseError'
  }
}

/**
 * 处理单行 SSE 文本。
 *
 * @returns `true` 表示已收到 `[DONE]`，调用方应结束解析；`false` 表示继续。
 */
function processDataLine(
  line: string,
  onDelta: (content: string) => void
): boolean {
  // SSE 允许 CRLF；split('\n') 后行尾可能残留 `\r`。
  const normalizedLine = line.endsWith('\r') ? line.slice(0, -1) : line

  if (!normalizedLine.startsWith('data:')) {
    return false
  }

  // `data:` 之后允许有一个可选空格；trimStart 兼容 `data:{...}` 与 `data: {...}`。
  const data = normalizedLine.slice(5).trimStart()

  if (data === '[DONE]') {
    console.log('[openai][stream] received [DONE]')
    return true
  }

  // `data:` 空内容视为心跳/占位，忽略。
  if (!data) {
    return false
  }

  let payload: OpenAIStreamPayload

  try {
    payload = JSON.parse(data) as OpenAIStreamPayload
  } catch {
    console.error('[openai][stream] invalid JSON data line', data)
    throw new OpenAIStreamParseError(data)
  }

  const content = payload.choices?.[0]?.delta?.content

  // 只转发非空字符串；role-only 或 content 为 null 的事件不触发 UI 更新。
  if (typeof content === 'string' && content.length > 0) {
    console.log('[openai][stream] delta content', content)
    onDelta(content)
  }

  return false
}

/**
 * 增量解析 OpenAI 兼容的 chat.completions SSE 流。
 *
 * @param stream - `fetch` 响应的 `response.body`
 * @param onDelta - 每收到一段 `delta.content` 时回调；同一轮回复会调用多次
 */
export async function parseOpenAIStream(
  stream: ReadableStream<Uint8Array>,
  onDelta: (content: string) => void
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  /** 跨 chunk 拼接的未完成行缓冲区。 */
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      // 流结束：flush TextDecoder 内部可能残留的多字节序列。
      console.log("steam is done000000000000000000");
      console.log('[openai][stream] reader done')
      buffer += decoder.decode()
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    // pop 出的最后一段可能是半行，留在 buffer 等待下一个 chunk。
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (processDataLine(line, onDelta)) {
        // 正常结束信号：取消后续读取，避免无意义消耗。
        console.log('[openai][stream] cancel reader after [DONE]')
        await reader.cancel()
        return
      }
    }
  }

  // 部分服务在结束时不补尾部换行，buffer 里仍可能有完整的最后一条 data。
  if (buffer && processDataLine(buffer, onDelta)) {
    return
  }
}
