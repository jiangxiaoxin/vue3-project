<template>
  <div class="scroll-container" ref="containerRef">
    <div class="scroll-text" ref="scrollRef">{{ text }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const containerRef = ref<HTMLDivElement>()
const scrollRef = ref<HTMLDivElement>()

const props = defineProps({
  text: {
    type: String,
    default: '这是滚动的文本。'
  },
  speed: {
    type: Number,
    default: 1
  }
})

onMounted(() => {
  scrollText()
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
})

const currentPosition = ref(0)
const animationId = ref()

function scrollText() {
  // @ts-ignore
  const containerWidth = containerRef.value!.offsetWidth
  const textWidth = scrollRef.value!.offsetWidth

  currentPosition.value = containerWidth

  function move() {
    currentPosition.value -= props.speed
    scrollRef.value!.style.transform = `translateX(${currentPosition.value}px)`

    if (currentPosition.value < -textWidth) {
      currentPosition.value = containerWidth
    }

    animationId.value = requestAnimationFrame(move)
  }

  move()

  scrollRef.value!.addEventListener('mouseenter', () => {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  })

  scrollRef.value!.addEventListener('mouseleave', () => {
    move()
  })
}
</script>
<style scoped>
.scroll-container {
  overflow: hidden;
  background: #aaaaaa;
}

.scroll-text {
  /* background: blue; */
  /* width: 300px; */
  width: max-content;
}
</style>
