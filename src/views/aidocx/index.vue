<template>
  <div class="aidocx-page">
    <el-button type="primary" @click="dialogVisible = true">选择文件</el-button>

    <el-dialog v-model="dialogVisible" title="选择 DOCX 文件" width="400px">
      <input type="file" accept=".docx" @change="onFileChange" />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <div v-if="fileName" class="main-layout">
      <!-- 左侧：文档预览 -->
      <div class="preview-panel">
        <div class="file-name">{{ fileName }}</div>
        <div ref="previewRef" class="docx-preview-container"></div>
      </div>

      <!-- 右侧：问题列表 -->
      <div class="issues-panel">
        <h4>AI 发现问题（{{ issues.length }}）</h4>
        <div
          v-for="(item, idx) in issues"
          :key="idx"
          class="issue-card"
          @click="scrollToHighlight(idx)"
        >
          <div class="issue-old">原文：{{ item.old }}</div>
          <div class="issue-new">问题：{{ item.new }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { renderAsync } from 'docx-preview'

const dialogVisible = ref(false)
const fileName = ref('')
const previewRef = ref<HTMLElement | null>(null)

// TODO: 替换为真实 AI 分析接口返回，格式 { old: string, new: string }[]
// 方案：选择文件后先上传/传内容给 AI 接口，拿到 issues 后再调 highlightIssues；
//       可加 loading 状态，接口返回前展示文档、返回后追加高亮。
const issues = ref([
  { old: '具备大学本科学历或学士学位', new: '表述不明确表述不明确表述不明确表述不明确表述不明确表述不明确表述不明确' },
])

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  fileName.value = file.name
  dialogVisible.value = false

  const arrayBuffer = await file.arrayBuffer()
  const container = previewRef.value!
  container.innerHTML = ''

  await renderAsync(arrayBuffer, container, undefined, {
    className: 'docx',
    inWrapper: true,
    ignoreWidth: false,
    ignoreHeight: false,
  })

  await nextTick()
  highlightIssues(container)
}

function highlightIssues(container: HTMLElement) {
  // TODO: 当前仅处理 old 完整落在单个文本节点内的情况。
  // 若 docx-preview 将一段文字拆成多个 span（加粗/字体变化等），需实现跨节点拼接匹配。
  // 方案：收集同一父元素下所有相邻文本节点，拼接为完整字符串后做 indexOf 匹配，
  //       命中后按字符偏移量拆分各节点，分别包裹高亮 span。
  const list = issues.value
  if (!list.length) return

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  for (const node of textNodes) {
    const text = node.textContent || ''
    const matchIdx = list.findIndex((i) => text.includes(i.old))
    if (matchIdx === -1) continue

    const match = list[matchIdx]
    const idx = text.indexOf(match.old)
    const before = text.slice(0, idx)
    const matched = text.slice(idx, idx + match.old.length)
    const after = text.slice(idx + match.old.length)

    const frag = document.createDocumentFragment()
    if (before) frag.appendChild(document.createTextNode(before))

    const span = document.createElement('span')
    span.className = 'ai-highlight'
    span.dataset.issueIdx = String(matchIdx)
    span.textContent = matched
    span.dataset.comment = match.new
    frag.appendChild(span)

    if (after) frag.appendChild(document.createTextNode(after))

    node.parentNode?.replaceChild(frag, node)
  }
}

function scrollToHighlight(idx: number) {
  const el = previewRef.value?.querySelector(`[data-issue-idx="${idx}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
.aidocx-page {
  padding: 20px;
}
.main-layout {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  height: calc(100vh - 120px);
}
.preview-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.file-name {
  margin-bottom: 8px;
  font-weight: 500;
}
.docx-preview-container {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: auto;
  background: #f5f5f5;
}
.issues-panel {
  width: 300px;
  flex-shrink: 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
}
.issues-panel h4 {
  margin: 0 0 12px;
}
.issue-card {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #fdf6ec;
  border: 1px solid #f5dab1;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.issue-card:hover {
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.3);
}
.issue-old {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}
.issue-new {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 500;
}
</style>

<style>
.ai-highlight {
  background: #fef3cd;
  border-bottom: 2px solid #e6a23c;
  cursor: pointer;
  position: relative;
}
.ai-highlight:hover::after {
  content: attr(data-comment);
  position: absolute;
  left: 0;
  right: 0;
  top: 120%;
  z-index: 999;
  background: #303133;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  max-width: 300px;
  white-space: normal;
  text-align: left;
  text-indent: 0;
  line-height: 1.5;
}
</style>
