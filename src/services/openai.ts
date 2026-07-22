/**
 * OpenAI 兼容 chat.completions 流式请求服务。
 *
 * 职责边界：
 * - 负责 URL 规范化、请求体构造、鉴权头、HTTP 错误提取。
 * - 流式正文解析委托给 `parseOpenAIStream`，本文件不重复实现 SSE 细节。
 *
 * 安全注意：
 * - API Key 由调用方传入，本服务不会持久化；但请求会把它放进 Authorization 头发往用户填写的 Base URL。
 * - 错误信息优先取服务端 `error.message`，不得主动拼接或回显完整 API Key。
 */

import { parseOpenAIStream } from '@/utils/parseOpenAIStream'

/**
 * 固定系统提示词：要求科学公式按严格 LaTeX 科学论文格式返回，
 * 便于前端 KaTeX（`$` / `$$` / `\[ \]` 等）正确渲染。
 * 由 `streamChat` 在每次请求时自动前置，不进入页面消息列表。
 */
export const FORMULA_SYSTEM_PROMPT =
  '如果内容涉及到数学公式，化学公式，物理公式等科学公式类内容，请对相关内容按照严格的 latex 科学论文编写所要求的公式格式返回内容'

/** 发往 chat.completions 的消息结构（不含页面 UI 专用字段）。 */
export interface ChatRequestMessage {
  role: 'user' | 'assistant'
  content: string
}

/** `streamChat` 入参。 */
export interface StreamChatOptions {
  /** OpenAI 兼容服务根地址，例如 `https://example.com/v1`（不要带 `/chat/completions`）。 */
  baseUrl: string
  /** Bearer Token；仅用于本次请求头。 */
  apiKey: string
  /** 本轮要发送的对话上下文。 */
  messages: ChatRequestMessage[]
  /** 每收到一段助手文本增量时回调。 */
  onDelta: (content: string) => void
  /** 可选：用于页面卸载或用户取消时中止请求。 */
  signal?: AbortSignal
  /**
   * 可选：注入 fetch 实现，便于单元测试；
   * 生产环境默认使用全局 `fetch`。
   */
  fetchImpl?: typeof fetch
}

/**
 * chat.completions 非 2xx 或响应体异常时抛出。
 * `status` 便于上层按状态码做差异化提示（当前页面统一展示 message）。
 */
export class OpenAIRequestError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'OpenAIRequestError'
    this.status = status
  }
}

/**
 * 将用户输入的 Base URL 规范为 chat.completions 完整地址。
 * 规则：trim + 去掉末尾多余 `/`，再拼接 `/chat/completions`。
 */
export function buildChatCompletionsUrl(baseUrl: string): string {
  return `${baseUrl.trim().replace(/\/+$/, '')}/chat/completions`
}

/**
 * 从失败响应中提取可读错误文案。
 * 优先 OpenAI 兼容体 `error.message`；否则回退到 HTTP 状态码描述。
 */
async function getResponseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string }
    }

    if (body.error?.message) {
      return body.error.message
    }
  } catch {
    // 非 JSON 错误体时走下方通用文案。
  }

  return `请求失败（HTTP ${response.status}）`
}

/**
 * 发起流式 chat.completions 请求，并通过 `onDelta` 持续推送文本增量。
 *
 * 固定约定（当前产品需求）：
 * - model: `gpt-5.5`
 * - stream: `true`
 * - 每次请求自动前置 `FORMULA_SYSTEM_PROMPT` 系统消息（不依赖页面历史）
 *
 * @throws {OpenAIRequestError} HTTP 失败或响应无 body
 * @throws {OpenAIStreamParseError} SSE 数据非法（由解析器抛出）
 * @throws {TypeError} 网络 / CORS 失败（由 fetch 抛出）
 */
export async function streamChat({
  baseUrl,
  apiKey,
  messages,
  onDelta,
  signal,
  fetchImpl = fetch
}: StreamChatOptions): Promise<void> {
  const url = buildChatCompletionsUrl(baseUrl)
  const requestMessages = [
    { role: 'system' as const, content: FORMULA_SYSTEM_PROMPT },
    ...messages
  ]

  // 调试日志不得打印 apiKey。
  console.log('[openai][request] start', {
    url,
    messageCount: requestMessages.length,
    model: 'gpt-5.5',
    stream: true,
    hasSystemPrompt: true
  })

  const response = await fetchImpl(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5.5',
      stream: true,
      messages: requestMessages
    }),
    signal
  })

  console.log('[openai][request] response status', response.status, response.ok)

  if (!response.ok) {
    const message = await getResponseError(response)
    console.error('[openai][request] http error', {
      status: response.status,
      message
    })
    throw new OpenAIRequestError(message, response.status)
  }

  if (!response.body) {
    console.error('[openai][request] missing response body', response.status)
    throw new OpenAIRequestError('响应中没有可读取的数据流', response.status)
  }

  /** 累计本次 SSE 全部文本增量，请求彻底结束后作为测试日志输出。 */
  let fullStreamContent = ''

  try {
    await parseOpenAIStream(response.body, (delta) => {
      fullStreamContent += delta
      onDelta(delta)
    })
  } finally {
    // 无论正常 [DONE]、读完流，还是中途 abort/解析失败，都打印已收到的完整拼接内容。
    console.log('[openai][request] full stream content', fullStreamContent)
  }

  console.log('[openai][request] stream finished')
}
