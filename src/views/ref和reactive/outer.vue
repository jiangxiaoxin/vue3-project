<template>
  <div>
    <button @click="changeName">name</button>
    <button @click="changeAge">age</button>
    <button @click="changeChildren">children</button>
    <div v-container>
      <code>{{ JSON.stringify(template, null, 4) }}</code>
    </div>
    <div v-container>
      <code>{{ JSON.stringify(state1, null, 4) }}</code>
    </div>
    <div v-container>
      <code>{{ JSON.stringify(state2, null, 4) }}</code>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { template } from './config'
// const template = {
//   name: '123',
//   age: 1000,
//   children: []
// }
// const state1 = reactive(JSON.parse(JSON.stringify(template)))
// const state2 = ref(JSON.parse(JSON.stringify(template)))

const state1 = reactive(template)
const state2 = ref(template)

const changeName = () => {
  state1.name = 'name' + Math.random().toFixed(2)
  state2.value.name = 'name' + Math.random().toFixed(2)
}

const changeAge = () => {
  state1.age = Math.floor(Math.random() * 1000)
  state2.value.age = Math.floor(Math.random() * 100)
}

const changeChildren = () => {
  state1.children.push({ time: Math.random().toFixed(2) })
  state2.value.children.push({ time: Math.random().toFixed(2) })
}
</script>
