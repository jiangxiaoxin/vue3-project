<template>
  <div v-container>
    <Teleport to="body">
      <div v-container v-show="show">
        动态切换显示,结构已经渲染到body上了，只是通过display切换显示隐藏
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="open">v-if 处理，显示时渲染结构，隐藏时就把结构移除了</div>
    </Teleport>

    <button @click="toggleShow">toggleShow</button>
    <button @click="toggleOpen">toggleOpen</button>
  </div>
</template>

<script setup lang="ts">
import { Teleport, ref } from 'vue'

const show = ref(false)

const toggleShow = () => {
  show.value = !show.value
}

const open = ref(false)
const toggleOpen = () => {
  open.value = !open.value
}
</script>
