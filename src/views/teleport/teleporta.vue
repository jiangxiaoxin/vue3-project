<template>
  <div v-container>
    <h1>teleport parent</h1>

    <teleportb />

    <h1 v-container>teleport parent 下一个普通的child</h1>
    <teleportc />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import teleportb from './teleportb.vue'
import { parentSymbol } from './data.ts'
import teleportc from './teleportc.vue'

const data = ref(new Date())
provide(parentSymbol, data)
</script>
