<template>
  <vxe-modal
    v-model="modalVisible"
    title="随便个标题"
    width="600px"
    height="600px"
    show-footer
    @close="closeModal"
  >
    <div>
      <p>state:</p>
      <code>
        {{ JSON.stringify(state, null, 2) }}
      </code>
    </div>
    <Step1 v-if="activeKey === 0" ref="step1Ref" />
    <Step2 v-if="activeKey === 1" ref="step2Ref" />
    <template #footer>
      <vxe-button @click="prev">上一步</vxe-button>
      <vxe-button @click="next">下一步</vxe-button>
      <vxe-button status="primary" @click="submit">确定</vxe-button>
    </template>
  </vxe-modal>
</template>

<script setup lang="ts">
import { ref, reactive, provide } from 'vue'
import Step1 from './step1.vue'
import Step2 from './step2.vue'
import { useStepState } from './state'

const modalVisible = ref(false)
const activeKey = ref(0)
let state = useStepState()
provide('stepState', state)
const step1Ref = ref(null)
const step2Ref = ref(null)

defineExpose({
  open: () => {
    // debugger
    modalVisible.value = true
    activeKey.value = 0
  }
})

const closeModal = () => {
  modalVisible.value = false
  activeKey.value = 0
  step1Ref.value?.reset()
  step2Ref.value?.reset()
}

const prev = () => {
  activeKey.value = Math.max(0, activeKey.value - 1)
}

const next = () => {
  activeKey.value = Math.min(1, activeKey.value + 1)
}

const submit = () => {
  console.log('state:::submit', state)
  closeModal()
  setTimeout(() => {
    state.step1 = {
      code: '',
      name: ''
    }
    state.step2 = {
      desc: ''
    }
  }, 1000)

  // ! 这是不行的，state只是个本地变量，只想了另一个object而已
  // state = {
  //   step1: {
  //     code: '',
  //     name: ''
  //   },
  //   step2: {
  //     desc: ''
  //   }
  // }

  // setTimeout(() => {
  //   state = useStepState()
  // }, 1000)
}
</script>
