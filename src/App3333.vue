<template>
  <div>
    <button @click="submitForm">submit</button>
  </div>

  <a-form
    ref="vFormRef"
    :labelCol="{ style: 'width: 80px' }"
    :model="formData"
    name="vForm"
    layout="horizontal"
    labelAlign="right"
    :rules="rules"
  >
    <a-row :gutter="12">
      <a-col :span="4">
        <a-form-item label="input" name="input1">
          <a-input v-model:value="formData.input1" size="small" allowClear></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="input" name="input1721888074212">
          <a-input v-model:value="formData.input1721888074212" size="small" allowClear></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="input" name="input1721888074213">
          <a-input v-model:value="formData.input1721888074213" size="small" allowClear></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="4">
        <a-form-item label="input" name="input1721888074214">
          <a-input v-model:value="formData.input1721888074214" size="small" allowClear></a-input>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const vFormRef = ref()
const formData = reactive({
  input1: '',
  input1721888074212: '',
  input1721888074213: '',
  input1721888074214: ''
})

const rules = {
  input1: [
    {
      required: true,
      message: 'input不可为空'
    }
  ],
  input1721888074212: [
    {
      required: true,
      message: 'input不可为空'
    }
  ]
}

const submitForm = () => {
  let ref = vFormRef.value

  ref
    .validate()
    .then(() => {
      // TODO form通过验证，可以提交
      console.log('vForm formData', formData)
    })
    .catch((error) => {
      console.log(error)
    })
}
const resetForm = () => {
  vFormRef.value?.resetFields()
}
</script>

<style lang="less">
.red {
  background-color: blue;
}

.in-cls {
  color: red;
  font-size: 40px;
  font-weight: bolder;
  background: green;
}

.out-cls {
  background: blue;
  height: 200px;
  display: flex;
  align-items: center;
}
</style>
