<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { TableDef } from './parser'

const props = defineProps<{ data: { table: TableDef } }>()

const fkColumns = computed(() => {
  const set = new Set<string>()
  for (const fk of props.data.table.foreignKeys) {
    for (const c of fk.column.split(',')) set.add(c.trim())
  }
  return set
})
</script>

<template>
  <div class="er-node">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <div class="er-node__header" :class="{ 'has-comment': !!data.table.comment }">
      <span class="er-node__header-name">{{ data.table.name }}</span>
      <span v-if="data.table.comment" class="er-tip">{{ data.table.comment }}</span>
    </div>
    <div
      v-for="col in data.table.columns"
      :key="col.name"
      class="er-node__row"
      :class="{ 'has-comment': !!col.comment }"
    >
      <span class="er-node__tags">
        <span v-if="col.isPrimaryKey" class="tag tag--pk">PK</span>
        <span v-if="fkColumns.has(col.name)" class="tag tag--fk">FK</span>
        <span v-if="!col.nullable" class="tag tag--nn">NN</span>
      </span>
      <span class="er-node__name">{{ col.name }}</span>
      <span class="er-node__type">{{ col.type }}</span>
      <span v-if="col.comment" class="er-tip">{{ col.comment }}</span>
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
  font-size: 13px;
  font-weight: 600;
  background: #eef2fb;
  border-bottom: 1px solid #c9cdd6;
  border-radius: 5px 5px 0 0;
}
.er-node__header-name {
  display: block;
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
  width: 66px;
  flex: none;
  display: flex;
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
.tag--nn {
  background: #909399;
}
.er-node__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.er-node__type {
  color: #909399;
}
.has-comment {
  position: relative;
  cursor: help;
}
.er-tip {
  position: absolute;
  left: 4px;
  bottom: calc(100% + 6px);
  z-index: 30;
  display: none;
  width: max-content;
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
  display: block;
}
.er-node :deep(.vue-flow__handle) {
  opacity: 0;
  pointer-events: none;
}
</style>
