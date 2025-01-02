<template>
  <div>
    <h1>ref.value = yyy</h1>
    <p>ref 整体换了才会响应式</p>
    <p @click="num++">num: {{ num }}</p>
    <p @click="bool = !bool">bool: {{ bool }}</p>
    <p @click="arr.push(Date.now())">arr push添加值,并不会响应式: {{ arr }}</p>
    <p @click="arr = [Date.now()]">arr整体重新赋值,会响应式: {{ arr }}</p>
    <p @click="obj.name = 'hello' + Date.now()">obj.name: {{ obj.name }}</p>
    <p @click="obj = {name : Date.now()}">替换obj： {{ obj }}</p>
    
  </div>
  <br />
  <br />
  <br />
  <br />
  <div>
    <p>shallowReactive包对象</p>
    <button @click="console.log(person)">打印person</button>
    <p @click="person.name = 'world' + Date.now()">person.name = xxxx >>> {{ person.name }}</p>
    <p @click="person = {name: 'foo' + Date.now()}">person = { } >>>> {{ person }}</p>
    <p @click="person.school.name = 'ttttt' + Date.now()">school: {{ person.school.name }}</p>
  </div>

  <div
  >
    <p>shallowReactive包数组</p>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.id }} --- {{ item.name }}</li>
    </ul>
    <button @click.stop="list = []">彻底改数组</button>
    <button @click.stop="addByServer">接口添加数据</button>
    <button @click="console.log(list)">打印arr</button>
    <p>{{ list }}</p>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, shallowReactive } from 'vue'

const num = shallowRef(1) // 会响应式变化
const bool = shallowRef(true) // 会响应式变化
const arr = shallowRef([0, 1])
const obj = shallowRef({ name: '123' })

const person = shallowReactive({ name: 'hello', school: { name: 'jjiji' } })

const list = shallowReactive([
  {
    id: 0,
    name: 'name-0'
  }
])

const addByServer = () => {
  list.push({
      id: Date.now(),
      name: 'name-' + Date.now()
    })
}
</script>
