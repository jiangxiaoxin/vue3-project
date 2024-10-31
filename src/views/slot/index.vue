<template>
  <div>
    <p>parent</p>
    <div>父 time {{ time }}</div>

    <child v-slot="slotProps">
      <div>父组件的内容</div>
      <div>访问父数据 time {{ time }}</div>
      <button @click="changeTime">修改父数据</button>

      <h1>父组件里通过slot作用域访问儿子的数据 {{ slotProps.message }}</h1>
    </child>
  </div>
</template>
<script setup>
import child from './child.vue'
import { ref } from 'vue'
const time = ref(Date.now())

function changeTime() {
  time.value = Date.now()
}
</script>
