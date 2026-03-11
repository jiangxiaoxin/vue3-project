<template>
  <div>
    <div>
      <button @click="logData">data</button>
    </div>

    <!-- <div class="list" v-for="day in WeeklyArray" :key="day.id">
      <h1 style="border: 1px solid red; color: red">
        {{ day.name }}
        <button @click="showData(list)">show data</button>
      </h1>
      <draggable :list="list" item-key="id" group="a" @add="addTo">
        <template #item="{ element }">
          <div class="item">
            <div>{{ element }}</div>
          </div>
        </template>
      </draggable>
    </div> -->

    <h1 style="border: 1px solid red; color: red">
        group a
        <button @click="showData(list)">show data</button>
      </h1>
      <!-- group name 组的名称 put，可以从别的group往当前这个group里拖 pull 可以从当前组往外拖 clone 往外拖的时候，复制一份数据，自己还是子对象还是原来的数量 -->
      <draggable :list="list" item-key="id" :group="{name: 'a', put: 'b', pull: 'clone'}" @add="addTo" :sort="false">
        <template #item="{ element }">
          <div class="item">
            <div>{{ element }}</div>
          </div>
        </template>
      </draggable>
    <div class="list">
      <button @click="showData(list2)">showdata</button>
      <draggable v-model="list2" item-key="id" :group="{name: 'b', put: 'a', pull: false}">
        
        <template #item="{ element }">
          
          <div class="item">
            <div>{{ element }}</div>
            <button @click="showData(element)">show data</button>
          </div>
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
  // {
  //   id: 3,
  //   name: '星期三'
  // }
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

const showData = (element)  => {
  console.table(element);
  
}

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
  margin-top: 20px;
  border-top: 10px solid red;
}
</style>
