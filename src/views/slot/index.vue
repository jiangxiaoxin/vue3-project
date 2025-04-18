<template>
  <div>
    <p>parent</p>
    <div>父 time {{ time }}</div>

    <child v-slot="slotProps">
      <div style="background-color: red; color: white">
        <div>父组件的内容</div>
        <div>访问父数据 time {{ time }}</div>
        <button @click="changeTime">修改父数据</button>

        <h1>父组件里通过slot作用域访问儿子的数据==> {{ slotProps.message }}</h1>
      </div>
    </child>

    <div v-container>
      <button @click="write">写入</button>
      <button @click="read">读出</button>
      <A v-if="visi"/>
    </div>
  </div>
</template>
<script setup>
import A from './a.vue'
import child from './child.vue'
import { ref } from 'vue'
const time = ref(Date.now())

import {slotConfig} from './config'

const write = () => {
  slotConfig.name += '写入'
}

const visi = ref(false)
const read = () => {
  visi.value = true

}

function changeTime() {
  time.value = Date.now()
}
</script>
