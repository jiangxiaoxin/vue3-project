<template>
  <a-form
    ref="formRef1"
    :model="formState"
    :rules="formRules"
    :labelCol="{ style: { width: '80px' } }"
  >
    <a-form-item label="bbb" name="step1Name">
      <a-input v-model:value="formState.step1Name" />
    </a-form-item>
    <div>只做个简单展示，将每一步操作都单独拆分，共同维护数据，减少单一文件的复杂度</div>
    <div>前后之间没有数据依赖，所以每一步只关心自己的数据</div>

    <button @click="updateDeps">改数据</button>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStepState } from '../stepDeps/state'
import useMounted from './usemount'

useMounted()

const depState = useStepState()
const updateDeps = () => {
  depState.step1.time = Date.now()
}

const props = defineProps({
  state: {
    type: Object,
    default: {}
  }
})

const formRef1 = ref(null)

const formState = reactive({
  step1Name: props.state.name
})

const formRules = {
  step1Name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到5个字符', trigger: 'blur' }
  ]
}

defineExpose({
  submit: () => {
    return formRef1.value?.validate()
  }
})
</script>
