<template>
  <div v-container>
    <h1>B</h1>
    <input type="text" v-model="str" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'
const str = ref('default')
onMounted(() => {
  console.log('B mounted')
})
onUnmounted(() => {
  console.log('B unmounted')
})
onActivated(() => {
  console.log('B activated')
})
onDeactivated(() => {
  console.log('B deactivated')
})
</script>
