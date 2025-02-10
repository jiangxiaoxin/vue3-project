<template>
  <p @click.stop="add">value: {{ value }}</p>
  <child v-model="value" />
</template>
<script setup lang="ts">
import child from './child.vue'
import { ref } from 'vue'

const value = ref(100)

const add = () => {
  value.value++
}
</script>
