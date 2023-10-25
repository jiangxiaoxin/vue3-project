<template>
  <div>
    <p>{{ open }}</p>
    <p>dialog ref visible: {{ dialogRef ? dialogRef.visible : 'no ref' }}</p>
    <button @click="openDialog">打开dialog</button>
    <button @click="printRef">打印dialog ref</button>

    <el-dialog v-model="open" title="dialog" ref="dialogRef" @open="opencb" @opened="openedcn">
      <p>content</p>
    </el-dialog>

    <button @click="showMessage">message</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const open = ref(false)

const dialogRef = ref<any>(null)

const printRef = () => {
  console.log('dialog ref', dialogRef.value)
}

const openDialog = () => {
  open.value = true
}

// 先open， 再opened
const opencb = () => {
  console.log('dialog open')
}

const openedcn = () => {
  console.log('dialog opened')
}

const showMessage = () => {
  ElMessage.success({
    message: null,
    duration: 2000
  })
}
</script>
