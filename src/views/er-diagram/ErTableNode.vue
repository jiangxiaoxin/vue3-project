<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { TableDef } from './parser'

const props = defineProps<{ data: { table: TableDef } }>()

const collapsed = ref(false)
let headerDownPos: { x: number; y: number } | null = null

// 表头同时是拖拽起点，拖动过的 click 不算「点击收起」
function onHeaderDown(ev: MouseEvent) {
  headerDownPos = { x: ev.clientX, y: ev.clientY }
}
function onHeaderClick(ev: MouseEvent) {
  if (headerDownPos && Math.hypot(ev.clientX - headerDownPos.x, ev.clientY - headerDownPos.y) > 3) return
  collapsed.value = !collapsed.value
}

const fkColumns = computed(() => {
  const set = new Set<string>()
  for (const fk of props.data.table.foreignKeys) {
    for (const c of fk.column.split(',')) set.add(c.trim())
  }
  return set
})

/** 只大写类型关键字前缀，括号里的枚举值保持原样 */
function displayType(type: string): string {
  return type.replace(/^[A-Za-z]+/, (m) => m.toUpperCase())
}

/** ENUM/SET 只展示类型名，具体取值挪进 tooltip */
function typeKeyword(type: string): string {
  const m = /^(enum|set)\b/i.exec(type)
  return m ? m[1].toUpperCase() : displayType(type)
}

function enumValues(type: string): string | null {
  const m = /^(?:enum|set)\((.*)\)$/i.exec(type)
  if (!m) return null
  const values: string[] = []
  let cur = ''
  let inQuote = false
  const push = () => values.push(inQuote ? cur.replace(/''/g, "'") : cur.trim())
  for (const ch of m[1]) {
    if (ch === "'") {
      inQuote = !inQuote
      continue
    }
    if (ch === ',' && !inQuote) {
      push()
      cur = ''
      continue
    }
    cur += ch
  }
  push()
  return values.join('、')
}

/** 悬停时测量：tooltip 伸出画布左缘则翻到元素右侧 */
function onTipEnter(ev: Event) {
  const host = ev.currentTarget as HTMLElement
  const tip = host.querySelector<HTMLElement>('.er-tip')
  if (!tip) return
  const bounds = host.closest('.vue-flow')?.getBoundingClientRect()
  const tipRect = tip.getBoundingClientRect()
  const overflowLeft = tipRect.left < (bounds ? bounds.left + 4 : 4)
  tip.classList.toggle('tip-flip', overflowLeft)
}
</script>

<template>
  <div class="er-node">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <div
      class="er-node__header"
      :class="{ 'has-comment': !!data.table.comment, 'header-collapsed': collapsed }"
      @mouseenter="onTipEnter"
      @mousedown="onHeaderDown"
      @click="onHeaderClick"
    >
      <span class="er-node__caret">{{ collapsed ? '▸' : '▾' }}</span>
      <span class="er-node__header-name">{{ data.table.name }}</span>
      <span v-if="data.table.comment" class="er-tip">{{ data.table.comment }}</span>
    </div>
    <div
      v-for="col in collapsed ? [] : data.table.columns"
      :key="col.name"
      class="er-node__row"
      :class="{ 'has-comment': !!(col.comment || col.defaultValue || enumValues(col.type)) }"
      @mouseenter="onTipEnter"
    >
      <span class="er-node__star" :class="{ 'star-hidden': col.nullable }">*</span>
      <span class="er-node__name">{{ col.name }}</span>
      <span class="er-node__type">{{ typeKeyword(col.type) }}</span>
      <span class="er-node__tags">
        <span v-if="col.isPrimaryKey" class="tag tag--pk">PK</span>
        <span v-if="fkColumns.has(col.name)" class="tag tag--fk">FK</span>
      </span>
      <span v-if="col.comment || col.defaultValue || enumValues(col.type)" class="er-tip">
        {{ col.name }}
        <template v-if="col.comment"><br />{{ col.comment }}</template>
        <template v-if="col.defaultValue !== undefined"><br />默认值：{{ col.defaultValue }}</template>
        <template v-if="enumValues(col.type)"><br />可选值：{{ enumValues(col.type) }}</template>
      </span>
    </div>
  </div>
</template>

<style scoped>
.er-node {
  width: 240px;
  background: #fff;
  border: 1px solid #c9cdd6;
  border-radius: 6px;
  font-size: 12px;
  color: #303133;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.er-node__header {
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  background: #eef2fb;
  border-bottom: 1px solid #c9cdd6;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  user-select: none;
}
.er-node__caret {
  flex: none;
  width: 14px;
  font-size: 14px;
  line-height: 1;
  color: #606266;
}
.header-collapsed {
  border-bottom: none;
  border-radius: 5px;
}
.er-node__header-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.er-node__row {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}
.er-node__row:last-child {
  border-bottom: none;
}
.er-node__tags {
  flex: none;
  display: flex;
  justify-content: flex-end;
  gap: 3px;
}
.tag {
  font-size: 10px;
  line-height: 14px;
  padding: 0 3px;
  border-radius: 2px;
  color: #fff;
}
.tag--pk {
  background: #e6a23c;
}
.tag--fk {
  background: #409eff;
}
.er-node__star {
  flex: none;
  width: 8px;
  color: #f56c6c;
  font-size: 14px;
  font-weight: 700;
}
.star-hidden {
  visibility: hidden;
}
.er-node__name {
  flex: 1;
  flex-shrink: 0;
}
.er-node__type {
  flex: none;
  color: #909399;
}
.has-comment {
  position: relative;
  cursor: help;
}
.er-tip {
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  visibility: hidden;
  width: max-content;
  min-width: 160px;
  max-width: 260px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.6;
  color: #fff;
  background: rgba(47, 54, 64, 0.95);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: normal;
  word-break: break-all;
  pointer-events: none;
}
.has-comment:hover .er-tip {
  visibility: visible;
}
.er-tip.tip-flip {
  right: auto;
  left: calc(100% + 8px);
}
.er-node :deep(.vue-flow__handle) {
  opacity: 0;
  pointer-events: none;
}
/* vue-flow 给每个节点卡片设了行内 z-index，tooltip 再高也出不了本卡片的层；
   悬停行时抬升整张卡片，让它盖住相邻节点。tooltip 是 pointer-events:none 无法被 :hover，
   所以以带注释的行/表头为悬停对象。卡片是行的祖先，scoped 选择器够不到，须用 :global */
:global(.vue-flow__node:has(.has-comment:hover)) {
  z-index: 1000 !important;
}
</style>
