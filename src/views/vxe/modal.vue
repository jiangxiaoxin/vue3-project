<template>
  <VxeModal ref="modalRef" v-model="show">
    <template #default>自定义内容</template>
  </VxeModal>
</template>
<script setup>
import { ref, computed } from 'vue'
const modalRef = ref(null)
const show = ref(false)
const innerShow = computed(() => {
  return show
})
defineExpose({
  toggle: () => {
    show.value = !show.value
  },
  innerShow
})
</script>
