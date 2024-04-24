<template>
  <a-form ref="formRef" :model="formState" :labelCol="{ style: { width: '80px' } }" :rules="rules">
    <div>step1 填写name 和code，作为step2的依赖，step2要用到这两个数据</div>
    <a-form-item label="name" name="name">
      <a-input v-model:value="formState.name"></a-input>
    </a-form-item>
    <a-form-item label="code" name="code">
      <a-input v-model:value="formState.code"></a-input>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { toRef, ref, inject, onMounted } from 'vue'
const stepState = inject('stepState')
console.log('🚀 ~ step 1stepState:', stepState)

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
</script>
