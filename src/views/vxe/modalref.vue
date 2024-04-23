<template>
  <VxeModal ref="modalRef">
    modal

    <button @click="closeModal">内部关闭</button>
  </VxeModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { VxeModal } from 'vxe-table'
import type { VxeModalInstance } from 'vxe-table'

const props = defineProps({
  onFinish: {
    type: Function,
    default: () => {}
  }
})

const modalRef = ref<VxeModalInstance>()

function openModal() {
  modalRef.value?.open()
}

function closeModal() {
  modalRef.value?.close()
}

defineExpose({
  openModal
})
</script>
