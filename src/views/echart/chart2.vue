<template>
  <div id="chart" style="width: 600px; height: 400px"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import prepareBoxplotData from './1'
onMounted(() => {
  var originData = [
    {
      name: '2020-01-12',
      data: [
        850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000,
        1000, 960, 960
      ]
    },
    {
      name: '2020-01-13',
      data: [
        960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790,
        760, 800
      ]
    },
    {
      name: '2020-01-14',
      data: [
        880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840,
        840, 840
      ]
    },
    {
      name: '2020-01-15',
      data: [
        890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850,
        850, 780
      ]
    },
    {
      name: '2020-01-16',
      data: [
        890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800,
        810, 870
      ]
    }
  ]

  let xlabel = []
  let value: any[] = []
  originData.forEach((item) => {
    xlabel.push(item.name)
    value.push(item.data)
  })

  var data = prepareBoxplotData(value, {
    layout: 'vertical'
  })

  console.log('生产的data', data)

  const chart = echarts.init(document.getElementById('chart'))

  let option = {
    // title: [
    //   {
    //     text: 'Michelson-Morley Experiment',
    //     left: 'center'
    //   },
    //   {
    //     text: 'upper: Q3 + 1.5 * IRQ \nlower: Q1 - 1.5 * IRQ',
    //     borderColor: '#999',
    //     borderWidth: 1,
    //     textStyle: {
    //       fontSize: 14
    //     },
    //     left: '10%',
    //     top: '90%'
    //   }
    // ],
    // legend: {
    //   data: ['line', 'line2', 'line3']
    // },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    // grid: {
    //   left: '10%',
    //   right: '10%',
    //   bottom: '15%'
    // },
    xAxis: {
      type: 'category',
      //   data: data.axisData,
      data: xlabel,
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false
      },
      //   axisLabel: {
      //     formatter: 'expr {value}'
      //   },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      //   name: 'km/s minus 299,000',
      splitArea: {
        show: true
      }
    },
    series: [
      {
        name: '质量监控的标题',
        type: 'boxplot',
        data: data.boxData
        // tooltip: {
        //   formatter: function (param) {
        //     return [
        //       '' + param.name + ': ',
        //       'upper: ' + param.data[4],
        //       'Q3: ' + param.data[3],
        //       'median: ' + param.data[2],
        //       'Q1: ' + param.data[1],
        //       'lower: ' + param.data[0]
        //     ].join('<br/>')
        //   }
        // }
      },
      {
        name: 'outlier',
        type: 'scatter',
        data: data.outliers
      }
    ]
  }

  chart.setOption(option)
})
</script>
