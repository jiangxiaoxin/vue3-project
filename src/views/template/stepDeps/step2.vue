<template>
  <a-form ref="formRef" :model="step1State" :labelCol="{ style: { width: '80px' } }">
    <div v-container>
      <a-form-item label="name" name="name">
        <a-input v-model:value="step1State.name" :disabled="true"></a-input>
      </a-form-item>
      <a-form-item label="code" name="code">
        <a-input v-model:value="step1State.code" :disabled="true"></a-input>
      </a-form-item>
    </div>
    <div v-container>
      <a-form-item label="desc" name="desc">
        <a-input v-model:value="step2State.desc"></a-input>
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { toRef, ref, inject, onMounted } from 'vue'
const stepState = inject('stepState')
// @ts-ignore
const step1State = toRef(stepState, 'step1')
const step2State = toRef(stepState, 'step2')
const formRef = ref(null)
defineExpose({
  reset: () => {
    formRef.value?.resetFields()
  }
})

onMounted(() => {
  console.log('step2 onMounted')
})
</script>
