<template>
  <vxe-modal
    ref="modalRef"
    :title="title"
    show-zoom
    resize
    @close="closeModal"
    width="800"
    :show-footer="true"
  >
    <div style="margin-bottom: 30px">
      <span style="display: inline-block; width: 120px; text-align: right">选择配置方案：</span>
      <a-select
        v-model:value="configId"
        :options="options"
        @change="configChange"
        style="width: calc(100% - 120px)"
      ></a-select>
    </div>
    <DynamicForm ref="formRef" v-show="configId" />

    <template #footer>
      <a-space>
        <a-button type="primary" @click="onSubmit">确定</a-button>
        <a-button @click="onCancel">取消</a-button>
      </a-space>
    </template>
  </vxe-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import DynamicForm from './form.vue'

const modalRef = ref<any>(null)
const mode = ref('add')
const formRef = ref<any>(null)
const configId = ref(null)
const detailData = ref<any>(null)
const options = ref([
  {
    value: 1,
    label: '配置1'
  },
  {
    value: 2,
    label: '配置2'
  }
])

const title = computed(() => {
  if (mode.value === 'add') {
    return '新增'
  }
  if (mode.value === 'edit') {
    return '编辑'
  }
  return '查看'
})

const openModal = (_mode: any, data: any, _configId: any) => {
  mode.value = _mode
  detailData.value = data
  configId.value = _configId
  console.log('--_configId', _configId)

  modalRef.value?.open()
  nextTick(() => {
    if (configId.value !== null && configId.value !== undefined) {
      formRef.value?.init(_mode, data, configId.value)
    }
  })
}

const configChange = () => {
  nextTick(() => {
    formRef.value?.init(mode.value, detailData.value, configId.value)
  })
}

defineExpose({
  open: openModal
})

const onSubmit = () => {
  if (mode.value === 'view') {
    onCancel()
    return
  }
  formRef.value
    ?.validate()
    .then((res: any) => {
      // res 只是表单里的内容返回的，很多 detail 上的数据是没有的，
      console.log('--res', res)
      const params = {}
      if (detailData.value) {
        for (let key in detailData.value) {
          params[key] = detailData.value[key]
        }
      }
      for (let key in res) {
        params[key] = res[key]
      }
      console.log('-最后要提交的数据', params)
      // onCancel()
    })
    .catch((error) => {
      console.log('--error', error)
    })
}

const closeModal = () => {
  console.log('--close modal')
  formRef.value?.resetFields()
}
const onCancel = () => {
  modalRef.value?.close()
  formRef.value?.resetFields()
}
</script>
