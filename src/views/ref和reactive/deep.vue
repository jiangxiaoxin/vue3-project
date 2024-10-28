<template>
  <div>
    <p>ref: {{ foo.a.b.c }}</p>
    <p>reactive: {{ bar.a.b.c }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'

const foo = ref({
  a: {
    b: {
      c: 100
    }
  }
})

const bar = reactive({
  a: {
    b: {
      c: 200
    }
  }
})

setTimeout(() => {
  foo.value.a.b.c += 1
  //   bar.a.b.c += 1

  const { a } = bar
  a.b.c += 100
}, 2000)
</script>
