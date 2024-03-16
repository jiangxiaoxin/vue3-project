<template>
  <canvas width="500" height="500" style="width: 500px;height: 500px;" ref="cRef"/>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import TinyForest from "./code.js"
const cRef = ref<HTMLCanvasElement>(null)
let instance;
onMounted(() => {
  instance = new TinyForest(cRef.value)
})

</script>