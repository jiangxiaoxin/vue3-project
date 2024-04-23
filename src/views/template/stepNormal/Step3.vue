<template>
  <a-form
    ref="formRef3"
    :model="formState"
    :rules="formRules"
    :labelCol="{ style: { width: '80px' } }"
  >
    <a-form-item label="333" name="step3Name">
      <a-input v-model:value="formState.step3Name" />
    </a-form-item>
  </a-form>
  <div>
    form item 绑定了 rules 来做校验，trigger 设置的是 blur，那在这步，删除干净后，点击上一步，会触发
    blur，进而校验报错，这样会在“上一步”时有个瞬间的红色闪动。本身不影响功能，且也不应该影响功能。只是视觉上的异常。不能接受的话，可以改为
    change 去检测，这样不需要 blur ，在修改的过程中就已经提示了，再上一步，只是用户行为
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps({
  state: {
    type: Object,
    default: {}
  }
})

const formRef3 = ref(null)

const formState = reactive({
  step3Name: props.state.name
})

const formRules = {
  step3Name: [
    { required: true, message: '请输入时间', trigger: 'change' },
    { min: 2, max: 10, message: '姓名长度在2到5个字符', trigger: 'change' }
  ]
}

defineExpose({
  submit: () => {
    return formRef3.value?.validate()
  }
})
</script>
