<template>
  <div 
    @click="handleClick" 
    @blur="handleBlur"
    :style="{ minWidth: '200px', minHeight: '100px', border: '1px solid gray', cursor: 'pointer' }"
    tabindex="0"
  >
    {{ modelValue }}
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'click'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 注入 FormItem 的验证上下文
const formItemContext = inject('FormItemInputContext', null)

const handleClick = () => {
  emit('click')
}

const handleBlur = () => {
  // 触发 blur 验证
  if (formItemContext?.onFieldBlur) {
    formItemContext.onFieldBlur()
  }
}

// 当值改变时触发验证
const triggerValidation = () => {
  if (formItemContext?.onFieldChange) {
    formItemContext.onFieldChange()
  }
}

// 暴露方法供父组件调用
defineExpose({
  triggerValidation
})
</script>