<template>
  <a-form
    :model="formState"
    :rules="rules"
    ref="formRef"
    :label-col="{ style: 'width: 120px' }"
    class="custom-dynamic-form"
    :disabled="mode === 'view'"
  >
    <a-row>
      <template v-for="item in formattedConfig" :key="item.code">
        <a-col :span="colSpan">
          <a-form-item :label="item.title" :name="item.code">
            <a-input
              v-if="item.type === 'input'"
              v-model:value="formState[item.code]"
              allowClear
              :maxlength="item.maxlength"
              :placeholder="item.placeholder"
            />
            <a-textarea
              v-else-if="item.type === 'textarea'"
              v-model:value="formState[item.code]"
              :rows="item.rows"
              allowClear
              :maxlength="item.maxlength"
              :placeholder="item.placeholder"
              :showCount="item.showCount"
            />
            <a-input-number
              v-else-if="item.type === 'inputnumber'"
              v-model:value="formState[item.code]"
              :min="item.min"
              :max="item.max"
              :precision="item.precision"
            />
            <a-radio-group v-else-if="item.type === 'radio'" v-model:value="formState[item.code]">
              <a-radio
                v-for="option in optionMap[item.code]"
                :key="option.value"
                :value="option.value"
                >{{ option.label }}</a-radio
              >
            </a-radio-group>
            <a-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model:value="formState[item.code]"
              :name="item.code"
              :options="optionMap[item.code]"
            />
            <a-select
              v-else-if="item.type === 'select'"
              v-model:value="formState[item.code]"
              :options="optionMap[item.code]"
              allowClear
              :placeholder="item.placeholder"
              showSearch
              :mode="item.mode"
            ></a-select>
            <a-date-picker
              v-else-if="item.type === 'datepicker'"
              v-model:value="formState[item.code]"
              :picker="item.picker"
              :valueFormat="item.valueFormat"
            />
            <a-range-picker
              v-else-if="item.type === 'rangepicker'"
              v-model:value="formState[item.code]"
              :showTime="item.showTime"
              :valueFormat="item.valueFormat"
            />
            <a-time-picker
              v-else-if="item.type === 'timepicker'"
              v-model:value="formState[item.code]"
              :valueFormat="item.valueFormat"
              :format="item.format"
            />
            <a-time-range-picker
              v-else-if="item.type === 'timerange'"
              v-model:value="formState[item.code]"
              :valueFormat="item.valueFormat"
              :format="item.format"
            />
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { formConfigs } from './config'

/**
 * TODO 通过component 动态组件实现，format时提前处理好所有的属性和事件，这样component 可以通用性质的绑定
 */
/**
 * TODO
 * 1. datepicker 的比较麻烦，涉及到接口到底是什么格式
 */

const formRef = ref<any>(null)
const formattedConfig = ref<any[]>([])
const formState = reactive<any>({})
const rules = ref<any>({})
const optionMap = reactive<any>({})
const mode = ref<any>('add')
const detail = ref<any>(null)
const configId = ref<any>(null)

const colSpan = ref(24)

const init = (_mode, _detail, _configId) => {
  mode.value = _mode
  detail.value = _detail
  configId.value = _configId

  getFormConfig(_configId)
    .then((config: any) => {
      if (config.length >= 10) {
        colSpan.value = 12
      } else {
        colSpan.value = 24
      }
      config.forEach((item: any) => {
        // 处理特殊属性
        if (item.type === 'textarea') {
          item.rows = item.rows || 4 // 默认最多4行
          item.showCount = item.showCount || item.maxlength // 特意要显示，或者设定了最长，就显示字数
        }

        if (item.type === 'select') {
          if (item.multiple) {
            item.mode = 'multiple'
          } else {
            item.mode = null
          }
        }

        if (item.type === 'datepicker') {
          if (!item.valueFormat) {
            let valueFormat = 'YYYY-MM-DD' // 默认选择日期
            if (item.picker === 'year') {
              valueFormat = 'YYYY'
            } else if (item.picker === 'month') {
              valueFormat = 'YYYY-MM'
            } else {
              // TODO 其他类型先不考虑，还没用到
            }
            item.valueFormat = valueFormat
          }
        }

        if (item.type === 'rangepicker') {
          if (item.showTime) {
            item.valueFormat = 'YYYY-MM-DD HH:mm:ss'
          } else {
            item.valueFormat = 'YYYY-MM-DD'
          }
        }

        if (item.type === 'timepicker' || item.type === 'timerange') {
          if (!item.valueFormat) {
            item.valueFormat = 'HH:mm:ss'
          }
          item.format = item.valueFormat
        }

        // 处理选项
        /**
         * 对选项的处理有两种方式：
         * 1. 要么不管接口结束，只交出去，这样可以先显示页面的其余部分，跟选项有关的，暂时无法显示
         * 2. 要么这里async await，加载完数据，放到 item.options 里
         */
        if (item.options) {
          optionMap[item.code] = item.options
        } else if (item.dict) {
          getDict(item.code, item.dict)
        }

        // 处理 placeholder
        if (inputElements.includes(item.type)) {
          item.placeholder = item.placeholder || '请输入'
        } else {
          item.placeholder = item.placeholder || '请选择'
        }

        // 处理 rules
        if (item.required) {
          let msg = ''
          if (inputElements.includes(item.type)) {
            msg = '请输入' + item.title
          } else {
            msg = '请选择' + item.title
          }

          rules.value[item.code] = [{ required: true, message: msg, trigger: 'blur' }]
        }

        // 处理初始值==>formState
        // TODO 要针对不同类型设置不同的初始值，这里先设置为null
        if (item.type === 'textarea' || item.type === 'input') {
          // ! defaultValue 其实很鸡肋，虽然有它，但是即使value绑定的是 "", 也不会用到它。直接将它付给初始状态值吧
          formState[item.code] = item.defaultValue || ''
        } else if (item.type === 'inputnumber') {
          formState[item.code] = item.defaultValue || null
        } else if (item.type === 'select') {
          if (item.multiple) {
            formState[item.code] = item.defaultValue || []
          } else {
            formState[item.code] = item.defaultValue || null
          }
        } else {
          formState[item.code] = item.defaultValue || null
        }
      })
      formattedConfig.value = config

      console.log('--config', formattedConfig.value)
      console.log('--rules', rules.value)
    })
    .then(() => {
      if (_mode !== 'add' && _detail) {
        // 只有查看和编辑时，才是有初始数据的
        for (let key in _detail) {
          if (_detail[key] !== null && _detail[key] !== undefined) {
            // 如果某个key对应的值是真的有，才赋值。否则都先以 defaultValue 或者 null 为值
            formState[key] = _detail[key]
          }
        }
      }
    })
}

defineExpose({
  init,
  validate: () => {
    if (formRef.value) {
      return formRef.value?.validate()
    }
    return Promise.reject('没有form')
  },
  resetFields: () => {
    if (formRef.value) {
      return formRef.value?.resetFields()
    }
  }
})

const getFormConfig = (_configId: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(formConfigs[_configId - 1])
    }, 2000)
  })
}

const getDict = (code: any, dict: any) => {
  return new Promise((resolve, reject) => {
    let delay = Math.min(3000, Math.max(1000, Math.random() * 5000))
    setTimeout(() => {
      resolve([
        {
          value: 1,
          label: `${code}服务选项1`
        },
        {
          value: 2,
          label: `${code}服务选项2`
        }
      ])
    }, delay)
  })
    .then((res) => {
      optionMap[code] = res
    })
    .catch(() => {
      optionMap[code] = []
    })
}

const inputElements = ['input', 'inputnumber', 'textarea']
</script>

<style lang="less" scoped>
.custom-dynamic-form {
  .ant-input-number,
  .ant-picker {
    width: 100% !important;
  }
}
</style>
