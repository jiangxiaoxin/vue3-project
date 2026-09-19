<script setup lang="ts">
import { markRaw, nextTick, ref, watch } from 'vue'
import { MarkerType, VueFlow, useVueFlow, type Edge, type NodeTypesObject, type Node } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import ErTableNode from './ErTableNode.vue'
import { parseDdl } from './parser'
import { layoutTables } from './layout'
import schoolDdl from './fixtures/school-ddl.sql?raw'
import { generateDdl } from './fixtures/genDdl'

// 自定义节点的 props 比 vue-flow 的通用 NodeProps 更窄，注册时需断言
const nodeTypes = { 'er-table': markRaw(ErTableNode) } as unknown as NodeTypesObject

const FLOW_ID = 'er-diagram-flow'
const { fitView, getSelectedNodes } = useVueFlow(FLOW_ID)

const ddl = ref(SAMPLE_DDL())
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const errors = ref<string[]>([])
const warnings = ref<string[]>([])
const drawing = ref(false)
const perfMsg = ref('')
const showGrid = ref(true)

const EDGE_BASE_STYLE = { stroke: '#7a8aa6', strokeWidth: 1.5 }
const EDGE_LINKED_STYLE = { stroke: '#409eff', strokeWidth: 2.5 }
// markerUnits 默认随线宽缩放，高亮加粗时箭头会变大；固定为 userSpaceOnUse 只变颜色
const edgeMarker = (color: string) => ({
  type: MarkerType.ArrowClosed,
  color,
  width: 24,
  height: 24,
  markerUnits: 'userSpaceOnUse'
})

// 选中节点 → 高亮本节点、直连边、邻居节点；多选取并集
watch(getSelectedNodes, (selectedNodes) => {
  const selectedIds = new Set(selectedNodes.map((n) => n.id))
  const neighborIds = new Set<string>()
  const linkedEdgeIds = new Set<string>()
  for (const e of edges.value) {
    const linked = selectedIds.has(e.source) || selectedIds.has(e.target)
    if (!linked) continue
    linkedEdgeIds.add(e.id)
    if (!selectedIds.has(e.source)) neighborIds.add(e.source)
    if (!selectedIds.has(e.target)) neighborIds.add(e.target)
  }
  for (const n of nodes.value) {
    n.class = selectedIds.has(n.id) ? 'node-selected' : neighborIds.has(n.id) ? 'node-neighbor' : ''
  }
  for (const e of edges.value) {
    const linked = linkedEdgeIds.has(e.id)
    e.class = linked ? 'edge-linked' : ''
    e.style = linked ? EDGE_LINKED_STYLE : EDGE_BASE_STYLE
    e.markerEnd = edgeMarker(linked ? '#409eff' : '#7a8aa6')
  }
})

async function onDraw() {
  drawing.value = true
  perfMsg.value = ''
  errors.value = []
  warnings.value = []
  try {
    const { tables, errors: parseErrors } = parseDdl(ddl.value)
    errors.value = parseErrors
    if (tables.length === 0) {
      nodes.value = []
      edges.value = []
      if (parseErrors.length === 0) {
        errors.value = ['没有解析到任何 CREATE TABLE 语句']
      }
      return
    }
    const byIdMap = new Map(tables.map((t) => [t.name, t]))
    const result = await layoutTables(tables, byIdMap)
    warnings.value = result.warnings
    nodes.value = result.nodes
    edges.value = result.edges
    await nextTick()
    fitView({ padding: 0.2, duration: 300 })
  } catch (err) {
    errors.value = [`布局失败: ${(err as Error).message}`]
  } finally {
    drawing.value = false
  }
}

function onClear() {
  ddl.value = ''
  nodes.value = []
  edges.value = []
  errors.value = []
  warnings.value = []
  perfMsg.value = ''
}

function loadSample() {
  ddl.value = SAMPLE_DDL()
}

function loadSchoolSample() {
  ddl.value = schoolDdl
  onDraw()
}

/** 一键载入 200 表 × 20 字段的生成 DDL 并绘制，实测页面级渲染耗时 */
async function loadPerfSample() {
  ddl.value = generateDdl(200, 20)
  const start = performance.now()
  await onDraw()
  // onDraw 里的 nextTick 已等待节点 DOM 挂载完成，此处耗时 ≈ 解析 + ELK 布局 + 渲染
  const ms = Math.round(performance.now() - start)
  perfMsg.value = `压测：${nodes.value.length} 张表 / ${edges.value.length} 条边，绘制总耗时 ${ms}ms`
}

function SAMPLE_DDL(): string {
  return `-- 电商示例：用户 / 订单 / 订单明细 / 商品
CREATE TABLE \`user\` (
  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  \`username\` varchar(32) NOT NULL COMMENT '用户名',
  \`balance\` decimal(10,2) DEFAULT '0.00' COMMENT '余额，含两位小数',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_username\` (\`username\`)
) ENGINE=InnoDB COMMENT='用户表';

CREATE TABLE \`product\` (
  \`id\` bigint NOT NULL COMMENT '商品ID',
  \`title\` varchar(128) NOT NULL COMMENT '标题',
  \`price\` decimal(10,2) NOT NULL COMMENT '单价',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB COMMENT='商品表';

CREATE TABLE \`orders\` (
  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT '订单号',
  \`user_id\` bigint NOT NULL COMMENT '下单用户，关联 user.id',
  \`status\` enum('paid','unpaid','refunded') DEFAULT 'unpaid' COMMENT '订单状态',
  \`total\` decimal(10,2) NOT NULL COMMENT '总价',
  PRIMARY KEY (\`id\`),
  KEY \`idx_user\` (\`user_id\`),
  CONSTRAINT \`fk_order_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`id\`)
) ENGINE=InnoDB COMMENT='订单主表';

/* 订单明细：一个订单多个商品，联合主键 */
CREATE TABLE \`order_item\` (
  \`order_id\` bigint NOT NULL COMMENT '所属订单',
  \`product_id\` bigint NOT NULL COMMENT '购买商品',
  \`quantity\` int NOT NULL COMMENT '数量',
  PRIMARY KEY (\`order_id\`, \`product_id\`),
  CONSTRAINT \`fk_item_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`),
  CONSTRAINT \`fk_item_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\` (\`id\`)
) ENGINE=InnoDB COMMENT='订单明细表';`
}
</script>

<template>
  <div class="er-page">
    <div class="er-toolbar">
      <button class="btn btn--primary" :disabled="drawing" @click="onDraw">
        {{ drawing ? '绘制中…' : '绘制 ER 图' }}
      </button>
      <button class="btn" @click="loadSample">填充示例</button>
      <button class="btn" @click="loadSchoolSample">学校示例</button>
      <button class="btn" :disabled="drawing" @click="loadPerfSample">性能压测</button>
      <button class="btn" @click="onClear">清空</button>
      <label class="er-toggle">
        <input v-model="showGrid" type="checkbox" />
        格子背景
      </label>
      <span class="er-toolbar__hint">左侧粘贴 MySQL DDL，点击绘制</span>
    </div>

    <div v-if="errors.length || warnings.length || perfMsg" class="er-messages">
      <ul v-if="errors.length" class="msg msg--error">
        <li v-for="(e, i) in errors" :key="'e' + i">{{ e }}</li>
      </ul>
      <ul v-if="warnings.length" class="msg msg--warn">
        <li v-for="(w, i) in warnings" :key="'w' + i">{{ w }}</li>
      </ul>
      <ul v-if="perfMsg" class="msg msg--info">
        <li>{{ perfMsg }}</li>
      </ul>
    </div>

    <div class="er-body">
      <div class="er-left">
        <textarea
          v-model="ddl"
          class="er-textarea"
          spellcheck="false"
          placeholder="粘贴 MySQL CREATE TABLE 语句…"
        ></textarea>
      </div>
      <div class="er-right" :class="{ 'grid-on': showGrid }">
        <VueFlow
          :id="FLOW_ID"
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-viewport="{ zoom: 0.9 }"
          :min-zoom="0.2"
          :max-zoom="2"
          fit-view-on-init
        >
        </VueFlow>
        <div v-if="!nodes.length" class="er-empty">尚未绘制，点击顶部「绘制 ER 图」按钮</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.er-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
}
.er-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e6eb;
  background: #fafbfc;
}
.er-toolbar__hint {
  margin-left: auto;
  color: #909399;
  font-size: 12px;
}
.btn {
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid #d0d3da;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.btn--primary {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.btn--primary:hover {
  background: #2f8ae0;
  color: #fff;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.er-messages {
  max-height: 120px;
  overflow: auto;
  padding: 6px 14px;
  border-bottom: 1px solid #e5e6eb;
  font-size: 12px;
}
.msg {
  margin: 0;
  padding-left: 18px;
}
.msg--error {
  color: #f56c6c;
}
.msg--warn {
  color: #e6a23c;
}
.msg--info {
  color: #67c23a;
}
.er-body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.er-left {
  width: 38%;
  min-width: 280px;
  border-right: 1px solid #e5e6eb;
  display: flex;
}
.er-textarea {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: #fbfcfd;
}
.er-right {
  flex: 1;
  position: relative;
  min-width: 0;
}
.er-right.grid-on :deep(.vue-flow) {
  background-image:
    linear-gradient(to right, #eceef2 1px, transparent 1px),
    linear-gradient(to bottom, #eceef2 1px, transparent 1px);
  background-size: 20px 20px;
}
.er-right :deep(.vue-flow__node.node-selected) {
  z-index: 50 !important;
}
.er-right :deep(.vue-flow__node.node-selected .er-node) {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.25), 0 1px 4px rgba(0, 0, 0, 0.08);
}
.er-right :deep(.vue-flow__node.node-neighbor .er-node) {
  border-color: #409eff;
  box-shadow: 0 0 0 1.5px rgba(64, 158, 255, 0.45), 0 1px 4px rgba(0, 0, 0, 0.08);
}
.er-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  user-select: none;
}
.er-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b3ba;
  font-size: 14px;
  pointer-events: none;
}
</style>
