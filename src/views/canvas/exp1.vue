<template>
    <div class="playground">
        <canvas ref="canvasRef" width="800" height="600" style="background-color: aqua;"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const canvasRef = ref<HTMLCanvasElement>()

onMounted(() => {
    const canvas = canvasRef.value!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 800, 100)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 100, 700, 100)
})

</script>