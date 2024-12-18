<template>
  <div id="chart" style="width: 600px; height: 600px"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { format } from 'echarts/types/src/util/time.js'
onMounted(() => {
  initChart()
})

function initChart() {
  const chart = echarts.init(document.getElementById('chart'))
  let option = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'item'

      //   formatter: function (params) {
      //     return 'hhhh'
      //   }

      //   trigger: 'axis',
      //   formatter: function (params) {
      //     console.log(params)
      //     let empty = params.every((item) => {
      //       return item.data === undefined || item.data === null
      //     })
      //     if (empty) {
      //       return ''
      //     }

      //     var result = ''
      //     result += '<div>' + params[0].axisValue + '月' + '</div>'

      //     for (let i = 0; i < params.length; i++) {
      //       //   params[i].color
      //       if (params[i].data) {
      //         result +=
      //           "<div style='margin-top:3px'>" +
      //           "清酒溶氧测试结果: <span style='display:inline-block;margin-left:5px;'>" +
      //           params[i].data +
      //           '</div>'
      //       }
      //     }
      //     return result
      //   }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        // name: 'Email',
        type: 'line',
        data: [120, undefined, undefined, undefined, undefined, undefined, undefined],
        lineStyle: {
          color: 'red',
          width: 1,
          type: 'dashed',
          opacity: 0
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#3883fa'
        }
      },
      {
        // name: 'Union Ads',
        type: 'line',
        data: [undefined, 220, 182, undefined, undefined, undefined, undefined],
        lineStyle: {
          color: 'red',
          width: 1,
          type: 'dashed',
          opacity: 0
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#3883fa'
        }
      },
      {
        // name: 'Video Ads',
        type: 'line',
        data: [150, undefined, 201, undefined, undefined, undefined, undefined],
        lineStyle: {
          color: 'red',
          width: 1,
          type: 'dashed',
          opacity: 0
        },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#3883fa'
        }
      }
    ]
  }
  chart.setOption(option)
}
</script>
