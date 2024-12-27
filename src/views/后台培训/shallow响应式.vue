<template>
  <div>
    <p @click="num++">num: {{ num }}</p>
    <p @click="arr.push(arr.length)">arr push添加值: {{ arr }}</p>
    <p @click="arr = [0]">arr重新赋值: {{ arr }}</p>
    <p @click="arr = [...arr, Date.now()]">arr解构添加值: {{ arr }}</p>
    <p @click="obj.name = 'hello'">obj.name: {{ obj.name }}</p>
    <p @click="bool = !bool">bool: {{ bool }}</p>
  </div>
  <br />
  <br />
  <br />
  <br />
  <div>
    <p>shallowReactive包对象</p>
    <p @click="person.name = 'world'">person name: {{ person.name }}</p>
    <!-- <p @click="person = {name: 'foo'}">person: {{ person }}</p> -->
    <p @click="person.school.name = 'ttttt'">school: {{ person.school.name }}</p>
  </div>

  <div
    @click="
      list.push({
        id: list.length,
        name: 'name-' + list.length
      })
    "
  >
    <p>shallowReactive包数组</p>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.id }} --- {{ item.name }}</li>
    </ul>
    <button @click.stop="list = []">彻底改数组</button>
    <button @click.stop="addByServer">接口添加数据</button>
    <p>{{ list }}</p>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, shallowReactive } from 'vue'

const num = shallowRef(1) // 会响应式变化
const bool = shallowRef(true) // 会响应式变化
const arr = shallowRef([0, 1]) // 不会响应式
const obj = shallowRef({ name: '123' }) // 不会响应式

const person = shallowReactive({ name: 'hello', school: { name: 'jjiji' } })

const list = shallowReactive([
  {
    id: 0,
    name: 'name-0'
  }
])

const addByServer = () => {
  let serverData = [
    {
      id: list.length,
      name: 'name-' + list.length
    }
  ]
  list.push(...serverData)
}
</script>
