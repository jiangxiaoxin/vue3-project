<template>
  <!-- <ReactiveData /> -->

  <!-- <ref和reavtive对比 /> -->

  <!-- <shallow响应式 /> -->

  <!-- <p>父组件内的count: {{ count }}</p>

  <p>父组件内的obj.count: {{ obj.count }}</p>

  <a子组件通过props修改父组件的值 :obj="obj"/> -->

  <!-- <a父子生命周期 v-if="show"/>
  <button @click="show = !show">切换</button> -->

  <!-- <parent /> -->

  <message />

  <a-input v-model="formData.data.code" />

  <button @click="() => console.log('formatdata', formData)">formdata</button>

  <a-form :model="formData.data">
    <a-form-item name="code" label="编码">
      <a-input v-model="formData.data.code" />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
// import ReactiveData from './响应式数据.vue' // 用中文也可以，但别使用
// import ref和reavtive对比 from "./ref和reavtive对比.vue";
// import "./异步测试"
// import  "./异步2"
// import  "./异步3"

import parent from './v-model测试/parent.vue'

import message from './message.vue'

import shallow响应式 from './shallow响应式.vue'

// import a子组件通过props修改父组件的值 from './子组件通过props修改父组件的值.vue' // 要用字母

import a父子生命周期 from './父子生命周期.vue'

const show = ref(false)

const count = ref(123)

const obj = ref({ count: 456 })

const formData = reactive({
  data: {
    code: 'abc'
  }
})
</script>
