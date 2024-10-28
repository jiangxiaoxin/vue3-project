<template>
  <a-form
    ref="vFormRef"
    :labelCol="{ style: 'width: 199px' }"
    :model="formData"
    name="vForm"
    layout="inline"
    labelAlign="left"
    :rules="rules"
  >
    <a-form-item
      label="input"
      name="input1723428173738"
      :label-col="{ style: 'width: 300px' }"
      label-align="right"
    >
      <a-input v-model:value="formData.input1723428173738" size="small" allowClear></a-input>
    </a-form-item>
    <a-form-item label="switch" name="switch1723428239584">
      <a-switch v-model:checked="formData.switch1723428239584" size="small"></a-switch>
    </a-form-item>
    <a-form-item label="password" name="password1723428470574">
      <a-input-password
        v-model:value="formData.password1723428470574"
        size="small"
        autocomplete="current-password"
      ></a-input-password>
    </a-form-item>
    <a-form-item label="slider" name="slider1723428470575">
      <a-slider v-model:value="formData.slider1723428470575" :step="10"></a-slider>
    </a-form-item>
    <a-form-item label="password" name="password1723428470576">
      <a-input-password
        v-model:value="formData.password1723428470576"
        size="small"
        autocomplete="current-password"
      ></a-input-password>
    </a-form-item>
    <a-form-item label="radio" name="radio1723428470577">
      <a-radio-group v-model:value="formData.radio1723428470577" size="small">
        <a-radio
          v-for="(item, index) in radio1723428470577Options"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}</a-radio
        >
      </a-radio-group>
    </a-form-item>
    <a-form-item label="checkbox" name="checkbox1723428470578">
      <a-checkbox-group
        v-model:value="formData.checkbox1723428470578"
        :options="checkbox1723428470578Options"
      >
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="time" name="time1723428470579">
      <a-time-picker
        v-model:value="formData.time1723428470579"
        size="small"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
        allowClear
      ></a-time-picker>
    </a-form-item>
    <a-form-item label="time-range" name="timerange1723428470580">
      <a-time-range-picker
        v-model:value="formData.timerange1723428470580"
        size="small"
        format="HH:mm:ss"
        value-format="HH:mm:ss"
        allowClear
      ></a-time-range-picker>
    </a-form-item>
    <a-form-item label="rate" name="rate1723428470581">
      <a-rate v-model:value="formData.rate1723428470581"></a-rate>
    </a-form-item>
    <a-form-item label="date" name="date1723428470582">
      <a-date-picker
        v-model:value="formData.date1723428470582"
        size="small"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        allowClear
      >
        <!-- 请在submit时自行处理格式 -->
      </a-date-picker>
    </a-form-item>
    <a-form-item label="date-range" name="daterange1723428470583">
      <a-range-picker
        v-model:value="formData.daterange1723428470583"
        size="small"
        allowClear
      ></a-range-picker>
    </a-form-item>
    <a-form-item label="select" name="select1723428470584">
      <a-select
        v-model:value="formData.select1723428470584"
        size="small"
        allowClear
        :max-tag-count="2"
        :options="select1723428470584Options"
      ></a-select>
    </a-form-item>
    <a-form-item label="tree-select" name="treeselect1723428470585">
      <a-tree-select
        v-model:value="formData.treeselect1723428470585"
        size="small"
        allowClear
        :tree-data="treeselect1723428470585Options"
      ></a-tree-select>
    </a-form-item>
    <a-divider type="horizontal" plain>分割线</a-divider>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const vFormRef = ref()
const formData = reactive({
  input1723428173738: '',
  switch1723428239584: false,
  password1723428470574: '',
  slider1723428470575: null,
  password1723428470576: '',
  radio1723428470577: null,
  checkbox1723428470578: [],
  time1723428470579: null,
  timerange1723428470580: null,
  rate1723428470581: null,
  date1723428470582: null,
  daterange1723428470583: null,
  select1723428470584: '',
  treeselect1723428470585: ''
})
const rules = {}
const radio1723428470577Options = [
  {
    label: 'radio 1',
    value: 1
  },
  {
    label: 'radio 2',
    value: 2
  },
  {
    label: 'radio 3',
    value: 3
  }
]
const checkbox1723428470578Options = [
  {
    label: 'check 1',
    value: 1
  },
  {
    label: 'check 2',
    value: 2
  },
  {
    label: 'check 3',
    value: 3
  }
]
const select1723428470584Options = [
  {
    label: 'select 1',
    value: 1
  },
  {
    label: 'select 2',
    value: 2
  },
  {
    label: 'select 3',
    value: 3
  }
]
const submitForm = () => {
  vFormRef.value
    ?.validate()
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

<style lang="less" scoped></style>
