<template>
  <div>
    <!-- <p class="no-scoped-parent">在父级调用 no-scoped-parent</p> -->
    <p class="scoped-parent">在父级调用 scoped-parent</p>
    <basicComp />
    <!-- <childSameName /> -->
    <!-- <scoped1 :style="styleObj" msg="hello" ha="haaaa" /> -->
    <!-- <scoped1 style="color: blue; font-size: 50px" /> -->

    <p class="no-scoped-red no-scoped-blue">no-scoped-red no-scoped-blue</p>
    <p class="no-scoped-blue no-scoped-red">no-scoped-blue no-scoped-red</p>
  </div>
</template>

<script setup lang="ts">
/**
 * 1. 父组件引用两个平级的组件a和b，都有同一个样式，但a中使用scoped写样式
 * 2. 作为对比，a和b仍一样，只是样式不写scoped
 * 3. 父组件写一个class，看子组件是否能使用
 * 4. 父组件里使用 scoped，子组件能否生效
 */

import scoped1 from './scoped1'
import basicComp from './basicComp.vue'
import childSameName from './childSameName.vue'

import { ref, reactive } from 'vue'

const styleObj = reactive({
  color: 'red',
  fontSize: '40px'
})
</script>

<!-- <style>
.no-scoped-parent {
  color: yellow;
  font-size: 50px;
  border: 1px solid red;
}
</style> -->

<style scoped>
.scoped-parent {
  color: pink;
  font-size: 50px;
}
</style>

<style>
.no-scoped-blue {
  color: blue;
}

.no-scoped-red {
  color: red;
}
</style>
