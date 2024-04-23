<template>
  <div>
    <h2>demo1</h2>
    <p>store里存的count:{{ store.count }}</p>
    <button @click="increment">调用store的方法</button>
    <button @click="changeCount">直接通过store修改</button>
  </div>
  <div>
    <p>time:{{ time }}</p>
    <button @click="changeTime">改time</button>
  </div>
</template>
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { getActivePinia } from 'pinia'
import { isReactive, isRef, ref, inject, isProxy } from 'vue'

const time = ref(Date.now())
const changeTime = () => {
  time.value = Date.now()
}

const store = useCounterStore()
console.log('🚀 ~ store:', store)

console.log(
  'store.count',
  store.count,
  isRef(store.count),
  isReactive(store.count),
  isProxy(store.count)
)

const pinia = getActivePinia()
console.log('pinia', pinia)

const increment = () => {
  store.increment()
}

const changeCount = () => {
  /**
   * 这种store的定义方式当然可以在直接修改时仍保持响应式。
   * 因为在store里，直接定义了一个ref，然后直接导出了。外部使用时其实只是访问了一个变量（这里是store）里的ref对象，修改ref对象的值。
   * ! 但这里有区别：并不是通过xxRef.value = xxxx 这种方式去修改值的，而是 xxRef = xxxx。而上面本地的那个time，则是通过 time.value修改的
   * ! 返回的 store.count 是怎么不使用.value 方式又能保持响应式的？
   */
  store.count = Math.random()
}
</script>
