<template>
  <div>
    <h1 @click="click">另一个组件{{ count }}</h1>
  </div>
</template>
<script lang="ts" setup>
import { count } from './state'
const click = () => {
  count.value++
}
</script>
