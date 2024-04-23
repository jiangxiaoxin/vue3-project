<template>
  <div v-container>
    <h1>A : {{ count }}</h1>
    <button @click="add">+</button>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'
const count = ref(10)
const add = () => {
  count.value++
}
onMounted(() => {
  console.log('A onMounted')
})

onUnmounted(() => {
  console.log('A onUnmounted')
})

onActivated(() => {
  console.log('A onActivated')
})

onDeactivated(() => {
  console.log('A onDeactivated')
})
</script>
