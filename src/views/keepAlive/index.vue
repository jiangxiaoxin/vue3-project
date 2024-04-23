<template>
  <div>
    <h1>keepAlive</h1>
    <div v-container>
      <button @click="toggleKeepAlive">keep:{{ isKeepAlive }}</button>
      <button @click="changeTo('A')">A</button>
      <button @click="changeTo('B')">B</button>
    </div>

    <KeepAlive v-if="isKeepAlive">
      <component :is="current"></component>
    </KeepAlive>
    <component :is="current" v-else></component>
  </div>
</template>
<script setup>
import { ref, shallowRef } from 'vue'
import A from './A.vue'
import B from './B.vue'
const isKeepAlive = ref(false)
const toggleKeepAlive = () => {
  isKeepAlive.value = !isKeepAlive.value
}
const current = shallowRef(A)
const changeTo = (val) => {
  if (val === 'A') {
    current.value = A
  } else {
    current.value = B
  }
}
</script>
