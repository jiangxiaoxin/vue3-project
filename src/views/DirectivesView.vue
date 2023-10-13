<template>
  <ul>
    <li>
      <input type="text" />
      <input type="text" v-focus placeholder="自动focus" />
      <input value="123" v-hello />
    </li>
    <li>
      <div v-aabc-bc>123</div>
    </li>
    <li>
      <NoScriptSetup />
    </li>
    <li>
      <div v-add-cls="'directive-add-cls'">通过directive添加class</div>
      <MsgItem msg="添加class到组件上" v-add-cls="'add-cls-to-component'" />
      <!-- <MsgItem2 v-add-cls="'add-cls-to-component'" /> -->
    </li>
    <li>
      <div v-test>v-test</div>
    </li>
    <li>
      <p>count: {{ count }}</p>
      <button @click="addCount">add</button>
      <button v-copy="count">copy</button>
    </li>
  </ul>
</template>
<script setup lang="ts">
/**
 * 自定义指令添加总体分为2种方式：
 * 1. 在main.ts里通过app.directive 对全局添加指令。添加后在项目里都可以用
 * 2. 在具体使用到的地方，局部注册指令。
 *    在使用 script setup的地方，只要是以v打头的驼峰式变量方法，都可以认为是自定义指令
 *    没有script setup的话，那就要自己通过 directives: {} 这种方式注册。就像 NoScriptSetup 里实现那样
 */
import NoScriptSetup from './NoScriptSetup.vue'
import MsgItem from '@/components/MsgItem.vue'
import MsgItem2 from '@/components/MsgItem2.vue'
import { ref } from 'vue'
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
}

const vAabcBc = {
  mounted: (el: HTMLElement) => {
    console.log('el mounted', el)
  }
}

const count = ref(0)
const addCount = () => {
  count.value++
}
</script>
