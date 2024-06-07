<template>
  <div style="height: 600px; background: pink; padding: 20px">
    <a-button @click="showModal('add')">新增</a-button>
    <a-button @click="showModal('edit')">编辑</a-button>
    <a-button @click="showModal('view')">查看</a-button>

    <Modal ref="modalRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import Modal from './modal.vue'
import { testData } from './config'
const modalRef = ref<any>(null)
const showModal = (mode: any) => {
  if (mode === 'add') {
    modalRef.value?.open(mode)
  } else {
    modalRef.value?.open(mode, testData, 2)
  }
}
</script>
