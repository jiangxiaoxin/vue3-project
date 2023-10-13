<template>
  <Teleport to="body">
    <div>data from parent: {{ dataFromParent }}</div>
    <div v-container>
      <h1>teleport parent下的child, 通过to渲染到body上</h1>
    </div>
    <Teleport to="#app">
      <div v-container>渲染到app下</div>
    </Teleport>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport, inject } from 'vue'
import { parentSymbol } from './data.ts'
const dataFromParent = inject(parentSymbol)
</script>
