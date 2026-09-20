export interface ColumnDef {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey: boolean
  comment?: string
  defaultValue?: string
}

export interface ForeignKeyDef {
  column: string
  refTable: string
  refColumn: string
}

export interface TableDef {
  name: string
  comment?: string
  columns: ColumnDef[]
  foreignKeys: ForeignKeyDef[]
}

export interface ParseResult {
  tables: TableDef[]
  errors: string[]
}

type ParsedColumn = ColumnDef & { _ref?: { refTable: string; refColumn: string } }

type QuoteChar = "'" | '"' | '`'

/**
 * 去除 SQL 中的行注释（-- 与 #）和块注释（/* *\/），返回清洗后的文本。
 * [这里展示了块注释里不能嵌套块注释：上面为了写明白 /* 开始和对应的结束，特意在 / 起那么加了转义字符，不加就已经认定在这里结束注释了]
 * 采用单趟字符扫描 + 引号状态机：一旦进入 ' " ` 就原样输出内容，
 * 因此 COMMENT 'a -- b' 这类字符串里的注释符不会被误删。
 *
 * @param input 原始 DDL 文本
 * @returns 去注释后的文本。块注释整体替换为一个空格（保留分词边界），行注释保留换行符位置
 */
function stripSqlComments(input: string): string {
  let out = ''
  // 当前所处的引号字符；null 表示不在字符串/标识符内部
  let quote: QuoteChar | null = null
  let i = 0
  while (i < input.length) {
    const ch = input[i]

    // —— 分支一：处于引号内，内容一律原样保留，不识别任何注释符 ——
    if (quote) { 
      out += ch
      // 反斜杠转义：把被转义的下一个字符一并吃掉（反引号标识符不支持转义，故排除）
      if (ch === '\\' && quote !== '`') { // 这里要把quote 是 ` 排除，因为 ` `之间都认为是普通的字符， \ 并不是为了转移，就是个普通的字符
        i += 2
        if (i < input.length) out += input[i - 1]
        continue
      }
      if (ch === quote) {
        // SQL 里连续两个相同引号表示转义成一个字面引号（'' → '），不能当作闭合
        // 对于 'it''s ok' 它实际表示字符串 it's ok,比如作为一个默认值
        // 但在ddl 中要用 '' 连续两个来表示一个单引号
        // 所起前面quote 已经开启引号了，现在ch 又遇到引号，那就还要继续判断它后面是不是引号。
        // 是引号，就是对应连续两个引号表示一个引号，所以不是引号区域结束了，i要跳过这两个引号，往后面走
        // 而如果后面不是引号，那就是遇到一个引号，这个引号就是前面引号的结束符，quote 就要重置了
        if (input[i + 1] === quote) {
          out += input[i + 1]
          i += 2
          continue
        }
        quote = null // 真正的闭合，退出引号状态
      }
      i++
      continue
    }

    // —— 分支二：遇到引号，进入引号状态 ——
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      out += ch
      i++
      continue
    }

    // —— 分支三：块注释 /* ... */ ——
    if (ch === '/' && input[i + 1] === '*') {
      // 补一个空格而非直接删除，避免 a/*x*/b 被粘连成 ab 导致分词错误
      // 举的这个例子如果直接去掉块注释的字符，a和b就会连在一起，导致
      const end = input.indexOf('*/', i + 2) // 一定是i+2
      // /* 开启的段注释，此时i是/，段落注释的开始和结束，最短中间就是什么都没有，则为/**/, 那/* 后面的闭合就是 indexOf(xx, i+2)
      // 找不到结束符（未闭合注释）则丢弃到末尾                                                                                                                                                                                                                                                                                                                                                                                                                                 
      i = end === -1 ? input.length : end + 2
      out += ' '
      continue
    }

    /**
     * 如果是 # 开头就认为后面都是注释
     * 如果是 - 开头，就继续判断后面是不是 --，再看第3个字符。
     * 如果第3个有，且是空白，这就是注释，
     * 如果有第3个但不是空白，那--整体不是注释。第1个 - 字符就会走入分支五，仅需加到output上
     * 如果没有第3个字符，那还是把这里当注释看，走进if了
     * 但这里直接就[i+1] [i+2]是很可能触发越界的，只是不报错而已,如果用其他语言来写这个解析，就可能会报错了
     */

    // —— 分支四：行注释 # 或 -- ——
    // MySQL 规定 -- 后必须紧跟空白符（或到行尾）才算注释，否则是减号，如 a--1
    if (ch === '#' || (ch === '-' && input[i + 1] === '-' && (/\s/.test(input[i + 2] ?? '') || i + 2 >= input.length))) {
      // i 停在 \n 上，换行符交给下一轮当普通字符输出，保持行结构
      const end = input.indexOf('\n', i)
      i = end === -1 ? input.length : end
      continue
    }

    // —— 分支五：普通字符，直接输出 ——
    out += ch
    i++
  }
  console.log('移除注释-------', out.length);
  console.log(out);
  
  console.log('-------------------------');
  

  
  return out
}

/**
 * 按 sep 切分，但只在括号深度为 0 且不在引号内时切，
 * 避免 DECIMAL(10,2)、ENUM('a,b')、注释字符串里的分号干扰。
 */
function splitTopLevel(input: string, sep: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: QuoteChar | null = null
  let current = ''
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      current += ch
      if (ch === '\\' && quote !== '`') {
        if (i + 1 < input.length) current += input[++i]
        continue
      }
      if (ch === quote) {
        // 在已经开启' 的情况下，再次遇到了 '，如果它后面还有一个'，则把它当成一个字符串字符，而不是结束符,
        // 如果后面不是'，则认为是当前的这个 ' 是闭合符，
        if (input[i + 1] === quote) current += input[++i]
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === sep && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += ch
  }
  parts.push(current)
  return parts
}

/** 按空白切分为 token，引号与括号内部不切分。 */
function tokenizeTopLevel(input: string): string[] {
  const tokens: string[] = []
  let depth = 0
  let quote: QuoteChar | null = null
  let current = ''
  const push = () => {
    if (current) {
      tokens.push(current)
      current = ''
    }
  }
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      current += ch
      if (ch === '\\' && quote !== '`') {
        if (i + 1 < input.length) current += input[++i]
        continue
      }
      if (ch === quote) {
        if (input[i + 1] === quote) current += input[++i]
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(' || ch === '[') depth++
    if (ch === ')' || ch === ']') depth--
    if (/\s/.test(ch) && depth === 0) {
      push()
      continue
    }
    current += ch
  }
  push()
  return tokens
}

function unquoteIdent(raw: string): string {
  const s = raw.trim().replace(/`/g, '')
  const dot = s.lastIndexOf('.')
  return dot === -1 ? s : s.slice(dot + 1)
}

function unquoteStringLiteral(raw: string): string {
  let s = raw.trim()
  const q = s[0]
  if ((q === "'" || q === '"') && s.endsWith(q)) s = s.slice(1, -1)
  return s.replace(new RegExp(q + q, 'g'), q).replace(/\\'/g, "'")
}

/** 找到 openIdx 处 '(' 的匹配 ')' 下标，考虑引号；找不到返回 -1。 */
function matchParen(input: string, openIdx: number): number {
  let depth = 0
  let quote: QuoteChar | null = null
  for (let i = openIdx; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) {
        if (input[i + 1] === quote) i++
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function parseRefTarget(text: string): { refTable: string; refColumn: string } | null {
  const m = /REFERENCES\s+([^\s(]+)\s*(?:\(\s*([^)]*)\s*\))?/i.exec(text)
  if (!m) return null
  return {
    refTable: unquoteIdent(m[1]),
    refColumn: m[2] ? normalizeIdentList(m[2]) : ''
  }
}

function normalizeIdentList(inner: string): string {
  return inner
    .split(',')
    .map((s) => unquoteIdent(s))
    .join(', ')
}

const SKIP_ITEM = /^(UNIQUE|KEY|INDEX|FULLTEXT|SPATIAL|CHECK)\b/i
const SKIP_STATEMENT = /^\s*(ALTER|DROP|INSERT|UPDATE|DELETE|RENAME|TRUNCATE|USE|SET|BEGIN|COMMIT|CALL|GRANT|REVOKE)\b|^\s*CREATE\s+(?:DATABASE|SCHEMA|VIEW|INDEX|UNIQUE)\b/i

function parseColumn(item: string, errors: string[], tableName: string): ParsedColumn | null {
  const tokens = tokenizeTopLevel(item)
  if (tokens.length < 2) {
    errors.push(`[${tableName}] 无法理解的列定义: ${item.trim().slice(0, 60)}`)
    return null
  }
  const col: ParsedColumn = {
    name: unquoteIdent(tokens[0]),
    type: tokens[1],
    nullable: true,
    isPrimaryKey: false
  }
  for (let i = 2; i < tokens.length; i++) {
    const up = tokens[i].toUpperCase()
    if (up === 'UNSIGNED' || up === 'ZEROFILL') {
      col.type += ' ' + tokens[i]
      continue
    }
    if (up === 'NOT' && (tokens[i + 1] ?? '').toUpperCase() === 'NULL') {
      col.nullable = false
      i++
      continue
    }
    if (up === 'NULL') {
      col.nullable = true
      continue
    }
    if (up === 'PRIMARY') {
      col.isPrimaryKey = true
      if ((tokens[i + 1] ?? '').toUpperCase() === 'KEY') i++
      continue
    }
    if (up === 'COMMENT') {
      col.comment = unquoteStringLiteral(tokens[++i] ?? '')
      continue
    }
    if (up === 'DEFAULT') {
      col.defaultValue = unquoteStringLiteral(tokens[++i] ?? '')
      continue
    }
    if (up === 'REFERENCES') {
      const ref = parseRefTarget(item.slice(item.toUpperCase().indexOf('REFERENCES')))
      if (ref) col._ref = ref
      i = tokens.length
      continue
    }
  }
  return col
}

export function parseCreateTable(statement: string, errors: string[]): TableDef | null {
  const head = /^\s*CREATE\s+(?:TEMPORARY\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s(]+)\s*\(/i.exec(statement)
  if (!head) {
    errors.push(`无法解析的语句: ${statement.trim().replace(/\s+/g, ' ').slice(0, 60)}`)
    return null
  }
  const openIdx = statement.indexOf('(', head.index + head[0].length - 1)
  const closeIdx = matchParen(statement, openIdx)
  if (closeIdx === -1) {
    errors.push(`括号不匹配，表 ${unquoteIdent(head[1])} 解析失败`)
    return null
  }
  const body = statement.slice(openIdx + 1, closeIdx)
  const options = statement.slice(closeIdx + 1)

  const table: TableDef = {
    name: unquoteIdent(head[1]),
    columns: [],
    foreignKeys: []
  }
  const tableComment = /COMMENT\s*=?\s*('(?:[^']|'')*'|"(?:[^"]|"")*")/i.exec(options)
  if (tableComment) table.comment = unquoteStringLiteral(tableComment[1])

  const pkNames = new Set<string>()
  for (const rawItem of splitTopLevel(body, ',')) {
    const item = rawItem.trim()
    if (!item) continue
    if (/\bFOREIGN\s+KEY\b/i.test(item)) {
      const m = /FOREIGN\s+KEY\s*\(([^)]*)\)\s*REFERENCES\s+([^\s(]+)\s*(?:\(\s*([^)]*)\s*\))?/i.exec(item)
      if (m) {
        table.foreignKeys.push({
          column: normalizeIdentList(m[1]),
          refTable: unquoteIdent(m[2]),
          refColumn: m[3] ? normalizeIdentList(m[3]) : ''
        })
      } else {
        errors.push(`[${table.name}] 外键语句不完整: ${item.slice(0, 60)}`)
      }
      continue
    }
    if (/^PRIMARY\s+KEY\b/i.test(item)) {
      const m = /PRIMARY\s+KEY\s*\(([^)]*)\)/i.exec(item)
      if (m) {
        for (const n of m[1].split(',')) pkNames.add(unquoteIdent(n))
      }
      continue
    }
    if (SKIP_ITEM.test(item) || /^CONSTRAINT\b/i.test(item)) continue

    const col = parseColumn(item, errors, table.name)
    if (col) {
      if (col._ref) {
        table.foreignKeys.push({ column: col.name, refTable: col._ref.refTable, refColumn: col._ref.refColumn })
        delete col._ref
      }
      table.columns.push(col)
    }
  }
  for (const c of table.columns) {
    if (pkNames.has(c.name)) c.isPrimaryKey = true
  }
  return table
}

// ============================================================================
// 以下为「零正则」版的 CREATE TABLE 解析，与上方正则版并存，用于对照与测试。
// 关键字识别、空白跳过、引号与转义处理全部由普通字符扫描完成，不依赖任何正则。
// ============================================================================

/** 是否空白字符（ASCII：空格以及 \t \n \r \f \v，码点均 <= 32） */
const plainIsSpace = (ch: string | undefined): boolean => !!ch && ch.charCodeAt(0) <= 32

/** 是否标识符字符：A-Z a-z 0-9 _ $ */
const plainIsIdentChar = (ch: string | undefined): boolean => {
  if (!ch) return false
  const c = ch.charCodeAt(0)
  return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57) || c === 95 || c === 36
}

/** 从 from 起跳过空白，返回新下标 */
const plainSkipSpace = (s: string, from: number): number => {
  let i = from
  while (i < s.length && plainIsSpace(s[i])) i++
  return i
}

/** 读一个关键字并转大写（自带跳过前导空白）；读不到时 word 为空串 */
const plainReadWord = (s: string, from: number): { word: string; next: number } => {
  const i = plainSkipSpace(s, from)
  let j = i
  while (j < s.length && plainIsIdentChar(s[j])) j++
  return { word: s.slice(i, j).toUpperCase(), next: j }
}

/** 读一个标识符原文，允许反引号包裹与 db.table 形式 */
const plainReadIdent = (s: string, from: number): { raw: string; next: number } => {
  let i = plainSkipSpace(s, from)
  const start = i
  while (i < s.length) {
    const ch = s[i]
    if (ch === '`') {
      i++
      while (i < s.length && s[i] !== '`') i++
      if (i < s.length) i++
      continue
    }
    if (plainIsIdentChar(ch) || ch === '.') {
      i++
      continue
    }
    break
  }
  return { raw: s.slice(start, i), next: i }
}

/** 去反引号并截取最后一个 . 之后的部分 */
function plainUnquoteIdent(raw: string): string {
  let s = ''
  for (const ch of raw) {
    if (ch !== '`') s += ch
  }
  const dot = s.lastIndexOf('.')
  return (dot === -1 ? s : s.slice(dot + 1)).trim()
}

/** 去成对引号，并把 '' 与 \' 还原为单个 ' */
function plainUnquoteString(raw: string): string {
  let s = raw.trim()
  const q = s[0]
  if ((q === "'" || q === '"') && s.length >= 2 && s[s.length - 1] === q) {
    s = s.slice(1, -1)
  }
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === q && s[i + 1] === q) {
      out += q
      i++
      continue
    }
    if (ch === '\\' && s[i + 1] === "'") {
      out += "'"
      i++
      continue
    }
    out += ch
  }
  return out
}

/** 找与 openIdx 处 '(' 匹配的 ')'，跳过引号内容；找不到返回 -1 */
function plainMatchParen(s: string, openIdx: number): number {
  let depth = 0
  let quote: string | null = null
  for (let i = openIdx; i < s.length; i++) {
    const ch = s[i]
    if (quote) {
      if (ch === '\\') i++
      else if (ch === quote) {
        if (s[i + 1] === quote) i++
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/** 在括号与引号之外的 sep 处切分 */
function plainSplit(s: string, sep: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: string | null = null
  let cur = ''
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (quote) {
      cur += ch
      if (ch === '\\' && quote !== '`') {
        if (i + 1 < s.length) cur += s[++i]
        continue
      }
      if (ch === quote) {
        if (s[i + 1] === quote) cur += s[++i]
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      cur += ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === sep && depth === 0) {
      parts.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  parts.push(cur)
  return parts
}

/** 按空白分词，括号与引号内部不切 */
function plainTokenize(s: string): string[] {
  const tokens: string[] = []
  let depth = 0
  let quote: string | null = null
  let cur = ''
  const push = () => {
    if (cur) {
      tokens.push(cur)
      cur = ''
    }
  }
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (quote) {
      cur += ch
      if (ch === '\\' && quote !== '`') {
        if (i + 1 < s.length) cur += s[++i]
        continue
      }
      if (ch === quote) {
        if (s[i + 1] === quote) cur += s[++i]
        else quote = null
      }
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch
      cur += ch
      continue
    }
    if (ch === '(' || ch === '[') depth++
    if (ch === ')' || ch === ']') depth--
    if (plainIsSpace(ch) && depth === 0) {
      push()
      continue
    }
    cur += ch
  }
  push()
  return tokens
}

/** 把连续空白压成一个空格（等价 trim + 多空白归一），用于错误信息 */
function plainCollapseWhitespace(input: string): string {
  let out = ''
  let pending = false
  for (const ch of input) {
    if (plainIsSpace(ch)) {
      if (out) pending = true
      continue
    }
    if (pending) {
      out += ' '
      pending = false
    }
    out += ch
  }
  return out
}

/** 解析 CREATE [TEMPORARY] TABLE [IF NOT EXISTS] name ( 前缀 */
function plainParseTableHead(statement: string): { name: string; openIdx: number; isTemporary: boolean } | null {
  const w1 = plainReadWord(statement, 0)
  if (w1.word !== 'CREATE') return null

  const w2 = plainReadWord(statement, w1.next)
  const isTemporary = w2.word === 'TEMPORARY'
  const afterTemp = isTemporary ? w2.next : w1.next

  const w3 = plainReadWord(statement, afterTemp)
  if (w3.word !== 'TABLE') return null

  // 可选 IF NOT EXISTS：三个词必须齐全，否则不消费
  let afterIf = w3.next
  const w4 = plainReadWord(statement, w3.next)
  if (w4.word === 'IF') {
    const w5 = plainReadWord(statement, w4.next)
    const w6 = plainReadWord(statement, w5.next)
    if (w5.word === 'NOT' && w6.word === 'EXISTS') afterIf = w6.next
  }

  const ident = plainReadIdent(statement, afterIf)
  if (!ident.raw) return null

  const open = plainSkipSpace(statement, ident.next)
  if (statement[open] !== '(') return null

  return { name: ident.raw, openIdx: open, isTemporary }
}

/** 在表选项里找 COMMENT='...' / COMMENT = "..." */
function plainFindTableComment(options: string): string | undefined {
  let i = 0
  while (i < options.length) {
    const w = plainReadWord(options, i)
    if (!w.word) {
      i = w.next > i ? w.next : i + 1
      continue
    }
    if (w.word === 'COMMENT') {
      let j = plainSkipSpace(options, w.next)
      if (options[j] === '=') j = plainSkipSpace(options, j + 1)
      const q = options[j]
      if (q === "'" || q === '"') {
        let k = j + 1
        let content = ''
        while (k < options.length) {
          if (options[k] === q) {
            // 双写引号是字面引号，不算结束
            if (options[k + 1] === q) {
              content += q
              k += 2
              continue
            }
            return content
          }
          content += options[k]
          k++
        }
        return content
      }
    }
    i = w.next
  }
  return undefined
}

/** 扫描是否出现相邻的两个关键字，如 FOREIGN KEY */
function plainHasKeywordPair(s: string, first: string, second: string): boolean {
  let i = 0
  while (i < s.length) {
    const w = plainReadWord(s, i)
    if (!w.word) {
      i = w.next > i ? w.next : i + 1
      continue
    }
    if (w.word === first && plainReadWord(s, w.next).word === second) return true
    i = w.next
  }
  return false
}

/** 解析 PRIMARY KEY (a, b) → 列名数组 */
function plainParsePrimaryKey(item: string): string[] | null {
  const w1 = plainReadWord(item, 0)
  if (w1.word !== 'PRIMARY') return null
  const w2 = plainReadWord(item, w1.next)
  if (w2.word !== 'KEY') return null
  const open = plainSkipSpace(item, w2.next)
  if (item[open] !== '(') return null
  const close = item.indexOf(')', open + 1)
  if (close === -1) return null
  return item
    .slice(open + 1, close)
    .split(',')
    .map((s) => plainUnquoteIdent(s))
}

/** 解析 FOREIGN KEY (cols) REFERENCES tbl (cols) */
function plainParseForeignKey(item: string): ForeignKeyDef | null {
  let i = 0
  while (i < item.length) {
    const w1 = plainReadWord(item, i)
    if (!w1.word) {
      i = w1.next > i ? w1.next : i + 1
      continue
    }
    if (w1.word !== 'FOREIGN') {
      i = w1.next
      continue
    }

    const w2 = plainReadWord(item, w1.next)
    if (w2.word !== 'KEY') return null

    const open = plainSkipSpace(item, w2.next)
    if (item[open] !== '(') return null
    const close = item.indexOf(')', open + 1)
    if (close === -1) return null
    const column = item
      .slice(open + 1, close)
      .split(',')
      .map((s) => plainUnquoteIdent(s))
      .join(', ')

    const w3 = plainReadWord(item, close + 1)
    if (w3.word !== 'REFERENCES') return null

    const tbl = plainReadIdent(item, w3.next)
    if (!tbl.raw) return null

    let refColumn = ''
    const open2 = plainSkipSpace(item, tbl.next)
    if (item[open2] === '(') {
      const close2 = item.indexOf(')', open2 + 1)
      if (close2 !== -1) {
        refColumn = item
          .slice(open2 + 1, close2)
          .split(',')
          .map((s) => plainUnquoteIdent(s))
          .join(', ')
      }
    }
    return { column, refTable: plainUnquoteIdent(tbl.raw), refColumn }
  }
  return null
}

/** 解析 REFERENCES tbl (cols)，用于列内联外键 */
function plainParseRefTarget(text: string, from: number): { refTable: string; refColumn: string } | null {
  const w = plainReadWord(text, from)
  if (w.word !== 'REFERENCES') return null
  const tbl = plainReadIdent(text, w.next)
  if (!tbl.raw) return null

  let refColumn = ''
  const open = plainSkipSpace(text, tbl.next)
  if (text[open] === '(') {
    const close = text.indexOf(')', open + 1)
    if (close !== -1) {
      refColumn = text
        .slice(open + 1, close)
        .split(',')
        .map((s) => plainUnquoteIdent(s))
        .join(', ')
    }
  }
  return { refTable: plainUnquoteIdent(tbl.raw), refColumn }
}

interface PlainColumn extends ColumnDef {
  _ref?: { refTable: string; refColumn: string }
}

/** 解析单个列定义（零正则版） */
function plainParseColumn(item: string, errors: string[], tableName: string): PlainColumn | null {
  const tokens = plainTokenize(item)
  if (tokens.length < 2) {
    errors.push(`[${tableName}] 无法理解的列定义: ${item.trim().slice(0, 60)}`)
    return null
  }
  const col: PlainColumn = {
    name: plainUnquoteIdent(tokens[0]),
    type: tokens[1],
    nullable: true,
    isPrimaryKey: false
  }
  for (let i = 2; i < tokens.length; i++) {
    const up = tokens[i].toUpperCase()
    if (up === 'UNSIGNED' || up === 'ZEROFILL') {
      col.type += ' ' + tokens[i]
      continue
    }
    if (up === 'NOT' && (tokens[i + 1] ?? '').toUpperCase() === 'NULL') {
      col.nullable = false
      i++
      continue
    }
    if (up === 'NULL') {
      col.nullable = true
      continue
    }
    if (up === 'PRIMARY') {
      col.isPrimaryKey = true
      if ((tokens[i + 1] ?? '').toUpperCase() === 'KEY') i++
      continue
    }
    if (up === 'COMMENT') {
      col.comment = plainUnquoteString(tokens[++i] ?? '')
      continue
    }
    if (up === 'DEFAULT') {
      col.defaultValue = plainUnquoteString(tokens[++i] ?? '')
      continue
    }
    if (up === 'REFERENCES') {
      const at = item.toUpperCase().indexOf('REFERENCES')
      const ref = at === -1 ? null : plainParseRefTarget(item, at)
      if (ref) col._ref = ref
      i = tokens.length
      continue
    }
  }
  return col
}

/** 表内需要跳过的定义行：索引与各类约束 */
const PLAIN_SKIP_WORDS = ['UNIQUE', 'KEY', 'INDEX', 'FULLTEXT', 'SPATIAL', 'CHECK', 'CONSTRAINT']

/**
 * 零正则版的 CREATE TABLE 解析，行为与上方 parseCreateTable 对齐。
 * 仅用于对照验证，未被 parseDdl 调用。
 */
export function parseCreateTablePlain(statement: string, errors: string[]): TableDef | null {
  const head = plainParseTableHead(statement)
  if (!head) {
    errors.push(`无法解析的语句: ${plainCollapseWhitespace(statement).slice(0, 60)}`)
    return null
  }

  const closeIdx = plainMatchParen(statement, head.openIdx)
  if (closeIdx === -1) {
    errors.push(`括号不匹配，表 ${plainUnquoteIdent(head.name)} 解析失败`)
    return null
  }

  const body = statement.slice(head.openIdx + 1, closeIdx)
  const options = statement.slice(closeIdx + 1)

  const table: TableDef = {
    name: plainUnquoteIdent(head.name),
    columns: [],
    foreignKeys: []
  }
  const tableComment = plainFindTableComment(options)
  if (tableComment !== undefined) table.comment = tableComment

  const pkNames = new Set<string>()
  for (const rawItem of plainSplit(body, ',')) {
    const item = rawItem.trim()
    if (!item) continue

    if (plainHasKeywordPair(item, 'FOREIGN', 'KEY')) {
      const fk = plainParseForeignKey(item)
      if (fk) {
        table.foreignKeys.push(fk)
      } else {
        errors.push(`[${table.name}] 外键语句不完整: ${item.slice(0, 60)}`)
      }
      continue
    }

    const w1 = plainReadWord(item, 0)
    if (w1.word === 'PRIMARY' && plainReadWord(item, w1.next).word === 'KEY') {
      const pk = plainParsePrimaryKey(item)
      if (pk) {
        for (const n of pk) pkNames.add(n)
      }
      continue
    }

    if (PLAIN_SKIP_WORDS.includes(w1.word)) continue

    const col = plainParseColumn(item, errors, table.name)
    if (col) {
      if (col._ref) {
        table.foreignKeys.push({
          column: col.name,
          refTable: col._ref.refTable,
          refColumn: col._ref.refColumn
        })
        delete col._ref
      }
      table.columns.push(col)
    }
  }

  for (const c of table.columns) {
    if (pkNames.has(c.name)) c.isPrimaryKey = true
  }
  return table
}

/**
 * 解析 MySQL DDL，提取其中所有 CREATE TABLE 语句的表结构定义。
 *
 * 整体流程：去注释 → 按顶层分号切分语句 → 逐条识别并解析 CREATE TABLE。
 * 采用「尽力解析」策略：不抛异常，无法识别的语句与列定义收集进 errors 返回，
 * 其余能解析的部分照常返回，便于前端一次性提示全部问题。
 *
 * @param ddl 原始 DDL 文本，可含多张表、任意注释与无关语句
 * @returns tables 解析成功的表定义；errors 被跳过或解析失败的说明文本
 */
export function parseDdl(ddl: string): ParseResult {
  const tables: TableDef[] = []
  const errors: string[] = []

  // 先剔除注释：字符串外的 /* */、--、# 内容可能含分号或引号，
  // 不清理会干扰后续按分号切分语句
  const cleaned = stripSqlComments(ddl)

  // 按顶层分号切分：splitTopLevel 会跳过括号内与引号内的分号，
  // 因此 DECIMAL(10,2)、ENUM('a;b') 不会被误切\
  // 移除各种注释后，将一大堆create table 语句分成一个个表对应的建表语句
  // 因为是从textarea 里直接写的，会写很多个表

  const statements  = splitTopLevel(cleaned, ';')
  
  for (const rawStatement of statements) {
    // statement 就是一个完整的create table 语句
    const statement = rawStatement.trim()
    // 空语句：末尾多写的分号，或整条语句被注释掉后残留的空白
    if (!statement) continue

    // 只处理 CREATE TABLE。其余语句分两类：ALTER/DROP/INSERT 等可预期的无关语句
    // 由 SKIP_STATEMENT 静默跳过；完全无法识别的才记入 errors 提示用户
    if (!/^\s*CREATE\s+(?:TEMPORARY\s+)?TABLE\b/i.test(statement)) {
      // \b 防止出现 create tablespace 这种前面看起来像是建表语句，但其实不是
      // 走进来，说明不是create table 类型的语句。比如 drop table ，alter table 等
      if (!SKIP_STATEMENT.test(statement)) {
        // 继续判断，如果在 SKIP_STATEMENT 匹配不中，就提示错误
        errors.push(`跳过不支持的语句: ${statement.replace(/\s+/g, ' ').slice(0, 60)}`)
      }
      continue
    }

    // 单表解析；失败返回 null，具体原因已由 parseCreateTable 写入 errors
    const table = parseCreateTable(statement, errors)
    if (table) tables.push(table)
  }
  return { tables, errors }
}
