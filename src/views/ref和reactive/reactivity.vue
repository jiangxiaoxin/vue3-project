<template>
  <div>
    <button
      @click="
        () => {
          count++
        }
      "
    >
      count
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, effect } from 'vue'
const count = ref(0)

effect(() => {
  console.log('in effect', count.value)
})
</script>
