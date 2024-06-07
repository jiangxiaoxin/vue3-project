<template>
  <div style="padding: 10px; background-color: yellowgreen">
    <a-form :model="formState" ref="formRef" :rules="formRules">
      <template v-for="item in formItemConfig" :key="item.code">
        <a-form-item :label="item.title + '/' + item.code" :name="item.code" v-if="item.component">
          <component :is="item.component" v-model:value="formState[item.code]" v-bind="item.props" allowClear/>
        </a-form-item>
      </template>

    </a-form>

    <div>
      time: {{ testData.time }}
    </div>

    <button @click="submit">提交</button>
    <button @click="print">数据</button>
    <button @click="cancel">取消</button>
    <button @click="replace">替换</button>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import {formConfigs} from "./config"
const formRef = ref<any>(null)
const formState = ref<any>({})
// const formStateTemplate = {} // 用来清空的
const formRules = ref<any[]>([])
const formItemConfig = ref<any[]>([])
const exist = (target: any) => {
  return target !== null && target !== undefined
}

const componentMap = {
  'input': 'a-input',
  'inputnumber': 'a-input-number',
  'textarea': 'a-textarea',
  'select': 'a-select',
  'checkbox': 'a-checkbox-group',
  'radio': 'a-radio-group'
}

// let testData = reactive({
//   time: Date.now()
// })

let testData = ref({
  time: Date.now()
})

const replace = () => {
  // testData = {
  //   time: Date.now()
  // }
  // testData.value.time = Date.now()
  testData.value = {
    time: Math.random()
  }
}

const getConfig = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(formConfigs[0])
    }, 1000)
  })
}

const formatFormConfig = () => {
  return getConfig().then(config => {
    config.forEach((item: any) => {
      if(item.required) {
        formRules.value[item.code] = [
          {
            required: true,
            message: item.title + '为必填项'
          }
        ]
      }

      if(componentMap[item.type]) {
        item.component = componentMap[item.type]
      } else {
        item.component = null
      }

      // 将组件的特殊 attr 提出来，然后通过 v-bind 直接绑定整个对象
      if(item.type === 'select') {
        item.mode  = item.multiple ? 'multiple' : null
      }
      const {mode, options, maxlength, picker} = item
      item.props = {
        mode,
        options,
        maxlength,
        picker
      }

      if(exist(item.defaultValue)) {
        formState.value[item.code] = item.defaultValue
      } else if(item.type === 'select' && item.multiple === true) {
        formState.value[item.code] = []
      } else {
        formState.value[item.code] = null
      }

      // formStateTemplate[item.code] = formState.value[item.code]

    })
    formItemConfig.value = config
    console.log('==最后的config', config)
  })
}

formatFormConfig()

const submit = () => {
  formRef.value?.validate().then(res => {
    console.log('--res', res)
  })
}

const print = () => {
  console.log('state', formState.value)
}

const cancel = () => {
  // ! 这个 resetFields 不能完全信赖。
  //  它只能将后面设置的form-item重置，比如编辑时，有些 item 有值，有些 item 无值，reset 只会让原本就没值的 item 重置
  //  关闭时，除了 clearValidate 意外，还要手动设置各个字段的初始值

  formState.value = {}
  formRef.value?.clearValidate()
}
</script>
