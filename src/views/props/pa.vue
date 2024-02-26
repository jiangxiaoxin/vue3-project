<template>
  <div>
    <p>pa</p>
    <p>mesage:{{ message }}</p>
    <p>time: {{ time }}</p>
    <p>
      <span>loc:{{ loc }}</span>
      <button @click="changeLoc">loc</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { isProxy, isReactive, ref, watch, watchEffect } from 'vue'

// 定义了props，在 template 里直接使用了。
// 但有问题，如果props是作为本地的一个参数，并不是直接使用，怎么访问props呢？
const props = defineProps(['message', 'time'])

console.log('==props', isReactive(props), isProxy(props)) // true true

const loc = ref<string | number>('')
// watchEffect 立即执行一次

const changeLoc = () => {
  loc.value = Math.random()
}

watch(
  loc,
  (newV, oldV) => {
    console.log('watch olc', newV, '--', oldV)
  },
  {
    immediate: true // 立即执行。loc第一次被赋值后就执行一次，此时的old是undeifind。但如果不设置，默认是懒处理的，第一次是不会watch到的
  }
)
// immediate 的意思是在侦听器创建时立马触发回调。这一点上有点类似 watchEffect
// 简单的将loc的watchEffect 放到下面，就会发现，watch(loc)创建后，立马执行了回调 new= '' old = undefined
// 然后又走到了watchEffect，立即执行一次，给loc赋值了，这就触发了watch的再次执行，又打印了一遍 ”watch olc input --“

watchEffect(() => {
  loc.value = props.message
})

// watch props，变化前后还是同一个对象
// watch(props, (newV, oldV) => {
//   console.log('wathc props', Object.is(newV, oldV))// true
//   console.log(newV == oldV, newV === oldV)//true true

//   //   console.log('watch---new', newV.message, newV.time)
//   //   console.log('watch--old', oldV.message, oldV.time)
// })

console.log(props.time)
</script>
