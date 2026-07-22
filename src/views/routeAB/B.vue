<template>
  <div v-container>
    <h1>Page B</h1>
    <input v-model="inputValue" type="text" placeholder="请输入内容" />
    <button @click="submit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputValue = ref('')

const submit = () => {
  router.replace('/a')
}
</script>
