<template>
    <p>
        外层容器是屏幕宽，内部元素是3000宽，超出屏幕，x轴 自动出现滚动条
        <br />
        滚动条是浏览器原生的，滚动时是把内部 contianer移动了，从而移动并显示出 canvas 上的内容
        <br />
        这样子，在canvas 上将所有的数据全部绘制，然后利用浏览器原生进行滚动，实现简单，但canvas 上要回执所有的节点，数量大了以后，性能跟不上
    </p>
    <div style="overflow: auto;position: relative;height: 500px;">
        <!-- 固定表头 -->
        <div id="fixed-header" style="position: sticky;top: 0;left: 0;z-index: 10;background-color: white;">
        </div>
        <!-- 主表格容器 -->
        <div class="container" id="cc" style="width: fit-content;height: fit-content;">
        </div>
    </div>
    <!-- <div style="width: 100%;overflow: auto;background-color: yellow;">
        <div style="width: 3000px;height: 100px;background-color: green;">123</div>
    </div> -->
</template>
<script setup lang="ts">

import { onMounted, nextTick, ref } from 'vue';
import Konva from 'konva'

// 表格配置
const COLS = 30
const ROWS = 500 // 我这台电脑，500以内都还可以
const CELL_WIDTH = 100
const CELL_HEIGHT = 50
const PADDING = 10

const c_width = COLS * CELL_WIDTH
const c_height = ROWS * CELL_HEIGHT

let fixedHeaderStage: Konva.Stage | null = null

onMounted(() => {
    nextTick(() => {
        initFixedHeader()
        init()

    })
})

// // 滚动事件处理
// function handleScroll(e: Event) {
//     // const target = e.target as HTMLElement
//     // const scrollLeft = target.scrollLeft

//     // if (fixedHeaderStage) {
//     //     // 同步固定表头的水平滚动
//     //     const container = document.getElementById('fixed-header')
//     //     if (container) {
//     //         container.scrollLeft = scrollLeft
//     //     }
//     // }
// }

function init() {
    const stage = new Konva.Stage({
        container: 'cc',
        width: c_width,
        height: c_height
    })

    const gridLayer = new Konva.Layer()
    stage.add(gridLayer)

    const textLayer = new Konva.Layer()
    stage.add(textLayer)

    // 绘制网格线
    drawGrid(gridLayer)

    // 绘制表格数据
    drawTableData(textLayer)
}

// 初始化固定表头
function initFixedHeader() {
    const container = document.getElementById('fixed-header')
    if (!container) return

    // 设置固定表头容器样式
    // 这些属性可以用vue 的动态style绑，也可以用代码绑
    container.style.width = c_width + 'px'
    container.style.height = "fit-content"

    // 创建固定表头的Stage
    fixedHeaderStage = new Konva.Stage({
        container: 'fixed-header',
        width: c_width,
        height: CELL_HEIGHT
    })

    const headerGridLayer = new Konva.Layer()
    const headerTextLayer = new Konva.Layer()


    // 现在的实现方式，并没有区分网格线占用的空间，这将导致划线和划字会相互叠加，字的宽度和高度，把线挡住了。所以先加text，再加grid，能显示出线来
    fixedHeaderStage.add(headerTextLayer)
    fixedHeaderStage.add(headerGridLayer) 


    // 绘制固定表头的网格线
    drawFixedHeaderGrid(headerGridLayer)

    // 绘制固定表头的文本
    drawFixedHeaderText(headerTextLayer)
}

// 绘制固定表头的网格线
function drawFixedHeaderGrid(layer: Konva.Layer) {
    // 绘制垂直线
    for (let col = 0; col <= COLS; col++) {
        const x = col * CELL_WIDTH
        const line = new Konva.Line({
            points: [x, 0, x, CELL_HEIGHT],
            stroke: 'purple',
            strokeWidth: 1
        })
        layer.add(line)
    }

    // 绘制水平线（顶部和底部）
    const topLine = new Konva.Line({
        points: [0, 0, c_width, 0],
        stroke: 'purple',
        strokeWidth: 1
    })

    const bottomLine = new Konva.Line({
        points: [0, CELL_HEIGHT, c_width, CELL_HEIGHT],
        stroke: 'purple',
        strokeWidth: 1
    })

    layer.add(topLine)
    layer.add(bottomLine)
}

// 绘制固定表头的文本
function drawFixedHeaderText(layer: Konva.Layer) {
    const headers = ['ID', '姓名', '部门', '职位', '城市', '年龄', '薪资', ...Array.from({ length: 23 }, (_, i) => `列${i + 8}`)]

    // 添加背景
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: c_width,
        height: CELL_HEIGHT,
        fill: '#f8f9fa'
    })
    layer.add(background)

    for (let col = 0; col < COLS; col++) {
        const text = new Konva.Text({
            x: col * CELL_WIDTH + PADDING,
            y: PADDING,
            text: `${headers[col]} (${col})`,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#333',
            width: CELL_WIDTH - PADDING * 2,
            height: CELL_HEIGHT - PADDING * 2,
            align: 'left',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        })
        layer.add(text)
    }
}

// 绘制网格线
function drawGrid(layer: Konva.Layer) {
    // 绘制垂直线
    for (let col = 0; col <= COLS; col++) {
        const x = col * CELL_WIDTH
        const line = new Konva.Line({
            points: [x, 0, x, c_height],
            stroke: '#ddd',
            strokeWidth: 1
        })
        layer.add(line)
    }

    // 绘制水平线
    for (let row = 0; row <= ROWS; row++) {
        const y = row * CELL_HEIGHT
        const line = new Konva.Line({
            points: [0, y, c_width, y],
            stroke: '#ddd',
            strokeWidth: 1
        })
        layer.add(line)
    }
}

// 生成模拟数据
function generateTableData() {
    const data = []
    const departments = ['销售部', '技术部', '市场部', '人事部', '财务部']
    const positions = ['经理', '主管', '专员', '助理', '实习生']
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉']

    for (let row = 0; row < ROWS; row++) {
        const rowData = []
        for (let col = 0; col < COLS; col++) {
            let cellData = ''

            if (col === 0) {
                cellData = `ID${row + 1}`
            } else if (col === 1) {
                cellData = `员工${row + 1}`
            } else if (col === 2) {
                cellData = departments[Math.floor(Math.random() * departments.length)]
            } else if (col === 3) {
                cellData = positions[Math.floor(Math.random() * positions.length)]
            } else if (col === 4) {
                cellData = cities[Math.floor(Math.random() * cities.length)]
            } else if (col === 5) {
                cellData = `${18 + Math.floor(Math.random() * 40)}`
            } else if (col === 6) {
                cellData = `${5000 + Math.floor(Math.random() * 15000)}`
            } else {
                cellData = `数据${row}-${col}`
            }

            rowData.push(cellData)
        }
        data.push(rowData)
    }
    return data
}

// 绘制表格数据
function drawTableData(layer: Konva.Layer) {
    const tableData = generateTableData()

    // 绘制数据行（从第二行开始，第一行被固定表头覆盖）
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const text = new Konva.Text({
                x: col * CELL_WIDTH + PADDING,
                y: (row) * CELL_HEIGHT + PADDING,
                text: `${tableData[row][col]}-[${row},${col}]`,
                fontSize: 12,
                fontFamily: 'Arial',
                fill: '#666',
                width: CELL_WIDTH - PADDING * 2,
                height: CELL_HEIGHT - PADDING * 2,
                align: 'left',
                verticalAlign: 'middle',
                ellipsis: true // 文本过长时显示省略号
            })
            layer.add(text)
        }
    }

}
</script>