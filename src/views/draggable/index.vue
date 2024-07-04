<template>
  <div>
    <div>
      <button @click="logData">data</button>
    </div>

    <div class="list" v-for="day in WeeklyArray" :key="day.id">
      <h1 style="border: 1px solid red; color: red">{{ day.name }}</h1>
      <draggable :list="filterArray(day)" item-key="id" group="a" @add="addTo">
        <template #item="{ element }">
          <div class="item">{{ element.id }} --- {{ element.name }}</div>
        </template>
      </draggable>
    </div>
    <div class="list">
      <draggable v-model="list2" item-key="id" group="a">
        <template #item="{ element }">
          <div class="item">{{ element.id }} --- {{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
const WeeklyArray = ref([
  {
    id: 1,
    name: '星期一'
  },
  {
    id: 2,
    name: '星期二'
  },
  {
    id: 3,
    name: '星期三'
  }
])

const list = ref([
  { id: 1, name: 'Abby', day: 1 },
  { id: 2, name: 'Brooke', day: 2 },
  { id: 3, name: 'Courtenay', day: 3 },
  { id: 4, name: 'David', day: 1 },
  {
    id: 5,
    name: '555',
    day: 2
  }
])

const list2 = ref([
  {
    id: 6,
    name: '666',
    day: 1
  },
  {
    id: 7,
    name: '7777',
    day: 2
  },
  {
    id: 8,
    name: '8888',
    day: 3
  }
])

const filterArray = (day) => {
  console.log('🚀 ~ filterArray ~ day:', day)
  let res = list.value.filter((item) => item.day === day.id)
  console.log('🚀 ~ filterArray ~ res:', res)

  return res
}
const logData = () => {
  console.log('list', list.value)
  console.log('list2', list2.value)
}

const addTo = (evt) => {
  console.log(evt)
}
</script>

<style lang="less" scoped>
.item {
  padding: 10px;
  border: 1px solid red;
}

.list {
  border: 10px solid blue;
}

.item + .item {
  margin-top: 10px;
}

.list + .list {
  margin-top: 100px;
}
</style>
