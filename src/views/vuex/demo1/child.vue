<template>
  <div>
    <p>child</p>
    <button @click="click">{{ count }}</button>
  </div>
</template>
<script lang="ts" setup>
import { count } from './state'

const click = () => {
  count.value++
}
</script>
