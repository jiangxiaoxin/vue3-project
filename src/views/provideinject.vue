<template>
  <div>
    <h1>provide-inject</h1>
    <p>pfoo 普通数据: {{ pfoo }}</p>
    <p>pbar 响应式数据: {{ pbar }}</p>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const pfoo = inject('pfoo')
const pbar = inject('pbar')
</script>
