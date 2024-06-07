<template>
  <div class="chart-container" id="myChart"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'

onMounted(() => {
  init()
})

const init = () => {
  let myChart = echarts.init(document.getElementById('myChart'))
  myChart.setOption({
    // title: {
    //   text: 'ECharts 入门示例'
    // },
    title: [
      { text: '标题1', left: 0 },
      { text: '标题2', left: 30 },
      { text: '标题3', left: 80 }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'red'
        }
      }
    },
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      type: 'category'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
        name: '售价',
        type: 'line',
        data: [100, 80, 60, 170, 70, 190]
      }
    ]
  })
}
</script>

<style lang="less" scoped>
.chart-container {
  width: 400px;
  height: 400px;
  background-color: lightblue;
}
</style>
