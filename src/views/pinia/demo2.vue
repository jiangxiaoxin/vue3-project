<template>
  <div>
    <h2>demo2</h2>
    <p>store里存的count:{{ store.count }}</p>
    <button @click="increment">调用store的方法</button>
  </div>
</template>
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'

const foo = ref('foo')

const store = useCounterStore()

const increment = () => {
  store.increment()
  foo.value = Math.random().toString()
}
</script>
