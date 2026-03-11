<template>
  <div class="demo-container">

    
    <h2>动态渲染示例</h2>

    <MainComp />
    
    <h3>简单配置</h3>
    <DynamicRenderer :config="simpleConfig" />
    
    <h3>带属性配置</h3>
    <DynamicRenderer :config="configWithProps" />

    
    
    <h3>带事件配置{{ inputState.value }}</h3>
    <DynamicRenderer :config="configWithEvents" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import DynamicRenderer from '@/components/DynamicRenderer.vue'
import MainComp from "./ref和reactive/main.vue"

// 简单配置
const simpleConfig = ['input', 'button', 'input']

// 带属性和事件的配置
const configWithProps = [
  'input',
  { name: 'input', props: { placeholder: '请输入姓名', modelValue: '' } },
  { name: 'button', props: { type: 'primary' } },
  { name: 'button', props: { type: 'danger', plain: true } },
]

// 使用 reactive 对象，直接传递引用
const inputState = reactive({
  value: 'haha'
})

// 配置只创建一次，props 是响应式对象的引用，但这样修改后，虽然事件能回调回来，但不会重新传props，导致内部的input 没有收到新数据了
// 问题的关键就是 configWithEvents 是个普通对象。姜内部的props 封装成响应式的，或者将这个config 都改成响应式的，也能触发
const configWithEvents = [
  { 
    name: 'input', 
    props: {
      placeholder: '输入后点击按钮查看值',
      modelValue: inputState.value
    },
    
    // props: reactive({
    //   placeholder: '输入后点击按钮查看值',
    //   get modelValue() { return inputState.value },
    //   set modelValue(val) { inputState.value = val }
    // }),
    events: { 
      'update:modelValue': (val: string) => { 
        console.log('能掉回来');
        
        inputState.value = val
       } 
    }
  },
  { 
    name: 'button', 
    props: { type: 'primary' },
    events: { click: () => alert('Primary button clicked, value:' + inputState.value) }
  },
  { 
    name: 'button', 
    props: { type: 'warning' },
    events: { click: () => alert('Warning button clicked!') }
  },
]
</script>

<style scoped>
.demo-container {
  padding: 20px;
}
</style>