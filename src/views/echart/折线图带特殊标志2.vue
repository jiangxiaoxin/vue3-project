<template>
  <div style="height: 400px;background-color: rgb(6, 21, 78);" ref="containerRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const containerRef = ref()
const option = {
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: ['1', '2', '3', '4', '5', '6', '7','8','9','10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: 'yellowgreen',
        width: 20
      },
    },
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260,150, 230, 224, 218, 135, 147, 260,150, 230, 224, 218, 135, 147, 260,150, 230, 224, 218, 135, 147, 260,150, 230, 224,],
      type: 'line'
    },
    {
      data: [300, 300, 300, 300, 300, 300, 300,300, 300, 300, 300, 300, 300, 300,300, 300, 300, 300, 300, 300, 300,300, 300, 300, 300, 300, 300, 300,300, 300, 300],
      type: 'bar',
      itemStyle: {
        color: 'yellowgreen',
        opacity: 0.3
      }
    //   showBackground: true,
    //   backgroundStyle: {
    //     color: 'rgba(180, 180, 180, 0.2)'
    //   }
    }
  ]
};

onMounted(() => {
  const container = containerRef.value
  const chart = echarts.init(container)
  chart.setOption(option)
})
</script>
