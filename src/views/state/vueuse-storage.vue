<template>
  <div>
    <button @click="printStorage">打印 storage</button>
    <button @click="pushList">push list</button>
    <ul>
      <li v-for="(num, index) in storage.list" :key="num">{{ num }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { isReactive, isRef, isProxy } from 'vue'

const storage = useStorage('my-storage', {
  name: 'Vueuse',
  version: '1.0.0',
  list: [1, 2, 3]
})

console.log(isRef(storage), isReactive(storage), isProxy(storage), storage.value)

const printStorage = () => {
  console.log('storage===>', storage.value)
}

const pushList = () => {
  storage.value.list.push(Math.random())
}
</script>
