<template>
  <h1>child</h1>
  <p @click.stop="add">modelValue： {{ modelValue }}</p>
  <!-- <p @click.stop="add">localValue: {{ localValue }}</p> -->
</template>
<script setup lang="ts">
import { isRef, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 0
  }
})

const emits = defineEmits(['update:modelValue'])

console.log(isRef(props), isRef(props.modelValue))

const localValue = ref(props.modelValue)

const modelValue = ref(0)

// const modelValue = reactive({
//   name: ''
// })

// watch(
//   localValue,
//   (newValue, oldvalue) => {
//     console.log('🚀 ~ watch ~ newValue, oldvalue:检测到localValue变化', newValue, oldvalue)
//   },
//   { immediate: true }
// )

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    console.log('🚀 ~ watch ~ newValue, oldValue:检测到modelvalue变了', newValue, oldValue)
    // localValue.value = newValue
  },
  { immediate: true }
)

const add = () => {
  //   localValue.value++
  //   emits('update:modelValue', localValue.value)

  //   /**
  //    * 子组件想要修改值，通过update事件通知父组件里值修改
  //    * 父组件里监听update事件，修改值以后，会通过props传递新的值到子组件
  //    */
  //   emits('update:modelValue', props.modelValue + 1)

  modelValue.value++
}
</script>
