<template>
  <VxeModal @close="closeModal">
    <div>vxe modal</div>
    <!-- <div>localShow : {{ localShow }}</div> -->
    <!-- <div>show : {{ props.show }} ---</div> -->
    <button @click="closeModal">内部关闭</button>
  </VxeModal>
</template>
<script lang="ts" setup>
import { watch, computed, isReactive, isRef, isReadonly, watchEffect, onUpdated } from 'vue'
// const props = defineProps({
//   show: {
//     type: Boolean,
//     default: false
//   },
//   timer: {
//     type: Number,
//     default: 1234
//   }
//   // modelValue: {
//   //   type: Boolean
//   // }
// })

// onUpdated(() => {
//   console.log('🚀 ~ onUpdated ~ onUpdated:', props.show, props)
// })

// console.log('props', isReactive(props), isRef(props), isReadonly(props)) //true-false-true

// const localShow = computed({
//   get: () => {
//     console.log('child get localshow', props.show)
//     return props.show
//   },
//   set: (val: boolean) => {
//     console.log('🚀 ~ val:', val)

//     emit('update:show', val)
//   }
// })

// watchEffect(() => {
//   console.log('wath effect', props.show, props.modelValue)
// })

// watch(
//   () => props,
//   (newVal) => {
//     console.log('newVal props', newVal)
//   },
//   { immediate: true, deep: true }
// )

const emit = defineEmits(['update:show', 'update:modelValue'])

const closeModal = () => {
  console.log('🚀 ~ closeModal ~ closeModal:')
  // emit('update:show', false)
  emit('update:modelValue', false)
}
</script>
