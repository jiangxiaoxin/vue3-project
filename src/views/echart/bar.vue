<template>
  <div>
    <div id="main" style="width: 600px; height: 600px"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
const init = () => {
  const chartDom = document.getElementById('main')
  const myChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['圆柱真实数据背景', '折线']
    },
    xAxis: {
      show: true,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        show: true
      },
      axisLine: {
        show: true
      },
      axisLabel: {
        show: true,
        fontSize: 15,
        color: 'red',
        margin: 15
      }
    },
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
          color: '#8CB5E2',
          formatter: function (value) {
            return `${value} zzzz`
          }
        },
        name: 'y轴代表啥意思'
      },
      {
        type: 'value',
        name: '折线',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} °C'
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
        },
        tooltip: {
          show: false
        }
      },
      // 圆柱真实数据背景
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        label: {
          // 图形上的文本标签,可用于说明图像的一些数据信息,比如值,名称等
          show: true, //是否显示标签
          position: 'insideTop',
          // position: ['0', '-10'], // 柱顶的数字显示。这个位置没有绝对好的设置，要根据数据来设置，不然会有偏移
          color: 'green',
          fontSize: 20,
          formatter: '{b}/{c}'
        },
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
        },
        name: '圆柱真实数据背景',
        tooltip: {
          valueFormatter: function (value) {
            return '处理下' + value
          }
        }
      },
      // Y轴头部背景，底部灰色底图的头部
      {
        type: 'pictorialBar',
        symbolSize: [45, 25],
        symbolOffset: [0, -10],
        z: 12,
        symbolPosition: 'end',
        itemStyle: {
          color: 'black',
          opacity: 0.1
          // color: '#163F7A',
          // opacity: 1
        },
        data: [300, 300, 300, 300, 300, 300, 300],
        tooltip: {
          show: false // 这些作为陪衬的部分也依然是个chart上的图，依然会触发tooltip，而我们又不希望它出现
        }
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
        data: [150, 230, 224, 218, 135, 147, 260],
        tooltip: {
          show: false
        }
      },
      // Y轴背景,最底下那个通栏的背景
      {
        type: 'bar',
        barWidth: 45,
        barGap: '-100%',
        z: 0,
        itemStyle: {
          color: 'black',
          opacity: 0.1
          // color: '#163F7A',
          // opacity: 0.7
        },
        data: [300, 300, 300, 300, 300, 300, 300],
        tooltip: {
          show: false
        }
      },
      {
        name: '折线',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          show: true,
          valueFormatter: function (value) {
            return value + ' °C'
          }
        },
        data: [20, 22, 102, 45, 63, 33, 203],
        smooth: true,
        areaStyle: {
          // opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'black'
            },
            {
              offset: 1,
              color: 'white'
            }
          ])
        }
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
