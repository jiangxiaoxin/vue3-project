# OpenAI Streaming Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Vue 3 项目中新增 `/openai` 路由页，支持浏览器直连 OpenAI 兼容接口并以 SSE 流式渲染 AI 回复。

**Architecture:** 页面负责配置、消息状态与交互；`streamChat` 负责请求构造与 HTTP 错误处理；`parseOpenAIStream` 负责跨 chunk 的 SSE 增量解析。三者通过明确类型接口协作，不引入 OpenAI SDK。

**Tech Stack:** Vue 3 + TypeScript + Vue Router + Vitest + `@vue/test-utils` + 原生 `fetch` / `ReadableStream`

## Global Constraints

- 路由：`/openai`，懒加载 `src/views/openai/index.vue`
- 模型固定：`gpt-5.5`（代码常量，不提供 UI）
- Base URL 为服务根地址，规范化后拼接 `/chat/completions`
- API Key / Base URL / 消息均仅存组件内存，不写入任何持久化存储
- 历史开关默认开启；关闭后只发送本次用户消息
- 不实现服务端代理、Markdown、中止生成、会话持久化
- 错误信息不得包含 API Key
- 测试命令：`npm run test:unit -- --run <files>`

## File Structure

| 文件 | 职责 |
|------|------|
| `src/utils/parseOpenAIStream.ts` | SSE 流增量解析 |
| `src/utils/__tests__/parseOpenAIStream.spec.ts` | 解析器单元测试 |
| `src/services/openai.ts` | `buildChatCompletionsUrl`、`streamChat`、请求错误类型 |
| `src/services/__tests__/openai.spec.ts` | 请求服务单元测试 |
| `src/views/openai/index.vue` | 聊天页面 UI 与交互 |
| `src/views/openai/__tests__/index.spec.ts` | 页面行为测试 |
| `src/router/index.ts` | 注册 `/openai` 路由 |

---

### Task 1: SSE 流解析器

**Files:**
- Create: `src/utils/parseOpenAIStream.ts`
- Test: `src/utils/__tests__/parseOpenAIStream.spec.ts`

**Interfaces:**
- Consumes: 无
- Produces:
  - `export class OpenAIStreamParseError extends Error`
  - `export async function parseOpenAIStream(stream: ReadableStream<Uint8Array>, onDelta: (content: string) => void): Promise<void>`

- [ ] **Step 1: Write the failing tests**

Create `src/utils/__tests__/parseOpenAIStream.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- --run src/utils/__tests__/parseOpenAIStream.spec.ts`

Expected: FAIL（`parseOpenAIStream` 未定义 / 模块不存在）

- [ ] **Step 3: Implement the parser**

Create `src/utils/parseOpenAIStream.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:unit -- --run src/utils/__tests__/parseOpenAIStream.spec.ts`

Expected: PASS（7 tests）

- [ ] **Step 5: Commit**

```bash
git add src/utils/parseOpenAIStream.ts src/utils/__tests__/parseOpenAIStream.spec.ts
git commit -m "$(cat <<'EOF'
feat: add OpenAI SSE stream parser

EOF
)"
```

---

### Task 2: OpenAI chat 请求服务

**Files:**
- Create: `src/services/openai.ts`
- Test: `src/services/__tests__/openai.spec.ts`

**Interfaces:**
- Consumes: `parseOpenAIStream(stream, onDelta)` from Task 1
- Produces:
  - `export interface ChatRequestMessage { role: 'user' | 'assistant'; content: string }`
  - `export interface StreamChatOptions { baseUrl: string; apiKey: string; messages: ChatRequestMessage[]; onDelta: (content: string) => void; signal?: AbortSignal; fetchImpl?: typeof fetch }`
  - `export class OpenAIRequestError extends Error { status?: number }`
  - `export function buildChatCompletionsUrl(baseUrl: string): string`
  - `export async function streamChat(options: StreamChatOptions): Promise<void>`

- [ ] **Step 1: Write the failing tests**

Create `src/services/__tests__/openai.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- --run src/services/__tests__/openai.spec.ts`

Expected: FAIL（`streamChat` / 模块不存在）

- [ ] **Step 3: Implement the service**

Create `src/services/openai.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:unit -- --run src/services/__tests__/openai.spec.ts`

Expected: PASS（4 tests）

- [ ] **Step 5: Commit**

```bash
git add src/services/openai.ts src/services/__tests__/openai.spec.ts
git commit -m "$(cat <<'EOF'
feat: add OpenAI streaming chat service

EOF
)"
```

---

### Task 3: 聊天页面、路由与页面行为测试

**Files:**
- Create: `src/views/openai/index.vue`
- Create: `src/views/openai/__tests__/index.spec.ts`
- Modify: `src/router/index.ts`（在现有路由数组末尾追加 `/openai`）

**Interfaces:**
- Consumes:
  - `streamChat(options: StreamChatOptions): Promise<void>`
  - `ChatRequestMessage`
- Produces:
  - Vue 页面组件默认导出
  - 路由：`{ path: '/openai', name: 'openai', component: () => import('@/views/openai/index.vue') }`

- [ ] **Step 1: Write the failing page tests**

Create `src/views/openai/__tests__/index.spec.ts`:

```ts
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
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- --run src/views/openai/__tests__/index.spec.ts`

Expected: FAIL（页面组件不存在）

- [ ] **Step 3: Implement the page and route**

Create `src/views/openai/index.vue` with:

1. 顶部：Base URL、API Key（password）、安全提示
2. 中部：消息列表（user / assistant 区分样式；streaming 状态；自动滚动）
3. 底部：textarea、提交按钮、`携带历史消息` 开关（默认 `true`）、错误提示
4. 交互：
   - 校验 Base URL / API Key / 非空消息；请求中禁止重复提交
   - `Enter` 提交，`Shift+Enter` 换行
   - 提交后立即追加 user 消息与空的 `streaming` assistant 消息
   - 开关开启：发送已完成历史 + 本次 user；关闭：仅本次 user
   - `onDelta` 追加到同一条 assistant 消息
   - 成功 → `complete`；失败 → 保留已有文本、`error` + 页面错误文案
   - `onBeforeUnmount` 时 abort 请求并清空 `apiKey`
5. 测试定位属性：
   - `data-testid="base-url"`
   - `data-testid="api-key"`
   - `data-testid="message-input"`
   - `data-testid="include-history"`
   - 消息节点：`data-role="user|assistant"`
   - 错误：`role="alert"`

页面核心逻辑骨架：

```ts
import { nextTick, onBeforeUnmount, ref } from 'vue'
import {
  streamChat,
  type ChatRequestMessage
} from '@/services/openai'

interface ViewMessage extends ChatRequestMessage {
  id: string
  status?: 'streaming' | 'complete' | 'error'
}

const baseUrl = ref('')
const apiKey = ref('')
const input = ref('')
const includeHistory = ref(true)
const messages = ref<ViewMessage[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const messageList = ref<HTMLElement>()
let activeController: AbortController | undefined

function completedHistory(): ChatRequestMessage[] {
  return messages.value
    .filter(
      (message) =>
        message.role === 'user' || message.status === 'complete'
    )
    .map(({ role, content }) => ({ role, content }))
}

async function submit() {
  if (isLoading.value) return

  const content = input.value.trim()
  // validate baseUrl / apiKey / content → set errorMessage and return

  errorMessage.value = ''
  const requestMessages = includeHistory.value
    ? [...completedHistory(), { role: 'user' as const, content }]
    : [{ role: 'user' as const, content }]

  // push user + streaming assistant
  // call streamChat({ baseUrl, apiKey, messages: requestMessages, signal, onDelta })
  // on success: assistant.status = 'complete'
  // on error: assistant.status = 'error'; errorMessage = readableError(error)
  // finally: isLoading = false
}

onBeforeUnmount(() => {
  activeController?.abort()
  apiKey.value = ''
})
```

在 `src/router/index.ts` 的 `config` 数组末尾追加：

```ts
{
  path: '/openai',
  name: 'openai',
  component: () => import('@/views/openai/index.vue')
}
```

- [ ] **Step 4: Run all related tests**

Run:

```bash
npm run test:unit -- --run src/utils/__tests__/parseOpenAIStream.spec.ts src/services/__tests__/openai.spec.ts src/views/openai/__tests__/index.spec.ts
```

Expected: PASS（17 tests）

- [ ] **Step 5: Manual smoke check**

Run: `npm run dev`

Visit: `http://localhost:3333/openai`

Checklist:
- 页面三段布局可见
- 空配置提交显示校验错误
- 填入 Base URL / API Key 后可发消息
- 流式内容逐段出现
- 关闭历史开关后第二次请求只带本次消息
- 切换离开 `/openai` 再回来，配置与消息清空

- [ ] **Step 6: Commit**

```bash
git add src/views/openai/index.vue src/views/openai/__tests__/index.spec.ts src/router/index.ts
git commit -m "$(cat <<'EOF'
feat: add OpenAI streaming chat page and route

EOF
)"
```

---

## Spec Coverage Checklist

| Spec 要求 | Task |
|-----------|------|
| `/openai` 懒加载路由 | Task 3 |
| Base URL + API Key 输入，仅内存保存 | Task 3 |
| 动态消息列表 + 流式更新 | Task 3 |
| 历史开关默认开 | Task 3 |
| `gpt-5.5` + `stream: true` + `/chat/completions` | Task 2 |
| SSE 跨 chunk / `[DONE]` / 无效 JSON | Task 1 |
| HTTP 错误优先读 `error.message` | Task 2 |
| CORS/网络失败可读提示 | Task 3 |
| 失败保留已生成文本 | Task 3 |
| 解析器与页面自动化测试 | Task 1–3 |
