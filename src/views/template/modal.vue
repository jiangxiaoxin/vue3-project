<template>
  <a-modal
    v-model:open="openState"
    :title="title"
    cancelText="取消按钮文字"
    okText="确认按钮"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    destroyOnClose
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      :labelCol="{ style: { width: '80px' } }"
      class="table-modal-form"
      :disabled="mode === ModeEnum.view"
    >
      <a-form-item label="name" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="code" name="code">
        <a-input
          v-model:value="formState.code"
          :disabled="mode === ModeEnum.view || mode === ModeEnum.edit"
        />
      </a-form-item>
      <a-form-item label="type" name="type">
        <a-select v-model:value="formState.type" placeholder="请选择" :options="typeOptions">
        </a-select>
      </a-form-item>
      <a-form-item label="时间" name="time" v-if="formState.type === '1'">
        <a-date-picker v-model:value="formState.time" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item label="次数" name="count" v-else-if="formState.type === '2'">
        <a-input v-model:value="formState.count" />
      </a-form-item>

      <a-form-item label="startTime" name="startTime">
        <a-date-picker v-model:value="formState.startTime" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item label="endTime" name="endTime">
        <a-date-picker v-model:value="formState.endTime" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item label="desc" name="desc">
        <a-textarea v-model:value="formState.desc" show-count :maxlength="100" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ModeEnum, rules, formStateTemplate, typeOptions } from './config'
import { message } from 'ant-design-vue'

const emit = defineEmits(['success'])

defineExpose({
  open: (_data: any, _mode: ModeEnum) => {
    mode.value = _mode
    if (_mode === ModeEnum.edit || _mode === ModeEnum.view) {
      const {
        id,
        materialName: name,
        materialCode: code,
        desc,
        startTime,
        endTime,
        status,
        type,
        count,
        time
      } = _data
      formState.id = id
      formState.name = name
      formState.code = code
      formState.type = type
      formState.desc = desc
      formState.startTime = startTime
      formState.endTime = endTime
      formState.status = status
      formState.count = count
      formState.time = time
    } else if (_mode === ModeEnum.add) {
      let keys = Object.keys(formState)
      console.log('🚀 ~ keys:', keys)
      keys.forEach((key) => {
        // @ts-ignore
        formState[key] = formStateTemplate[key]
      })
    }
    openState.value = true
  }
})

const title = computed(() => {
  return mode.value === ModeEnum.add ? '新增' : mode.value === ModeEnum.edit ? '编辑' : '查看'
})

const formRef = ref(null)
const openState = ref(false)
const mode = ref(ModeEnum.add)
const confirmLoading = ref(false) // 考虑多次点击提交
const formRules = {
  ...rules,
  endTime: [
    {
      required: true,
      validator: (_, value) => {
        console.log('🚀 ~ value:', value, formState.startTime)

        if (!value) {
          return Promise.reject('结束时间不能为空111')
        } else if (Date.parse(value) < Date.parse(formState.startTime!)) {
          return Promise.reject('结束时间不能小于开始时间')
        } else {
          return Promise.resolve()
        }
      },
      trigger: 'blur'
    }
  ]
} // ! rules 是不需要响应式的
// ! 如果直接用 formStateTemplate， 会导致数据绑定到 formStateTemplate 上
const formState = reactive({
  ...formStateTemplate
})

const statusOptions = ref<any[]>([])

const handleSubmit = () => {
  confirmLoading.value = true
  formRef.value
    ?.validate()
    .then((res) => {
      console.log('🚀 ~ handleSubmit ~ res:', res)
      setTimeout(() => {
        if (mode.value === ModeEnum.add) {
          message.success('新增成功')
        } else {
          message.success('修改成功')
        }
        emit('success')
        // handleCancel()
        confirmLoading.value = false
        console.log('ressssss')
      }, 2000)
    })
    .catch((error) => {
      console.log('🚀 ~ handleSubmit ~ error:', error)

      confirmLoading.value = false
    })
}

const handleCancel = () => {
  openState.value = false
  formRef.value?.resetFields()
}

const getStatusDict = () => {
  setTimeout(() => {
    statusOptions.value = [
      {
        value: 1,
        label: '启用'
      },
      {
        value: 2,
        label: '禁用'
      },
      {
        value: 3,
        label: '删除'
      }
    ]
  }, 3000)
}

// created 拿基本数据
getStatusDict()
</script>

<style lang="less">
.table-modal-form {
  .ant-picker {
    width: 100%;
  }
}
</style>
