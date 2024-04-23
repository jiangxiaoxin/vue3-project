<template>
  <a-form
    ref="formRef2"
    :model="formState"
    :rules="formRules"
    :labelCol="{ style: { width: '80px' } }"
  >
    <a-form-item label="2222" name="step2Name">
      <a-input v-model:value="formState.step2Name" />
    </a-form-item>
    <div>name: {{ props.name }}</div>
    <div>step2Name: {{ formState.step2Name }}</div>
    <div>deps 测试：{{ JSON.stringify(depState.step1) }}</div>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStepState } from '../stepDeps/state'

const depState = useStepState()

const props = defineProps({
  state: {
    type: Object,
    default: {}
  }
})

console.log('22', props)

const formRef2 = ref(null)

const formState = reactive({
  step2Name: props.state.name
})

const formRules = {
  step2Name: [
    { required: true, message: '请输入数组', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到5个字符', trigger: 'blur' }
  ]
}

defineExpose({
  submit: () => {
    return formRef2.value?.validate()
  }
})
</script>
