<template>
  <div class="wrapper-component">
    <slot />
    <button @click="handleClick">打印Props</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  // 可以根据需要添加具体props类型
  [key: string]: unknown
}>()

const handleClick = () => {
  console.log('WrapperComponent props:', props)
}
</script>

<style scoped>
.wrapper-component {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>