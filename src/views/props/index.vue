<template>
  <div>
    <h1>props</h1>
    <div>
      <span>{{ currentTime }}</span>
      <button @click="updateTime">update time</button>
    </div>

    <input :value="value" @input="inputChange" />
    <pa :message="value" :time="currentTime" />

    <div v-container>
      <button @click="changeOrigin">rorigin: {{ rorigin.name }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import pa from './pa.vue'
const currentTime = ref(Date.now())
const updateTime = () => {
  currentTime.value = Date.now()
}
const value = ref('input')
const inputChange = (evt) => {
  //   console.log(evt.target.value)
  value.value = evt.target.value
}

const origin = {
  name: Math.random()
}

const rorigin = reactive(origin)

const changeOrigin = () => {
  rorigin.name = Math.random()
  setTimeout(() => {
    console.log('-prigin name', origin.name, rorigin.name)
  }, 0)
}
</script>
