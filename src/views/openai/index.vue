<template>
  <!--
    OpenAI 流式聊天页结构：
    1. header.config-panel：临时配置区（不持久化）
    2. section.message-list：消息列表（助手消息 v-html 渲染 Markdown/公式）
    3. footer.composer-panel：输入、提交、历史开关、错误提示
  -->
  <main class="chat-shell">
    <!-- 顶部：Base URL / API Key；仅保存在当前组件实例内存中 -->
    <header class="config-panel">
      <div class="brand-block">
        <span class="eyebrow">STREAM CONSOLE</span>
        <h1>OpenAI 对话实验室</h1>
        <p>API Key 仅保留在当前页面内存；对话历史保存在本地 IndexedDB，刷新后自动恢复最近 10 轮。</p>
      </div>

      <div class="config-fields">
        <label>
          <span>Base URL</span>
          <input
            v-model="baseUrl"
            data-testid="base-url"
            type="url"
            autocomplete="off"
            placeholder="https://example.com/v1"
          />
        </label>
        <label>
          <span>API Key</span>
          <input
            v-model="apiKey"
            data-testid="api-key"
            type="password"
            autocomplete="off"
            placeholder="sk-..."
          />
        </label>
      </div>

      <p class="security-note">
        浏览器将直接向目标接口发送密钥；目标服务必须允许跨域请求。
      </p>
    </header>

    <!-- 中部：动态消息列表；aria-live 便于读屏感知流式更新 -->
    <section ref="messageList" class="message-list" aria-live="polite">
      <div v-if="messages.length === 0" class="empty-state">
        <span>01</span>
        <h2>等待第一条消息</h2>
        <p>模型固定为 gpt-5.5，响应内容将在此处实时展开。</p>
      </div>

      <article
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="[
          `message--${message.role}`,
          { 'message--error': message.status === 'error' }
        ]"
        :data-role="message.role"
      >
        <div class="message-meta">
          <span>{{ message.role === 'user' ? 'YOU' : 'AI' }}</span>
          <span v-if="message.status === 'streaming'" class="streaming-dot">
            生成中
          </span>
          <span v-else-if="message.status === 'error'">响应中断</span>
        </div>
        <!-- 助手：Markdown + KaTeX；内容已在 renderMarkdown 内消毒 -->
        <div
          v-if="message.content && message.role === 'assistant'"
          class="message-body markdown-body"
          v-html="renderMarkdown(message.content)"
        />
        <!-- 用户：纯文本插值，避免把用户输入当 HTML 执行 -->
        <p v-else-if="message.content" class="message-body">
          {{ message.content }}
        </p>
        <p v-else class="message-placeholder">正在连接模型…</p>
      </article>
    </section>

    <footer class="composer-panel">
      <p v-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </p>

      <!-- Enter 提交；Shift+Enter 由 textarea 默认行为换行（未 .prevent） -->
      <form @submit.prevent="submit">
        <label class="visually-hidden" for="message-input">
          输入消息
        </label>
        <textarea
          id="message-input"
          v-model="input"
          data-testid="message-input"
          rows="3"
          placeholder="输入消息，Enter 发送，Shift + Enter 换行"
          :disabled="isLoading"
          @keydown.enter.exact.prevent="submit"
        />
        <!-- 流式进行中：显示停止按钮，主动 abort 当前 SSE -->
        <button
          v-if="isLoading"
          type="button"
          class="stop-button"
          data-testid="stop-stream"
          @click="stopStream"
        >
          <span>停止生成</span>
          <span aria-hidden="true">■</span>
        </button>
        <button v-else type="submit">
          <span>发送消息</span>
          <span aria-hidden="true">↗</span>
        </button>
      </form>

      <!-- 默认开启：携带完整已完成历史；关闭后仅发本次用户输入 -->
      <div class="history-toolbar">
        <label class="history-setting">
          <input
            v-model="includeHistory"
            data-testid="include-history"
            type="checkbox"
            :disabled="isLoading"
          />
          <span class="switch" aria-hidden="true"></span>
          <span>
            <strong>携带历史消息</strong>
            <small>关闭后仅发送本次输入</small>
          </span>
        </label>

        <button
          type="button"
          class="clear-history-button"
          data-testid="clear-history"
          :disabled="isLoading"
          @click="clearLocalHistory"
        >
          清理历史会话
        </button>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
/**
 * `/openai` 流式聊天页。
 *
 * 布局：顶部配置（Base URL / API Key）→ 中部消息列表 → 底部输入与历史开关。
 *
 * 关键约束：
 * - Base URL、API Key、消息列表只存在组件内存中；离开路由后不落盘。
 * - API Key 会由浏览器直连第三方接口；页面需提示 CORS / 密钥暴露风险。
 * - 助手消息走 Markdown + KaTeX 渲染；用户消息保持纯文本，避免把用户输入当 HTML。
 * - 对话消息在每轮结束后写入 IndexedDB；刷新后自动载入最近 10 轮。
 * - 请求进行中禁止重复提交；可通过“停止生成”主动 abort 当前 SSE。
 * - 卸载时 abort 进行中的请求并清空 apiKey（不清理 IndexedDB 历史）。
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  streamChat,
  type ChatRequestMessage
} from '@/services/openai'
import {
  clearChatHistory,
  loadRecentChatRounds,
  saveChatMessages,
  type StoredChatMessage
} from '@/services/chatHistoryDb'
import { renderMarkdown } from '@/utils/renderMarkdown'
/** KaTeX 公式排版样式；必须与 renderMarkdown 中的 KaTeX HTML 配套引入。 */
import 'katex/dist/katex.min.css'

/**
 * 页面消息模型。
 * - `id`：稳定列表 key
 * - `status`：仅 UI 使用，发往接口时会被剥掉，只保留 role/content
 * - `createdAt`：本地排序与 IndexedDB 持久化时间戳
 */
interface ViewMessage extends ChatRequestMessage {
  id: string
  status?: 'streaming' | 'complete' | 'error'
  createdAt: number
}

/** 用户填写的 OpenAI 兼容服务根地址。 */
const baseUrl = ref('')
/** 用户填写的 API Key；组件卸载时主动清空。 */
const apiKey = ref('')
/** 输入框草稿。 */
const input = ref('')
/** 是否携带历史消息；默认开启以支持多轮对话。 */
const includeHistory = ref(true)
/** 当前会话内的全部可见消息（含流式中的助手占位消息）。 */
const messages = ref<ViewMessage[]>([])
/** 是否有进行中的流式请求。 */
const isLoading = ref(false)
/** 页面级错误文案（校验失败 / 网络失败 / 流解析失败等）。 */
const errorMessage = ref('')
/** 消息列表滚动容器，用于自动滚到底部。 */
const messageList = ref<HTMLElement>()
/** 当前请求的 AbortController；卸载或替换请求时使用。 */
let activeController: AbortController | undefined
/** 递增以作废进行中的历史恢复，避免卸载后的异步结果回写消息列表。 */
let historyLoadToken = 0

/** 创建一条带本地唯一 id 的消息对象。 */
function createMessage(
  role: ViewMessage['role'],
  content: string,
  status?: ViewMessage['status']
): ViewMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    status,
    createdAt: Date.now()
  }
}

function toStoredMessage(message: ViewMessage): StoredChatMessage | null {
  if (message.status === 'streaming') {
    return null
  }

  if (message.role === 'assistant' && !message.content) {
    return null
  }

  return {
    id: message.id,
    role: message.role,
    content: message.content,
    status:
      message.status === 'complete' || message.status === 'error'
        ? message.status
        : message.role === 'assistant'
          ? 'complete'
          : undefined,
    createdAt: message.createdAt
  }
}

/** 将本轮已稳定的用户/助手消息写入 IndexedDB。 */
async function persistTurn(messagesToSave: ViewMessage[]) {
  const payload = messagesToSave
    .map(toStoredMessage)
    .filter((item): item is StoredChatMessage => item !== null)

  if (payload.length === 0) {
    return
  }

  try {
    await saveChatMessages(payload)
  } catch (error) {
    console.error('[openai][page] persist history failed', error)
  }
}

/** 刷新后从 IndexedDB 恢复最近对话轮次。 */
async function restoreLocalHistory() {
  const loadToken = ++historyLoadToken

  try {
    const stored = await loadRecentChatRounds()
    if (loadToken !== historyLoadToken) {
      console.log('[openai][page] skip stale history restore', { loadToken })
      return
    }

    // IndexedDB 完成可能晚于用户已开始输入/发送；勿覆盖进行中的会话。
    if (messages.value.length > 0 || isLoading.value) {
      console.log('[openai][page] skip history restore; session already active', {
        messageCount: messages.value.length,
        isLoading: isLoading.value
      })
      return
    }

    messages.value = stored.map((item) => ({
      id: item.id,
      role: item.role,
      content: item.content,
      status: item.status,
      createdAt: item.createdAt
    }))
    console.log('[openai][page] restored local history', {
      count: messages.value.length
    })
    if (messages.value.length > 0) {
      await scrollToBottom()
    }
  } catch (error) {
    if (loadToken !== historyLoadToken) {
      return
    }
    console.error('[openai][page] restore history failed', error)
  }
}

/** 清理本地全部历史，并清空当前页面消息列表。 */
async function clearLocalHistory() {
  if (isLoading.value) {
    return
  }

  // 作废进行中的恢复，避免 clear 后异步 restore 把旧数据写回。
  historyLoadToken += 1

  try {
    await clearChatHistory()
    messages.value = []
    errorMessage.value = ''
    console.log('[openai][page] local history cleared')
  } catch (error) {
    errorMessage.value = '清理本地历史失败，请重试'
    console.error('[openai][page] clear history failed', error)
  }
}

/** 等 DOM 更新后把消息列表滚到最底部，保证流式输出可见。 */
async function scrollToBottom() {
  await nextTick()
  messageList.value?.scrollTo?.({
    top: messageList.value.scrollHeight,
    behavior: 'smooth'
  })
}

/**
 * 提交前校验。
 * @returns 空字符串表示通过；非空为应展示的错误文案。
 */
function validate(content: string): string {
  if (!baseUrl.value.trim()) {
    return '请输入 Base URL'
  }

  if (!apiKey.value.trim()) {
    return '请输入 API Key'
  }

  if (!content) {
    return '请输入消息内容'
  }

  return ''
}

/**
 * 构造“可发送的历史上下文”。
 * 规则：
 * - 用户消息一律纳入（它们没有 status，或视为已确认输入）
 * - 助手消息仅纳入 `status === 'complete'` 的完整回复
 * - 排除当前仍在 streaming / error 的占位助手消息，避免把空串或半截错误状态发给模型
 */
function completedHistory(): ChatRequestMessage[] {
  return messages.value
    .filter(
      (message) =>
        message.role === 'user' || message.status === 'complete'
    )
    .map(({ role, content }) => ({ role, content }))
}

/**
 * 将未知异常转为面向用户的中文提示。
 * 注意：不得在文案中拼入 apiKey。
 */
function readableError(error: unknown): string {
  if (error instanceof Error && error.name === 'AbortError') {
    return '已停止生成'
  }

  // 浏览器在 CORS / 网络失败时常抛 TypeError: Failed to fetch。
  if (error instanceof TypeError) {
    return '网络请求失败，请检查 Base URL、目标服务跨域配置和网络连接'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return '请求失败，请检查地址、跨域配置和网络连接'
}

/**
 * 主动断开当前 SSE：abort AbortController。
 * fetch / 流读取会以 AbortError 结束，由 submit 的 catch 收敛 UI 状态。
 */
function stopStream() {
  if (!activeController) {
    console.log('[openai][page] stop ignored: no active request')
    return
  }

  console.log('[openai][page] stop stream requested')
  activeController.abort()
}

/**
 * 提交一轮对话：
 * 1. 校验并清空上一次页面错误
 * 2. 立即插入用户消息 + 空的 streaming 助手消息（乐观 UI）
 * 3. 按历史开关组装请求 messages
 * 4. 流式追加助手内容；成功标 complete，失败保留已输出并标 error
 */
async function submit() {
  // 请求中直接忽略二次提交（按钮也会 disabled，这里是双保险）。
  if (isLoading.value) {
    console.log('[openai][page] submit ignored: already loading')
    return
  }

  const content = input.value.trim()
  const validationError = validate(content)

  if (validationError) {
    console.warn('[openai][page] validation failed', validationError)
    errorMessage.value = validationError
    return
  }

  errorMessage.value = ''
  // 注意：历史上下文在 push 占位助手消息之前就算好，避免把空助手消息带进请求。
  const requestMessages = includeHistory.value
    ? [...completedHistory(), { role: 'user' as const, content }]
    : [{ role: 'user' as const, content }]
  const userMessage = createMessage('user', content)
  const assistantMessage = createMessage('assistant', '', 'streaming')

  console.log('[openai][page] submit', {
    includeHistory: includeHistory.value,
    requestMessageCount: requestMessages.length,
    contentLength: content.length
  })

  messages.value.push(userMessage, assistantMessage)
  // 必须取数组里的响应式对象引用，后续 onDelta 才能触发视图更新。
  const reactiveAssistantMessage =
    messages.value[messages.value.length - 1]
  // 用户消息先落库；助手在本轮结束后再更新（同 id put）。
  void persistTurn([userMessage])
  input.value = ''
  isLoading.value = true
  const controller = new AbortController()
  activeController = controller
  await scrollToBottom()

  try {
    await streamChat({
      baseUrl: baseUrl.value,
      apiKey: apiKey.value,
      messages: requestMessages,
      signal: controller.signal,
      onDelta(delta) {
        console.log('delta::', delta);
        console.log('[openai][page] onDelta', delta)
        reactiveAssistantMessage.content += delta
        void scrollToBottom()
      }
    })
    reactiveAssistantMessage.status = 'complete'
    console.log('[openai][page] assistant complete', {
      contentLength: reactiveAssistantMessage.content.length
    })
  } catch (error) {
    // 保留已接收的部分文本，仅改状态并展示错误，便于用户看到中断前的内容。
    reactiveAssistantMessage.status = 'error'
    errorMessage.value = readableError(error)
    console.error('[openai][page] assistant error', error)
  } finally {
    isLoading.value = false
    activeController = undefined
    void persistTurn([userMessage, reactiveAssistantMessage])
  }
}

onMounted(() => {
  void restoreLocalHistory()
})

onBeforeUnmount(() => {
  // 离开页面时中止进行中的请求，并主动丢弃内存中的密钥。
  historyLoadToken += 1
  console.log('[openai][page] unmount', {
    hasActiveRequest: Boolean(activeController)
  })
  activeController?.abort()
  apiKey.value = ''
})
</script>

<style scoped>
:global(body) {
  margin: 0;
  background: #e9e7e0;
}

:global(*) {
  box-sizing: border-box;
}

.chat-shell {
  --ink: #17221d;
  --paper: #f5f2e9;
  --acid: #c8ff45;
  --line: rgba(23, 34, 29, 0.2);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 100vh;
  max-height: 100vh;
  color: var(--ink);
  background:
    linear-gradient(rgba(23, 34, 29, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 34, 29, 0.045) 1px, transparent 1px),
    var(--paper);
  background-size: 32px 32px;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}

.config-panel {
  display: grid;
  grid-template-columns: minmax(230px, 0.8fr) minmax(420px, 1.5fr);
  gap: 24px 48px;
  padding: 24px clamp(24px, 5vw, 72px);
  border-bottom: 1px solid var(--line);
  background: rgba(245, 242, 233, 0.94);
  backdrop-filter: blur(14px);
}

.brand-block h1 {
  margin: 4px 0 6px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3vw, 42px);
  font-weight: 500;
  line-height: 1;
}

.brand-block p,
.security-note {
  margin: 0;
  color: rgba(23, 34, 29, 0.66);
  font-size: 12px;
}

.eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.config-fields {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14px;
  align-self: center;
}

.config-fields label {
  display: grid;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.config-fields input {
  width: 100%;
  border: 1px solid var(--ink);
  border-radius: 0;
  padding: 12px 14px;
  color: var(--ink);
  background: transparent;
  outline: none;
}

.config-fields input:focus {
  box-shadow: 4px 4px 0 var(--acid);
}

.security-note {
  grid-column: 2;
}

.message-list {
  overflow-y: auto;
  padding: 40px clamp(24px, 8vw, 120px) 56px;
  scrollbar-color: var(--ink) transparent;
}

.empty-state {
  max-width: 520px;
  margin: 8vh auto 0;
  text-align: center;
}

.empty-state > span {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--ink);
  border-radius: 50%;
  font: 700 12px/1 monospace;
}

.empty-state h2 {
  margin: 20px 0 8px;
  font: 500 clamp(30px, 5vw, 62px)/1 Georgia, serif;
}

.empty-state p {
  color: rgba(23, 34, 29, 0.6);
}

.message {
  width: min(76%, 760px);
  margin-bottom: 28px;
  animation: message-in 240ms ease-out both;
}

.message--user {
  margin-left: auto;
}

.message--assistant {
  margin-right: auto;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  font: 700 10px/1 monospace;
  letter-spacing: 0.12em;
}

.message-body,
.message-placeholder {
  margin: 0;
  border: 1px solid var(--ink);
  padding: 16px 18px;
  overflow-wrap: anywhere;
  line-height: 1.65;
  background: rgba(245, 242, 233, 0.92);
  box-shadow: 6px 6px 0 rgba(23, 34, 29, 0.12);
}

.message--user .message-body {
  white-space: pre-wrap;
  background: var(--ink);
  color: var(--paper);
  box-shadow: 6px 6px 0 var(--acid);
}

.message--error .message-body {
  border-color: #b4422d;
}

.message-placeholder {
  color: rgba(23, 34, 29, 0.5);
}

.markdown-body :deep(> :first-child) {
  margin-top: 0;
}

.markdown-body :deep(> :last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 1.1em 0 0.45em;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h3) {
  font-size: 1.15em;
}

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.55em 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.35em;
}

.markdown-body :deep(li + li) {
  margin-top: 0.25em;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 0.85em 0;
  border-collapse: collapse;
  font-size: 0.94em;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

.markdown-body :deep(th) {
  background: rgba(23, 34, 29, 0.06);
  font-weight: 700;
}

.markdown-body :deep(code) {
  border: 1px solid var(--line);
  padding: 0.1em 0.35em;
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.92em;
  background: rgba(23, 34, 29, 0.05);
}

.markdown-body :deep(pre) {
  overflow-x: auto;
  margin: 0.85em 0;
  border: 1px solid var(--line);
  padding: 12px 14px;
  background: rgba(23, 34, 29, 0.05);
}

.markdown-body :deep(pre code) {
  border: 0;
  padding: 0;
  background: transparent;
}

.markdown-body :deep(blockquote) {
  margin: 0.85em 0;
  border-left: 3px solid var(--ink);
  padding-left: 12px;
  color: rgba(23, 34, 29, 0.72);
}

.markdown-body :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(.katex-display) {
  margin: 0.9em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.markdown-body :deep(.katex) {
  font-size: 1.05em;
}

.streaming-dot::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 0 4px rgba(200, 255, 69, 0.25);
  animation: pulse 1s infinite;
}

.composer-panel {
  padding: 18px clamp(24px, 5vw, 72px) 22px;
  border-top: 1px solid var(--line);
  background: rgba(245, 242, 233, 0.96);
  backdrop-filter: blur(14px);
}

.composer-panel form {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: stretch;
  border: 1px solid var(--ink);
  background: var(--paper);
}

.composer-panel form:focus-within {
  box-shadow:
    0 0 0 3px var(--acid),
    0 0 0 5px var(--ink);
}

.composer-panel textarea {
  min-height: 76px;
  resize: none;
  border: 0;
  padding: 15px 17px;
  color: var(--ink);
  background: transparent;
  outline: none;
  font: inherit;
  line-height: 1.5;
}

.composer-panel textarea:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: -5px;
}

.composer-panel button {
  display: flex;
  align-items: center;
  gap: 18px;
  border: 0;
  border-left: 1px solid var(--ink);
  padding: 0 22px;
  color: var(--paper);
  background: var(--ink);
  cursor: pointer;
  font-weight: 700;
}

.composer-panel button:hover:not(:disabled) {
  color: var(--ink);
  background: var(--acid);
}

.composer-panel .stop-button {
  color: var(--paper);
  background: #9f2f20;
}

.composer-panel .stop-button:hover:not(:disabled) {
  color: var(--paper);
  background: #b4422d;
}

.composer-panel button:disabled,
.composer-panel textarea:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.history-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.history-setting {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 0;
  cursor: pointer;
}

.clear-history-button {
  border: 1px solid var(--ink);
  padding: 8px 12px;
  color: var(--ink);
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.clear-history-button:hover:not(:disabled) {
  background: var(--acid);
}

.clear-history-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.history-setting input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.history-setting input:focus-visible + .switch {
  outline: 3px solid var(--ink);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px var(--acid);
}

.switch {
  position: relative;
  width: 38px;
  height: 20px;
  border: 1px solid var(--ink);
  background: transparent;
}

.switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  background: var(--ink);
  transition: transform 160ms ease;
}

.history-setting input:checked + .switch {
  background: var(--acid);
}

.history-setting input:checked + .switch::after {
  transform: translateX(18px);
}

.history-setting strong,
.history-setting small {
  display: block;
}

.history-setting strong {
  font-size: 12px;
}

.history-setting small {
  color: rgba(23, 34, 29, 0.55);
  font-size: 10px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.error-message {
  margin: 0 0 10px;
  color: #9f2f20;
  font-size: 13px;
}

@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

@keyframes pulse {
  50% {
    opacity: 0.42;
  }
}

@media (max-width: 760px) {
  .config-panel {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .config-fields {
    grid-template-columns: 1fr;
  }

  .security-note {
    grid-column: 1;
  }

  .message {
    width: 92%;
  }

  .composer-panel form {
    grid-template-columns: 1fr;
  }

  .composer-panel button {
    justify-content: center;
    min-height: 46px;
    border-top: 1px solid var(--ink);
    border-left: 0;
  }
}
</style>
