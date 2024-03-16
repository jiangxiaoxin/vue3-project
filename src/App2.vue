<template>
  <h1>app 2</h1>
  <button @click="onClick">{{count}}</button>
</template>
<script setup lang="ts">
import {ref} from "vue"
const count = ref(0)
const onClick = () => {
  count.value++;
}
</script>