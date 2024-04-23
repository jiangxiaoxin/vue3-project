<template>
  <a-modal v-model:open="openState" title="随便写个" :bodyStyle="{ minHeight: '300px' }">
    <div>active: {{ active }}</div>
    <div>{{ JSON.stringify(step1Data) }}</div>
    <div>{{ JSON.stringify(step2Data) }}</div>
    <div>{{ JSON.stringify(step3Data) }}</div>
    <Step1 v-if="active === 0" :state="step1Data" ref="step1Ref" />
    <Step2 v-else-if="active === 1" :state="step2Data" ref="step2Ref" />
    <Step3 v-else :state="step3Data" ref="step3Ref" />

    <template #footer>
      <a-button key="cancel" @click="handleCancel" size="small">取消</a-button>
      <a-button key="prev" @click.stop="handlePrev" v-if="active > 0" size="small">上一步</a-button>
      <a-button key="next" @click="handleNext" v-if="active < 2" size="small">下一步</a-button>
      <a-button key="submit" @click="handleSubmit" v-if="active === 2" size="small">确定</a-button>
      <a-button key="log" type="primary" @click="handleLog" size="small">打印所有数据</a-button>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'

const confirmLoading = ref(false)
const openState = ref(false)

const active = ref(0)
const step1Ref = ref(null)
const step2Ref = ref(null)
const step3Ref = ref(null)

const step1Data = reactive({
  name: ''
})

const step2Data = reactive({
  name: ''
})

const step3Data = reactive({
  name: ''
})

defineExpose({
  open: ({ name, code, desc }) => {
    step1Data.name = name
    step2Data.name = code
    step3Data.name = desc
    openState.value = true
  }
})
const handlePrev = async () => {
  active.value--
}
const handleNext = async () => {
  //   active.value++
  //   return
  try {
    if (active.value === 0) {
      const res = await step1Ref.value?.submit()
      console.log('🚀 ~ handleNext ~ res:', res)
      step1Data.name = res.step1Name
      active.value++
    } else if (active.value === 1) {
      const res = await step2Ref.value?.submit()
      step2Data.name = res.step2Name
      active.value++
    }
  } catch (error) {
    console.log('🚀 ~ handleNext ~ error:', error)
  }
}
const handleSubmit = async () => {
  try {
    if (active.value === 2) {
      // 确定只在最后一步才出现
      const res = await step3Ref.value?.submit()
      step3Data.name = res.step3Name
      console.log('**submit', step1Data, step2Data, step3Data)
    }
  } catch (error) {
    console.log('🚀 ~ handleSubmit ~ error:', error)
  }
}
const handleCancel = () => {}

const handleLog = () => {
  console.log('===log', step1Data, step2Data, step3Data)
}
</script>
