<template>
  <div>
    <div id="main" style="width: 600px; height: 600px; background-color: #06164a"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
const init = () => {
  const chartDom = document.getElementById('main')
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {},
    grid: {
      top: 30,
      right: 0,
      bottom: 40
    },
    xAxis: [
      {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 15,
          color: '#FFF',
          margin: 15
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: '#8CB5E2'
        },
        splitLine: {
          show: true,
          lineStyle: {
            typs: 'dashed',
            color: '#182450'
          }
        },
        axisLabel: {
          color: '#8CB5E2'
        }
      }
    ],
    series: [
      // 圆柱底部
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'pictorialBar',
        symbolSize: [45, 25],
        symbolOffset: [0, 10],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#12B9DB'
              },
              {
                offset: 1,
                color: '#6F8EF2'
              }
            ],
            false
          )
        }
      },
      // 圆柱真实数据背景
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'bar',
        barWidth: 45,
        barGap: '-100%',
        z: 12,
        itemStyle: {
          opacity: 0.7,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#12B9DB'
            },
            {
              offset: 1,
              color: '#6F8EF2'
            }
          ])
        }
      },
      // Y轴头部背景
      {
        type: 'pictorialBar',
        symbolSize: [45, 25],
        symbolOffset: [0, -10],
        z: 12,
        symbolPosition: 'end',
        itemStyle: {
          color: '#163F7A',
          opacity: 1
        },
        data: [300, 300, 300, 300, 300, 300, 300]
      },
      // 圆柱顶面
      {
        type: 'pictorialBar',
        symbolSize: [45, 25],
        symbolOffset: [0, -10],
        z: 12,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#12B9DB'
              },
              {
                offset: 1,
                color: '#6FBEF2'
              }
            ],
            false
          )
        },
        symbolPosition: 'end',
        data: [150, 230, 224, 218, 135, 147, 260]
      },
      // Y轴背景
      {
        type: 'bar',
        barWidth: 45,
        barGap: '-100%',
        z: 0,
        itemStyle: {
          color: '#163F7A',
          opacity: 0.7
        },
        data: [300, 300, 300, 300, 300, 300, 300]
      }
    ]
  }

  option && myChart.setOption(option)
}

onMounted(() => {
  init()
})
</script>

<style scoped></style>
