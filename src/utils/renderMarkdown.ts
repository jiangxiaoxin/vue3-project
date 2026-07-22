/**
 * Markdown + 公式渲染工具。
 *
 * 管线：
 * 1. `normalizeMathDelimiters` 兼容模型常见的非标准公式分隔符
 * 2. `marked` 解析 GFM Markdown（标题、表格、列表等）
 * 3. `marked-katex-extension` 将 `$...$` / `$$...$$` 转为 KaTeX HTML
 * 4. 通过 `katex/contrib/mhchem` 支持化学式（如 `\ce{H2O}`）
 * 5. `DOMPurify` 消毒后再交给 `v-html`，降低 XSS 风险
 *
 * 约束：
 * - `throwOnError: false`：流式过程中公式可能暂时不完整，不因单次解析失败中断整段渲染。
 * - `output: 'html'`：减少 MathML 被消毒器误删的问题；同时 PURIFY_OPTIONS 仍放行常见 MathML 标签以兼容扩展输出。
 * - 本函数只负责“字符串 → 安全 HTML”，不负责缓存或防抖；页面在流式更新时会频繁调用。
 */

import DOMPurify from 'dompurify'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
/** 副作用导入：为 KaTeX 注册 `\ce` 等化学宏。 */
import 'katex/contrib/mhchem'

marked.setOptions({
  gfm: true,
  /** 将单个换行转为 `<br>`，更贴近聊天场景的排版预期。 */
  breaks: true
})

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
    /**
     * 允许更宽松的分隔符识别，降低模型输出轻微不规范 LaTeX 时完全无法渲染的概率。
     */
    nonStandard: true
  })
)

/**
 * DOMPurify 额外放行的数学相关标签/属性。
 * KaTeX 在部分模式下仍可能输出 MathML；默认白名单不够时公式会被掏空。
 */
const PURIFY_OPTIONS: DOMPurify.Config = {
  ADD_TAGS: [
    'math',
    'annotation',
    'semantics',
    'mrow',
    'mi',
    'mo',
    'mn',
    'ms',
    'mtext',
    'mspace',
    'msqrt',
    'mroot',
    'mfrac',
    'msub',
    'msup',
    'msubsup',
    'munder',
    'mover',
    'munderover',
    'mmultiscripts',
    'mprescripts',
    'mtable',
    'mtr',
    'mtd',
    'mlabeledtr',
    'menclose',
    'mphantom',
    'mpadded'
  ],
  ADD_ATTR: [
    'encoding',
    'xmlns',
    'mode',
    'mathvariant',
    'displaystyle',
    'scriptlevel',
    'stretchy',
    'fence',
    'separator',
    'accent',
    'accentunder',
    'depth',
    'height',
    'width',
    'lspace',
    'voffset',
    'columnalign',
    'columnspacing',
    'rowspacing',
    'columnlines',
    'rowlines',
    'frame',
    'framespacing',
    'rowalign',
    'columnwidth',
    'notation',
    'aria-hidden'
  ]
}

/** 粗略判断一段文本是否像数学公式，避免把普通方括号块误当成公式。 */
function looksLikeMath(body: string): boolean {
  return /\\[a-zA-Z]+/.test(body) || /[≠≈≤≥±∞∑∫√]/.test(body)
}

/**
 * 将模型常见的非标准公式分隔符规范为 `$` / `$$`。
 *
 * 兼容：
 * - `\[...\]` / `\(...\)`：标准 LaTeX 分隔符（marked 可能会吃掉反斜杠，故需前置转换）
 * - 独立成行的裸 `[` `]` 包裹且正文含 LaTeX 命令：部分模型会这样输出块级公式
 *
 * 不处理 Markdown 链接 `[text](url)`，因其不是“方括号独占一行”的结构。
 */
export function normalizeMathDelimiters(markdown: string): string {
  let text = markdown

  // \[ ... \] → $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, body: string) => {
    return `$$${body}$$`
  })

  // \( ... \) → $ ... $
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_match, body: string) => {
    return `$${body}$`
  })

  // 裸多行方括号块：仅当内容像公式时才转换
  text = text.replace(
    /(^|\n)\[\s*\n([\s\S]*?)\n\s*\](?=\n|$)/g,
    (match, prefix: string, body: string) => {
      if (!looksLikeMath(body)) {
        return match
      }

      return `${prefix}$$\n${body.trim()}\n$$`
    }
  )

  return text
}

/**
 * 将 Markdown（可含 LaTeX / mhchem）渲染为可安全注入 DOM 的 HTML 字符串。
 *
 * @param markdown - 原始 Markdown 文本；允许为空字符串
 * @returns 已消毒的 HTML；调用方通常用于助手消息的 `v-html`
 */
export function renderMarkdown(markdown: string): string {
  const normalized = normalizeMathDelimiters(markdown)

  if (normalized !== markdown) {
    console.log('[openai][markdown] normalized math delimiters')
  }

  // marked.parse 在 async:false 时同步返回 string；显式断言避免 Promise 联合类型干扰调用方。
  const html = marked.parse(normalized, { async: false }) as string
  return DOMPurify.sanitize(html, PURIFY_OPTIONS)
}
