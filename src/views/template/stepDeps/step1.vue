<template>
  <a-form ref="formRef" :model="formState" :labelCol="{ style: { width: '80px' } }" :rules="rules">
    <div>step1 填写name 和code，作为step2的依赖，step2要用到这两个数据</div>
    <a-form-item label="name" name="name">
      <a-input
        v-model:value="formState.name"
        @keydown="keydownHandler"
        id="tttt"
        ref="inputRef"
      ></a-input>
    </a-form-item>
    <a-form-item label="code" name="code">
      <a-input v-model:value="formState.code"></a-input>
    </a-form-item>
    <button @click="mock">模拟</button>
    <input type="text" @keydown="keydownHandler" id="basicInput" />
  </a-form>
</template>

<script setup lang="ts">
import { toRef, ref, inject, onMounted } from 'vue'
const stepState = inject('stepState')
console.log('🚀 ~ step 1stepState:', stepState)

const inputRef = ref(null)
const formRef = ref(null)

// @ts-ignore
const formState = toRef(stepState, 'step1')
console.log('🚀 ~ step 1 formState:', formState)

// !不需要响应式
const rules = {
  name: [{ required: true, message: '请输入name', trigger: 'blur' }],
  code: [{ required: true, message: '请输入code', trigger: 'blur' }]
}

defineExpose({
  reset: () => {
    formRef.value?.resetFields()
  }
})

onMounted(() => {
  console.log('🚀 ~ step 1 onMounted')
})

const keydownHandler = (e: any) => {
  console.log('🚀 ~ step 1 keydownHandler')
}
const mock = () => {
  // var ele = document.getElementById('tttt')
  // var event = new Event('keydown', { bubbles: true, cancelable: false })
  // event.keyCode = 13
  // ele.dispatchEvent(event)

  // console.log('rfffff', inputRef.value)

  // formState.value.name = '123\x0d'
  // console.log('🚀 ~ mock ~ formState:', formState)

  let input = document.getElementById('basicInput')
  input.value = Math.random() + '\x0d'
}
</script>
