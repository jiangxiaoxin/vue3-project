<template>
  <div v-container>
    <p>child {{ appValue }}</p>
    <button @click="addValue">+1</button>
    <button @click="changeNo">no ref val</button>
    <h2 @click="() => console.log(noRefValue)">no ref {{ noRefValue.age }}</h2>
  </div>
</template>
<script setup lang="ts">
import { provide, inject } from 'vue'
const appValue = inject('app-value')
const addValue = () => {
  appValue.value = Math.random()
}

let noRefValue = inject<any>('no-ref')
const changeNo = () => {
  noRefValue.age = Math.random()
  console.log('child', noRefValue.age)
}
</script>
