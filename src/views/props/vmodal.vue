<script setup lang="ts">
const close = () => {}

const props = defineProps({
  modelValue: {
    type: Boolean
  }
})
</script>

<template>
  <vxe-modal @close="close" @cancel="close" width="400" height="400" v-model="modelValue">
    <button @click="close">关闭</button>
  </vxe-modal>
</template>

<style scoped lang="less"></style>
