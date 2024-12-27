<template>
  <div>
    <h1>ref 实现响应式数据</h1>
    <div v-container>
      <span>count: {{ count }}</span>
      <button @click="add">+1</button>
    </div>
    <div v-container>
      <section>数组 ref</section>
      <button @click="addArr">add arr</button>
      <ul>
        <li v-for="item in arr" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
  <div>
    <h1>reactive 实现响应式数据</h1>
    <div v-container>
      <span>time: {{ obj.time }}</span>
      <button @click="changeTime">now</button>
    </div>
    <div>
      <button @click="addObjNum">add obj num</button>
      <ul>
        <li v-for="item in obj.num" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
  <div>
    <countChild :count="count" :time="obj.time" :refArr="arr" :obj="obj" />
  </div>
  <props作为初始值 :count="count" />
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import countChild from './countChild.vue'
import props作为初始值 from './props作为初始值.vue'


const count = ref(10)
const add = () => {
  count.value++
}

const arr = ref([0, 1])
const addArr = () => {
  arr.value.push(arr.value.length)
}

const obj = reactive({
  time: Date.now(),
  num: [Math.random()]
})

const changeTime = () => {
  obj.time = Date.now()
}

const addObjNum = () => {
  obj.num.push(Math.random())
}
</script>
