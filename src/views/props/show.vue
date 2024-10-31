<script setup lang="ts">
import { isReactive, isReadonly, onUpdated } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  see: {
    type: Boolean,
    default: false
  },
  foo: {
    type: Object
  }
})

const emits = defineEmits(['update:see'])

const toggle = () => {
  props.show = !props.show
}

/**
 * 虽然不提倡通过props直接修改父组件传来的数据，但是并不是真的改不了
 * 下面就在子组件内修改了foo.bar 的值，然后修改了父组件里的foo.bar 属性
 * 虽然结果是修改了，但依然不应该通过这种方式直接修改
 */
const changeBarInChild = () => {
  props.foo.bar = Date.now()
}

// onUpdated(() => {
//   console.log(
//     'show.vue update',
//     isReactive(props.show),
//     isReadonly(props.show),
//     isReactive(props),
//     isReadonly(props)
//   )
//   console.log(props)
// })

/**
 * 通过v-model在父子组件间建立数据传递，在子组件里不能直接修改props的数据，因为props本身是readonly，修改不起作用
 * 其实不是不起作用，如果是对象而不是简单类型，就可以改，
 */
const toggleSee = () => {
  emits('update:see', !props.see)
}
</script>

<template>
  <div v-container>
    <p>show: {{ show }}</p>
    <button @click="toggle">切换show</button>

    <div>see from parent: {{ props.see }}</div>
    <button @click="toggleSee">改see</button>
    <p @click="changeBarInChild">foo.bar => {{ foo.bar }}</p>
  </div>
</template>

<style scoped lang="less"></style>
