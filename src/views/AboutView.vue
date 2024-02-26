<template>
  <div class="about" v-container>
    <div>
      parent
      <div>child</div>
    </div>

    <scrollView />
    <h1>This is an about page</h1>
    <el-button @click="clickBtn" v-first>123</el-button>
    <p>global msg: {{ globalMsg }}</p>
    <p>自己的 bar: {{ bar }}</p>
    <button @click="changeBar">修改bar</button>
    <ProvideInject v-container />
  </div>
</template>

<script setup lang="ts">
import { inject, provide, ref } from 'vue'
import ProvideInject from './provideinject.vue'
import scrollView from './scrollView.vue'
const globalMsg = inject('globalMsg')

provide('pfoo', 'pfoo')

const bar = ref(Math.random())
provide('pbar', bar)

const clickBtn = () => {
  alert('123')
}

const changeBar = () => {
  bar.value = Math.random()
}

const vFirst = (el: HTMLElement) => {
  el.addEventListener(
    'click',
    (e) => {
      console.log('directive')

      e.stopImmediatePropagation()
    },
    true
  )
}
</script>
