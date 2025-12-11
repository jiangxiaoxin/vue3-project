<template>
  <div class="about" v-container>
    <div>
      parent
      <div>child</div>
    </div>

    <div style="height: 300px; background: lightgreen">
      <el-table :data="tableData">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="taskRole" label="安环主管" />
        <el-table-column prop="productionLineCode" label="车间名称" />
        <el-table-column prop="mainId" label="mainId" />
      </el-table>
    </div>

    <scrollView />
    <h1>This is an about page</h1>
    <el-button @click="clickBtn" v-first>123</el-button>
    <p>global msg: {{ globalMsg }}</p>
    <p>自己的 bar: {{ bar }}</p>
    <button @click="changeBar">修改bar</button>
    <ProvideInject v-container />
    <div style="height: 500px; background: red; color: white">123</div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from 'vue'
import ProvideInject from './provideinject.vue'
import scrollView from './scrollView.vue'
import axios from 'axios'
const globalMsg = inject('globalMsg')

const tableData = ref([])
onMounted(() => {
  axios
    .get('http://61.184.73.91:7091/api/production/prTaskInfo/list?pageNum=1&pageSize=30', {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    })
    .then((res) => {
      console.log(res)
      if (res.data && res.data.code === 200) {
        tableData.value = res.data.rows || []
      }
    })
})

provide('pfoo', 'pfoo')

const bar = ref(Math.random())
provide('pbar', bar)

const clickBtn = () => {
  alert('123')
}

const changeBar = () => {
  bar.value = Math.random()
}

const vFirst = (el: HTMLElement) => {
  el.addEventListener(
    'click',
    (e) => {
      console.log('directive')

      e.stopImmediatePropagation()
    },
    true
  )
}
</script>
