<template>
  <div style="height: 400px;background-color: rgb(6, 21, 78);" ref="containerRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const containerRef = ref()
const option = {
  //   title: { // 图的左上角标题
  //     text: 'Stacked Line'
  //   },
  tooltip: {
    trigger: 'axis'
  },
  //   legend: {
  //     data: ['Email', /*'Union Ads', 'Video Ads' 'Direct', 'Search Engine'*/]
  //   },
  grid: {
    left: '3%',
    right: '4%',
    bottom: 20,
    top: 50,
    containLabel: true
  },
  //   toolbox: { // 右上角的工具条
  //     feature: {
  //       saveAsImage: {}
  //     }
  //   },
  xAxis: {
    type: 'category',
    boundaryGap: true, //TODO ???
    data: [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
      '十六'
    ],
    axisLine: {
      show: true,
      lineStyle: {
        color: 'red',
        shadowColor: 'blue',
        // shadowOffsetX: 10,
        shadowOffsetY: 5, // x轴横向加模糊
        shadowBlur: 10
      }
    },
    axisLabel: {
      show: true,
      // showMinLabel: true,
      // showMaxLabel: true,
      color: 'green',
      backgroundColor: 'black',
    //   padding: 10
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: 'yellowgreen',
        width: 20
      },
    // //   length: 360, // 400-20-20 这样就要动态计算chart 外层容器的高度，然后设置length
    //   length: 340, // 又减了20，是因为grid 里把label 算进去了，所以再建一个尺寸
    //   inside: true,
    },
    // splitLine: {
    //     show: true,
    // }
    // splitArea: {
    //     show: true,
    //     interval: 1,
    //     areaStyle: {
    //         color: ['blue','transparent',],
    //         // opacity: 0.1,
    //     }
    // },
  },
  yAxis: {
    type: 'value',
    max: 'dataMax',
    axisLine: {
      show: true,
      lineStyle: {
        color: 'black'
      }
    },
    axisLabel: {
      show: true,
      color: 'green'
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'red',
        width: 5
      }
    }
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132],
      //   symbol: 'triangle',
    //   symbol:
    //     'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
    symbol: 'path://M9.38,13.28L14.89,3.2c0.56-1.03-0.18-2.29-1.36-2.29H2.51c-1.18,0-1.92,1.26-1.36,2.29l5.51,10.08    C7.25,14.36,8.79,14.36,9.38,13.28z',
      symbolSize: 20,
      //   symbolRotate: 180,
      showSymbol: true,
      showAllSymbol: true,
      lineStyle: {
        color: 'red',
        width: 4,
        type: 'solid'
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: 'green', // 这个可以控制svg样式的颜色
        color: 'yellow'
      },
      label: {
        show: true,
        position: 'top',
        color: 'red',
        fontWeight: 'bold'
      },
    //   areaStyle: { // 这个是折线下面区域填色
    //     color: 'blue'
    //   }
    //   markArea: { // 这个是折线上一部分区域填色
    //     silent: true, // 不响应鼠标事件
    //     itemStyle: {
    //       color: 'red'
    //     },
    //     data: [
    //       [
    //         {
    //           xAxis: '一', // 起始位置
    //         },
    //         {
    //           xAxis: '二', // 结束位置
    //         }
    //       ]
    //     ]
    //   }
    },
    {
      data: [230, 230, 230, 230, 230, 230, 230,230, 230, 230, 230, 230, 230, 230,230, 230],
      type: 'bar',
      itemStyle: {
        color: 'yellowgreen',
        opacity: 0.3
      },
      barWidth: 20,
      silent: true,
      tooltip: {
        show: false
      }
    }
    // {
    //   name: 'Union Ads',
    //   type: 'line',
    //   data: [220, 182, 191, 234, 290, 330, 310]
    // },
    // {
    //   name: 'Video Ads',
    //   type: 'line',
    //   data: [150, 232, 201, 154, 190, 330, 410]
    // }
    // {
    //   name: 'Direct',
    //   type: 'line',
    //   data: [320, 332, 301, 334, 390, 330, 320]
    // },
    // {
    //   name: 'Search Engine',
    //   type: 'line',
    //   data: [820, 932, 901, 934, 1290, 1330, 1320]
    // }
  ]
}

onMounted(() => {
  const container = containerRef.value
  const chart = echarts.init(container)
  chart.setOption(option)
})
</script>
