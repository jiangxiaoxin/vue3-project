<template>
  <h1 @click="click">父组件{{ count }}</h1>
  <child />
  <child />
</template>
<script lang="ts" setup>
import child from './child.vue'
import { count } from './state'
import { watch, onMounted, onUnmounted } from 'vue'
const click = () => {
  count.value++
}

watch(count, (newValue) => {
  console.log('🚀 ~ watch ~ newValue:', newValue)
})

onMounted(() => {
  console.log('🚀 ~ onMounted ~ onMounted:')
})
</script>
