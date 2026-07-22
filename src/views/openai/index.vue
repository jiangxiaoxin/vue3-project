<template>
  <main class="chat-shell">
    <header class="config-panel">
      <div class="brand-block">
        <span class="eyebrow">STREAM CONSOLE</span>
        <h1>OpenAI 对话实验室</h1>
        <p>配置仅保留在当前页面内存中，关闭页面后自动清除。</p>
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
        <div
          v-if="message.content && message.role === 'assistant'"
          class="message-body markdown-body"
          v-html="renderMarkdown(message.content)"
        />
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
        <button type="submit" :disabled="isLoading">
          <span>{{ isLoading ? '接收中' : '发送消息' }}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </form>

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
    </footer>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import {
  streamChat,
  type ChatRequestMessage
} from '@/services/openai'
import { renderMarkdown } from '@/utils/renderMarkdown'

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

function createMessage(
  role: ViewMessage['role'],
  content: string,
  status?: ViewMessage['status']
): ViewMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    status
  }
}

async function scrollToBottom() {
  await nextTick()
  messageList.value?.scrollTo?.({
    top: messageList.value.scrollHeight,
    behavior: 'smooth'
  })
}

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

function completedHistory(): ChatRequestMessage[] {
  return messages.value
    .filter(
      (message) =>
        message.role === 'user' || message.status === 'complete'
    )
    .map(({ role, content }) => ({ role, content }))
}

function readableError(error: unknown): string {
  if (error instanceof Error && error.name === 'AbortError') {
    return '请求已结束'
  }

  if (error instanceof TypeError) {
    return '网络请求失败，请检查 Base URL、目标服务跨域配置和网络连接'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return '请求失败，请检查地址、跨域配置和网络连接'
}

async function submit() {
  if (isLoading.value) {
    return
  }

  const content = input.value.trim()
  const validationError = validate(content)

  if (validationError) {
    errorMessage.value = validationError
    return
  }

  errorMessage.value = ''
  const requestMessages = includeHistory.value
    ? [...completedHistory(), { role: 'user' as const, content }]
    : [{ role: 'user' as const, content }]
  const userMessage = createMessage('user', content)
  const assistantMessage = createMessage('assistant', '', 'streaming')

  messages.value.push(userMessage, assistantMessage)
  const reactiveAssistantMessage =
    messages.value[messages.value.length - 1]
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
        reactiveAssistantMessage.content += delta
        void scrollToBottom()
      }
    })
    reactiveAssistantMessage.status = 'complete'
  } catch (error) {
    reactiveAssistantMessage.status = 'error'
    errorMessage.value = readableError(error)
  } finally {
    isLoading.value = false
    activeController = undefined
  }
}

onBeforeUnmount(() => {
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

.composer-panel button:disabled,
.composer-panel textarea:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.history-setting {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  cursor: pointer;
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
