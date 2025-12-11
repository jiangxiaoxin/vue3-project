<template>

    <code>
        <pre>
            ref 深度响应式，
            带着 objRef.value.xxxxx 去改动数据，页面会响应式更新
            objRef.value = {} 这种也会触发更新
            objRef = {} 这种不会触发更新，就相当于变量重新指向了一个新的普通对象，跟响应式完全失去关系
        </pre>
        <pre>
            shallowRef 浅响应式，
            只有 objShallowRef.value = {} 去改动数据，页面才会响应式更新
            而通过 .value.xxx 的方式去改动数据，不会响应式更新
            之前写的测试页面，确实更新了，那是因为 ref 保持响应式，引起页面更新，从而带动了 shallowRef 的显示更新，并不是 shallowRef 本身有了响应式
        </pre>
        <pre>
            reactive 只能包裹对象，包裹后直接通过 . 去访问，是深度响应。
            但 reactive = {} 这种就没响应式了，因为就是非常普通的对变量赋新值， reactive 变量指向了一个普通的新对象
        </pre>
        <pre>
            shallowReactive 浅响应式，只有第一层的key所对应的值直接改变了，才会响应式，否则就不响应
            啥叫直接改变了？
            如果是基础类型，那就是普通的赋值修改
            如果是数组，对象类型，那就要  shallowReactive.xx = {} 这样直接改才是响应式的
            shallowReactive.arr.push(0)  这种不是直接修改第1层的值，不会触发响应式
        </pre>
    </code>

  <!-- <div>objRef.age: {{ objRef.age }}</div>
  <div>objRef.num: {{ objRef.num }}</div> -->
  <!-- <div key="aaa">objShallowRef.age: {{ objShallowRef.age }}</div>
  <div key="bbb">objShallowRef.num: {{ objShallowRef.num }}</div> -->
  <!-- <div>objReactive.age: {{ objReactive.age }}</div> -->
  <!-- <div>objReactive.num: {{ objReactive.num }}</div> -->
  <!-- <div>objShallowReactive.age: {{ objShallowReactive.age }}</div> -->
  <div>objShallowReactive.num: {{ objShallowReactive.num }}</div>
  <button @click="changeAge">单独改age</button>
  <button @click="changeObj">改整个对象</button>

  <button @click="objShallowReactive.num = [200]">直接替换objShallowReactive.num数组</button>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive, shallowReactive } from 'vue'

const objRef = ref({
  age: 0,
  num: [0]
})

const objShallowRef = shallowRef({
  age: 0,
  num: [0]
})

let objReactive = reactive({
  age: 0,
  num: [0]
})

let objShallowReactive = shallowReactive({
  age: 0,
  num: [0]
})

const changeAge = () => {
  objRef.value.age++
  objRef.value.num[0]++
  objShallowRef.value.age++
//   objShallowRef.value.num[0]++
  objReactive.age++
  objReactive.num[0]++
  objShallowReactive.age++
  objShallowReactive.num[0]++
}

const changeObj = () => {
  const age = Math.ceil(Math.random() * 100)
  objRef.value = {
    age,
    num: [age]
  }
  objShallowRef.value = {
    age,
    num: [age]
  }
  objReactive = {
    age,
    num: [age]
  }
  objShallowReactive = {
    age,
    num: [age]
  }
}
</script>
