import { describe, expect, it } from 'vitest'
import { parseDdl } from './parser'
import { layoutTables } from './layout'
import { generateDdl } from './fixtures/genDdl'

// 性能基线用例：阈值放宽以免 CI 抖动误报，重点是 console 里的实测数字回归
describe('大规模节点性能（200 表 × 20 字段）', () => {
  const ddl = generateDdl(200, 20)

  it('生成器结构正确', () => {
    const { tables, errors } = parseDdl(ddl)
    expect(errors).toEqual([])
    expect(tables).toHaveLength(200)
    expect(tables.every((t) => t.columns.length === 20)).toBe(true)
    expect(tables.reduce((n, t) => n + t.foreignKeys.length, 0)).toBe(199)
  })

  it('parseDdl 解析耗时可接受', () => {
    parseDdl(ddl) // 预热
    const t0 = performance.now()
    const { tables, errors } = parseDdl(ddl)
    const ms = performance.now() - t0
    console.log(`[perf] parseDdl 200x20: ${ms.toFixed(1)}ms, ${ddl.length} chars`)
    expect(errors).toEqual([])
    expect(tables).toHaveLength(200)
    expect(ms).toBeLessThan(2000)
  })

  it('ELK 布局耗时可接受', async () => {
    const { tables } = parseDdl(ddl)
    const byIdMap = new Map(tables.map((t) => [t.name, t]))
    const t0 = performance.now()
    const result = await layoutTables(tables, byIdMap)
    const ms = performance.now() - t0
    console.log(`[perf] layoutTables 200 nodes/199 edges: ${ms.toFixed(1)}ms`)
    expect(result.nodes).toHaveLength(200)
    expect(result.edges).toHaveLength(199)
    expect(result.warnings).toEqual([])
    expect(ms).toBeLessThan(30000)
  }, 60000)
})
