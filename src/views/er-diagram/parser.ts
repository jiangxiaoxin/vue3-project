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
      if (ch === '\\' && quote !== '`') {
        i += 2
        if (i < input.length) out += input[i - 1]
        continue
      }
      if (ch === quote) {
        // SQL 里连续两个相同引号表示转义成一个字面引号（'' → '），不能当作闭合
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
      const end = input.indexOf('*/', i + 2)
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

function parseCreateTable(statement: string, errors: string[]): TableDef | null {
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

export function parseDdl(ddl: string): ParseResult {
  const tables: TableDef[] = []
  const errors: string[] = []
  const cleaned = stripSqlComments(ddl)
  for (const rawStatement of splitTopLevel(cleaned, ';')) {
    const statement = rawStatement.trim()
    if (!statement) continue
    if (!/^\s*CREATE\s+(?:TEMPORARY\s+)?TABLE\b/i.test(statement)) {
      if (!SKIP_STATEMENT.test(statement)) {
        errors.push(`跳过不支持的语句: ${statement.replace(/\s+/g, ' ').slice(0, 60)}`)
      }
      continue
    }
    const table = parseCreateTable(statement, errors)
    if (table) tables.push(table)
  }
  return { tables, errors }
}
