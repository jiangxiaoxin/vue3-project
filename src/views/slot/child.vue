<template>
  <div class="child">
    <p>child</p>
    <slot :message="msg"></slot>
    <div>父props传递给子 time {{ time }}</div>
    <a-input v-model:value="msg"></a-input>
    <p>input: {{ msg }}</p>
  </div>
</template>

<script setup>
import { onUpdated, ref } from 'vue'
defineProps({
  time: Number
})

const msg = ref('')

onUpdated(() => {
  console.log('子更新了')
})
</script>
