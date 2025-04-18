<template>
  <div style="background-color: red">
    <div>alive one:{{ $route.fullPath }}</div>
    <div>init: {{ initDate }} mounted: {{ mountedDate }}</div>
    <div>{{ $route }}</div>
    <button @click="log">router</button>
    <button @click="count++">{{ count }}</button>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'OneComponent'
})
import {ref,onMounted, onActivated, onDeactivated, onUpdated, onUnmounted} from 'vue'
import dayjs from 'dayjs'
import router from '@/router'
const initDate = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const mountedDate = ref('')
const count = ref(0)
onMounted(() => {
  mountedDate.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log("mounted--", router.currentRoute.value);
  
})
onActivated(() => {
  console.log('onActivated', dayjs().format('YYYY-MM-DD HH:mm:ss'))
})
onDeactivated(() => {
  console.log('onDeactivated', dayjs().format('YYYY-MM-DD HH:mm:ss'))
})

onUpdated(() => {
  console.log('onUpdated', dayjs().format('YYYY-MM-DD HH:mm:ss'))
})

onUnmounted(() => {
  console.log('onUnmounted', dayjs().format('YYYY-MM-DD HH:mm:ss'))
})

const log = () => {
  console.log('route', router)
  console.log('current', router.currentRoute.value,)
}
</script>
