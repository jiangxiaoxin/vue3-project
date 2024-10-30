<template>
  <div v-container>
    <div v-container>foo: {{ foo }} {{ foo?.length }}</div>
    <div v-container>bar: {{ bar }} {{ bar.length }}</div>
    <div v-container>baz: {{ baz }} {{ baz.length }}</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  foo: {
    type: String,
    required: true
  },
  bar: {
    type: String,
    required: true,
    default: 'default bar'
  },
  baz: {
    type: String,
    default: 'default baz'
  }
})
</script>
