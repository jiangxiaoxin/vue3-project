import ELK from 'elkjs/lib/elk.bundled.js'
import type { LayoutOptions } from 'elkjs/lib/elk-api'
import { MarkerType, type Edge, type Node } from '@vue-flow/core'
import type { TableDef } from './parser'

export const NODE_WIDTH = 240
export const HEADER_HEIGHT = 36
export const ROW_HEIGHT = 28
export const FOOTER_HEIGHT = 8

export function tableNodeHeight(table: TableDef): number {
  return HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + FOOTER_HEIGHT
}

const elk = new ELK()

interface ElkNodeResult {
  id: string
  x: number
  y: number
  width: number
  height: number
}

interface ElkGraphResult {
  children: ElkNodeResult[]
  edges: { id: string }[]
}

function toGraphInput(tables: TableDef[]) {
  const names = new Set(tables.map((t) => t.name))
  const nodes = tables.map((t) => ({
    id: t.name,
    width: NODE_WIDTH,
    height: tableNodeHeight(t)
  }))
  const edges: { id: string; sources: string[]; targets: string[] }[] = []
  const skipped: string[] = []
  for (const t of tables) {
    for (const fk of t.foreignKeys) {
      if (!names.has(fk.refTable)) {
        skipped.push(`表 ${t.name} 的外键 ${fk.column} 指向不存在的表 ${fk.refTable}，已忽略`)
        continue
      }
      edges.push({
        id: `${t.name}->${fk.refTable}(${fk.column})`,
        sources: [t.name],
        targets: [fk.refTable]
      })
    }
  }
  return { nodes, edges, skipped }
}

const GRAPH_OPTIONS: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.nodeNode': '60',
  'elk.layered.spacing.nodeNodeBetweenLayers': '140',
  'elk.layered.spacing.edgeNodeBetweenLayers': '40',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.spacing.edgeEdge': '20'
}

export interface LayoutResult {
  nodes: Node[]
  edges: Edge[]
  warnings: string[]
}

export async function layoutTables(tables: TableDef[], byIdMap: Map<string, TableDef>): Promise<LayoutResult> {
  const { nodes, edges, skipped } = toGraphInput(tables)
  const graph = await elk.layout({
    id: 'root',
    layoutOptions: GRAPH_OPTIONS,
    children: nodes,
    edges
  }) as ElkGraphResult

  const flowNodes: Node[] = graph.children.map((child) => {
    const table = byIdMap.get(child.id)!
    return {
      id: child.id,
      type: 'er-table',
      position: { x: child.x, y: child.y },
      // 不设固定 height：卡片高度由内容自适应，节点收起时 vue-flow 重新测量、连线锚点跟随
      style: { width: NODE_WIDTH },
      data: { table }
    }
  })

  // 用 vue-flow 内置 smoothstep 边而非 ELK 折线：节点拖动时连线会自动跟随
  const flowEdges: Edge[] = graph.edges.map((edge) => {
    const [sourceTable, rest] = edge.id.split('->')
    return {
      id: edge.id,
      type: 'smoothstep',
      source: sourceTable,
      target: rest.replace(/\(.*\)$/, '').trim(),
      label: decodeFkLabel(edge.id, byIdMap),
      markerEnd: { type: MarkerType.ArrowClosed, color: '#7a8aa6', width: 16, height: 16 },
      style: { stroke: '#7a8aa6', strokeWidth: 1.5 }
    }
  })

  return { nodes: flowNodes, edges: flowEdges, warnings: skipped }
}

function decodeFkLabel(edgeId: string, byIdMap: Map<string, TableDef>): string {
  const m = /^([^->]+)->([^(]+)\(([^)]*)\)$/.exec(edgeId)
  if (!m) return edgeId
  const [, from, to, column] = m
  const fk = byIdMap.get(from)?.foreignKeys.find((f) => f.column === column)
  if (!fk) return `${column} → ${to}`
  return `${column} → ${to}.${fk.refColumn || '?'}`
}
