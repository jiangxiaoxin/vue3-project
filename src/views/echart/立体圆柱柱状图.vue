<template>
    <div id="main" style="width: 100vw;height: 100vh;">

    </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'
var xData2 = ["容城谷庄", "雄县七间房", "安新三台", "雄县张岗", "安新寨里"];


var xxx = ['0011', '112', '123123']
var colors = []

var data1 = [200, 100, 200, 200, 100];
var data2 = [400, 400, 400, 400, 400];
const option = {
    // backgroundColor: '#021132',
    backgroundColor: 'rgb(7, 66, 26)',
    tooltip: {
        trigger: 'item',
    },
    grid: {
        left: 100,
        bottom: 100
    },
    xAxis: {
        data: xData2,
        axisTick: {
            show: true,
            length: 30,
            alignWithLabel: true,
            lineStyle: {
                color: 'green'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'green'
            }
        },
        axisLabel: {
            interval: 0,
            textStyle: {
                color: '#fff',
                fontSize: 20,
            },
            margin: 20, //刻度标签与轴线之间的距离。
        },

    },
    yAxis: {
        splitLine: {
            show: true,
            lineStyle: {
                color: 'green',
                opacity: 0.4,
            },
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: 'green',
                // type: 'dotted'
                width: 5,
            },
            length: 30,
            
            inside: true
        },
        axisLine: {
            show: true
        },
        axisLabel: {
            textStyle: {
                color: '#fff',
                fontSize: 20,
            },
        }
    },
    series: [
        {//柱子最下面的小圆片，作为柱底
            "name": "",
            "type": "pictorialBar",
            "symbolSize": [45, 10], // 45 是跟下面的柱子的宽度匹配起来的，看起来才是一个柱子
            "symbolOffset": [0, 5],
            "z": 12,
            tooltip: {
                show: false
            },
            itemStyle: {
                opacity: 1,
                color: function (params) {
                    var a = params.name.slice(0, 2);
                    if (a === '容城') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9A22' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FFD56E'// 100% 处的颜色
                        }], false)
                    } else if (a === '雄县' || a === '雄州') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00EC28' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#5DF076'// 100% 处的颜色
                        }], false)
                    } else if (a === '安新') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#12B9DB' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#6F8EF2'// 100% 处的颜色
                        }], false)
                    }
                }
            },
            "data": [1, 1, 1, 1, 1] // 加一点数值，让他们能显示出来。同时设置tooltip不生效，免得露馅
        },


        //下半截柱状图
        {
            name: '2020',
            type: 'bar',
            barWidth: 45,
            barGap: '-100%',
            itemStyle: {//lenged文本
                opacity: .7,
                color: function (params) {
                    var a = params.name.slice(0, 2);
                    if (a === '容城') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9A22' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FFD56E'// 100% 处的颜色
                        }], false)
                    } else if (a === '雄县' || a === '雄州') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00EC28' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#5DF076'// 100% 处的颜色
                        }], false)
                    } else if (a === '安新') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#12B9DB' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#6F8EF2'// 100% 处的颜色
                        }], false)
                    }
                }
            },

            data: data1
        },

        { // 替代柱状图 默认不显示颜色，是最下方柱图（邮件营销）的value值 - 20
            type: 'bar',
            barWidth: 45,
            barGap: '-100%',
            stack: '广告',
            itemStyle: {
                color: 'transparent'
            },
            data: data1
        },

        {
            // 背景最长柱子顶部也加个椭圆
            "name": "", //头部
            "type": "pictorialBar",
            "symbolSize": [45, 25],
            "symbolOffset": [0, -10],
            "z": 12,
            "symbolPosition": "end",
            tooltip: {
                show: false
            },
            // itemStyle:{
            //     color:'#163F7A',
            //     opacity:1,
            // },
            itemStyle: {
                opacity: 1,
                color: function (params) {
                    var a = params.name.slice(0, 2);
                    if (a === '容城') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9A22' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FFD56E'// 100% 处的颜色
                        }], false)
                    } else if (a === '雄县' || a === '雄州') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00EC28' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#5DF076'// 100% 处的颜色
                        }], false)
                    } else if (a === '安新') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#12B9DB' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#6F8EF2'// 100% 处的颜色
                        }], false)
                    }
                }
            },
            "data": data2
        },

        {
            // 实际有效的柱子的顶部
            "name": "",
            "type": "pictorialBar",
            "symbolSize": [45, 25],
            "symbolOffset": [0, -10],
            "z": 12,
            itemStyle: {
                opacity: 1,
                color: function (params) {
                    var a = params.name.slice(0, 2);
                    if (a === '容城') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FF9A22' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#FFD56E'// 100% 处的颜色
                        }], false)
                    } else if (a === '雄县' || a === '雄州') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00EC28' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#5DF076'// 100% 处的颜色
                        }], false)
                    } else if (a === '安新') {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#12B9DB' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#6F8EF2'// 100% 处的颜色
                        }], false)
                    }
                }
            },
            "symbolPosition": "end",
            "data": data1,
            // label: {
            //     normal: {
            //         show: true,
            //         lineHeight: 30,
            //         width: 80,
            //         height: 30,
            //         backgroundColor: 'rgba(0,160,221,0.1)',
            //         borderRadius: 200,
            //         position: [0, -100],
            //         distance: 1,
            //         formatter: [
            //             '    {d|●●●●}',
            //             ' {a|{c}}     \n',
            //             '    {b|}'
            //         ].join(' '),
            //         rich: {
            //             d: {
            //                 color: '#3CDDCF',
            //             },
            //             a: {
            //                 color: '#fff',
            //                 align: 'center',
            //             },
            //             b: {
            //                 width: 1,
            //                 height: 30,
            //                 borderWidth: 1,
            //                 borderColor: 'red',
            //                 align: 'left'
            //             },
            //         }
            //     }
            // }
        },

        {
            // 最长的柱状图背景条的颜色
            name: '',
            type: 'bar',
            barWidth: 45,
            barGap: '-100%',
            z: 0,
            itemStyle: {
                // color: '#163F7A', 
                color: 'rgb(17, 90, 30)',
                opacity: .7,
            },

            data: data2,
            tooltip: {
                show: false
            },
        }


    ]
};

onMounted(() => {
    const myChart = echarts.init(document.getElementById('main') as HTMLElement)
    myChart.setOption(option)
})

</script>