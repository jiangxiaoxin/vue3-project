<template>
  <div ref="containerRef" class="scroll-container" :class="outterCls" >
    <div ref="scrollRef" class="scroll-text"  :class="innerCls">{{ text }}</div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref} from 'vue'
// 禁止自动继承外层属性
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  text: {
    type: String,
    required: true,
    default: '默认的滚动文字'
  },
  speed: {
    type: Number,
    default: 1
  },
  innerCls: {
    type: String,
  },
  outterCls: {
    type: String
  }
})

const containerRef = ref<HTMLDivElement>()
const scrollRef = ref<HTMLDivElement>()

onMounted(() => {
  nextTick(() => {
    scrollText()
  })
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
}

.scroll-text {
  width: max-content;
  white-space: nowrap;
  cursor: pointer;
}
</style>
