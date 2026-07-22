# OpenAI 流式聊天页面设计

## 目标

在现有 Vue 3 项目中新增 `/openai` 路由，提供一个直接调用 OpenAI 兼容 `chat/completions` 接口的临时聊天页面。用户在页面顶部输入 Base URL 和 API Key；这些配置只保存在组件内存中，离开页面后不保存。

页面支持动态渲染用户和 AI 消息，并在接口返回 SSE 流时逐段更新 AI 消息。

## 范围

本次实现包含：

- `/openai` 懒加载路由。
- Base URL 和 API Key 输入。
- 动态消息列表。
- 消息输入、提交和流式响应。
- 是否发送全部历史消息的设置开关，默认开启。
- 请求状态、输入校验和错误展示。
- SSE 流解析及自动化测试。

本次不包含：

- 配置或聊天记录持久化。
- 服务端代理。
- Markdown 渲染、代码高亮、文件上传或会话管理。
- 中止生成、重新生成或编辑历史消息。

## 安全边界

API Key 将由浏览器直接通过 `Authorization: Bearer <key>` 发送给用户填写的第三方地址。它不会写入 `localStorage`、`sessionStorage`、Cookie、URL、Pinia 或其他持久化位置。

浏览器直连仍会使 Key 对当前浏览器环境可见，并且目标服务必须允许跨域请求。页面应明确提示这是临时直连模式，不能将该方案视为生产环境的密钥保护机制。

## 文件结构

- `src/views/openai/index.vue`
  - 页面布局和交互。
  - 管理配置、消息、输入、开关、加载及错误状态。
  - 调用聊天服务并把增量文本追加到当前 AI 消息。
- `src/services/openai.ts`
  - 定义聊天消息和请求参数类型。
  - 规范化 Base URL，并拼接 `/chat/completions`。
  - 发起 `fetch` 请求，设置 `model: "gpt-5.5"` 和 `stream: true`。
  - 校验 HTTP 状态和响应体，将数据流交给解析器。
- `src/utils/parseOpenAIStream.ts`
  - 增量解码 `ReadableStream<Uint8Array>`。
  - 缓存跨网络数据块拆分的不完整行。
  - 解析 SSE `data:` 字段、JSON 增量和 `[DONE]`。
  - 将 `choices[0].delta.content` 交给调用方。
- `src/utils/__tests__/parseOpenAIStream.spec.ts`
  - 覆盖流解析边界。
- `src/router/index.ts`
  - 注册 `/openai` 路由。

## 页面布局

页面使用占满视口的三段式布局：

1. 顶部配置区
   - Base URL 输入框。
   - API Key 密码输入框。
   - 显示临时直连与 CORS 风险提示。
2. 中部消息区
   - 可滚动。
   - 用户消息和 AI 消息使用不同方向与视觉样式。
   - AI 流式生成时实时更新同一条消息，并显示生成状态。
   - 新消息和新内容到达时自动滚动到底部。
3. 底部输入区
   - 多行文本框和提交按钮。
   - `Enter` 提交，`Shift+Enter` 换行。
   - 下方提供“携带历史消息”开关，默认开启。
   - 请求期间禁用重复提交。

## 消息模型

页面消息使用以下逻辑结构：

```ts
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  status?: 'streaming' | 'complete' | 'error'
}
```

`id` 用作稳定渲染键。`status` 只服务于页面展示，发送接口时只保留 `role` 和 `content`。

## 请求流程

1. 用户提交消息。
2. 页面拒绝以下情况：
   - Base URL 为空。
   - API Key 为空。
   - 消息去除首尾空白后为空。
   - 已有请求正在执行。
3. 页面立即追加用户消息，并追加一条空的 `streaming` AI 消息。
4. 构建请求消息：
   - 开关开启：发送提交后消息列表中所有已完成的用户和 AI 消息，不包含刚创建的空 AI 占位消息。
   - 开关关闭：只发送本次用户消息。
5. 请求 `${规范化后的 Base URL}/chat/completions`：
   - Method：`POST`
   - Header：`Content-Type: application/json`
   - Header：`Authorization: Bearer <API Key>`
   - Body：`{ model: "gpt-5.5", stream: true, messages }`
6. 每个内容增量追加到本次 AI 消息的 `content`。
7. 收到 `[DONE]` 或流正常结束后，将 AI 消息标记为 `complete`。
8. 恢复提交状态并保持输入框可继续对话。

Base URL 会移除末尾的 `/`，因此输入 `https://example.com/v1` 时请求地址为 `https://example.com/v1/chat/completions`。

## SSE 解析

解析器不得假设一个网络数据块对应一个 SSE 事件：

- 使用同一个 `TextDecoder` 以流模式解码。
- 将解码结果追加到文本缓冲区。
- 按换行切出完整行，并保留最后一条不完整行。
- 忽略空行、注释行和非 `data:` 字段。
- `data: [DONE]` 表示正常结束。
- 其他 `data:` 内容按 JSON 解析。
- 提取 `choices[0].delta.content`；不存在文本内容时忽略。
- 流结束后处理缓冲区中剩余的完整数据。

无效 JSON 不应静默吞掉，应转换为可展示的流解析错误。

## 错误处理

- 非 2xx 响应：优先读取 OpenAI 兼容错误体中的 `error.message`，否则展示状态码。
- 网络或 CORS 失败：展示浏览器直连、目标服务跨域配置和地址可用性的提示。
- 流中断或解析失败：
  - 保留已经收到的文本。
  - 将当前 AI 消息标记为 `error`。
  - 页面展示错误信息。
- 新一次提交时清除上一次页面级错误。
- 不在日志或错误信息中输出 API Key。

## 测试

解析器单元测试至少覆盖：

- 一个数据块中的单个内容事件。
- 一个数据块中的多个事件。
- 一个 JSON 事件被拆到多个数据块。
- UTF-8 多字节字符跨数据块。
- 不含内容的角色事件。
- `[DONE]` 正常结束。
- 无效 JSON 抛出明确错误。

页面行为测试覆盖：

- 历史开关开启时发送全部已有对话。
- 历史开关关闭时只发送本次消息。
- 必填配置或消息为空时不发送请求。
- 流式增量更新同一条 AI 消息。

## 验收标准

- 访问 `/openai` 可看到完整聊天页面。
- Base URL、API Key 和消息填写正确时可发起 OpenAI 兼容流式请求。
- AI 内容到达时无需等待完整响应即可逐段显示。
- 消息列表能够连续展示多轮用户和 AI 消息。
- 历史消息开关默认开启，关闭后请求只包含本次用户消息。
- 离开并重新进入路由后，Base URL、API Key 和消息均被清空。
- 请求失败时页面可恢复操作，并且不会泄露 API Key。
