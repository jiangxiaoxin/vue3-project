<template>
  <div class="demo-container">
    <h2>动态渲染示例</h2>
    
    <h3>简单配置</h3>
    <DynamicRenderer :config="simpleConfig" />
    
    <h3>带属性配置</h3>
    <DynamicRenderer :config="configWithProps" />

    
    
    <h3>带事件配置{{ inputValue }}</h3>
    <DynamicRenderer :config="configWithEvents" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import DynamicRenderer from '@/components/DynamicRenderer.vue'

// 简单配置
const simpleConfig = ['input', 'button', 'input']

// 带属性和事件的配置
const configWithProps = [
  'input',
  { name: 'input', props: { placeholder: '请输入姓名', modelValue: '' } },
  { name: 'button', props: { type: 'primary' } },
  { name: 'button', props: { type: 'danger', plain: true } },
]

// 使用 ref 存储输入值
const inputValue = ref('')

// 使用函数返回 props，保持配置数组稳定，只有 props 动态计算
const configWithEvents = [
  { 
    name: 'input', 
    props: () => ({ 
      placeholder: '输入后点击按钮查看值',
      modelValue: inputValue.value 
    }),
    events: { 
      'update:modelValue': (val: string) => { inputValue.value = val } 
    }
  },
  { 
    name: 'button', 
    props: { type: 'primary' },
    events: { click: () => alert('Primary button clicked, value:' + inputValue.value) }
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