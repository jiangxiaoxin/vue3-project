<template>
    <div style="overflow: hidden;position: relative;" ref="tableContainerRef">

        <div class="table-fixed-left-header" :style="{ width: (fixedLeftIndex.length * tableColumnWidth) + 'px' }" style="z-index: 1;">
        </div>
        <div class="table-header">
        </div>
        <div class="table-fixed-right-header" :style="{ width: (fixedRightIndex.length * tableColumnWidth) + 'px' }" style="z-index: 1;">
        </div>
        <div class="table-content" style="height: 200px;background-color: antiquewhite;"></div>


        <div class="x-scroll-bar"></div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Konva from 'konva'

const tableColumnsCount = 30 // 一共30个列
const tableColumnWidth = 100// 每列100px
const borderSize = 1

const fixedLeftIndex = [0, 1]
const fixedRightIndex = [tableColumnsCount - 2, tableColumnsCount - 1]

// const fixedLeftIndex = []
// const fixedRightIndex = []


const tableHeader = ref<any[]>(new Array(tableColumnsCount).fill(0).map((_, index) => {
    return `header-${index}`
}))


const tableRowHeight = 40



const tableContainerRef = ref<HTMLDivElement>()


onMounted(() => {
    initHeader()
    // console.log(tableHeader.value);

    initFixedLeftHeader()
    initFixedRightHeader()

    initXScrollBar()

    

})


let headerLayer: any
let headerFixedLeftLayer: any
let headerFixedRightLayer: any
function initHeader() {

    const tableWidth = tableColumnsCount * tableColumnWidth

    const stage = new Konva.Stage({
        container: ".table-header",
        width: tableWidth,
        height: tableRowHeight
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    headerLayer = layer

    for (let i = 0; i < tableColumnsCount; i++) {
        if (fixedLeftIndex.includes(i)) {
            continue
        }
        if (fixedRightIndex.includes(i)) {
            continue
        }
        const line = new Konva.Line({
            points: [i * tableColumnWidth, 0, i * tableColumnWidth, tableRowHeight],
            stroke: 'black',
            strokeWidth: borderSize,
        })
        layer.add(line)
        const txt = new Konva.Text({
            x: i * tableColumnWidth + (tableColumnWidth / 2),
            y: tableRowHeight / 2,
            text: `${tableHeader.value[i]}`,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'green'
        })
        layer.add(txt)
        txt.offsetX(txt.width() / 2)
        txt.offsetY(txt.height() / 2)
    }

    // 最后一个需要画的列，需要补一条线
    const lastColumnIndex = tableColumnsCount - fixedRightIndex.length
    const line = new Konva.Line({
        points: [lastColumnIndex * tableColumnWidth, 0, lastColumnIndex * tableColumnWidth, tableRowHeight],
        stroke: 'black',
        strokeWidth: borderSize,
    })

    layer.add(line)


    const left = fixedLeftIndex.length * tableColumnWidth
    const right = fixedRightIndex.length * tableColumnWidth
    const top = new Konva.Line({
        points: [left, 0, tableWidth - right, 0],
        stroke: 'black',
        strokeWidth: borderSize,

    })
    const bottom = new Konva.Line({
        points: [left, tableRowHeight, tableWidth - right, tableRowHeight],
        stroke: 'black',
        strokeWidth: borderSize,

    })

    layer.add(top)
    layer.add(bottom)

}

function initFixedLeftHeader() {
    const stage = new Konva.Stage({
        container: '.table-fixed-left-header',
        width: tableColumnWidth * fixedLeftIndex.length,
        height: tableRowHeight
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    let i = 0
    for (; i < fixedLeftIndex.length; i++) {
        const line = new Konva.Line({
            points: [i * tableColumnWidth, 0, i * tableColumnWidth, tableRowHeight],
            stroke: 'black',
            strokeWidth: borderSize,
        })
        layer.add(line)
    }
    if (i > 0) {
        const line = new Konva.Line({
            points: [i * tableColumnWidth, 0, i * tableColumnWidth, tableRowHeight],
            stroke: 'black',
            strokeWidth: borderSize,
        })
        layer.add(line)
    }

}
function initFixedRightHeader() {
    const stage = new Konva.Stage({
        container: '.table-fixed-right-header',
        width: tableColumnWidth * fixedRightIndex.length,
        height: tableRowHeight
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    let i = tableColumnsCount - fixedRightIndex.length
    for (; i <= tableColumnsCount; i++) {
        const line = new Konva.Line({
            points: [i * tableColumnWidth, 0, i * tableColumnWidth, tableRowHeight],
            stroke: 'black',
            strokeWidth: borderSize,
        })
        layer.add(line)
    }
    const line = new Konva.Line({
        points: [i * tableColumnWidth, 0, i * tableColumnWidth, tableRowHeight],
        stroke: 'black',
        strokeWidth: borderSize,
    })
    layer.add(line)
}

function initXScrollBar() {

    const size = tableContainerRef.value?.getBoundingClientRect()


    const stage = new Konva.Stage({
        container: '.x-scroll-bar',
        width: size?.width || 0,
        height: 20,
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    const marker = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width() / 10,
        height: stage.height(),
        fill: '#8b8b8b',
        draggable: true,
        dragBoundFunc: function (pos) {
            return {
                x: Math.max(0, Math.min(pos.x, stage.width() - marker.width())),
                y: 0
            }
        }
    })

    const track = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: '#ebebeb',
    })

    layer.add(track)
    layer.add(marker)

    marker.on('dragmove', () => {
        let scrollLeft = marker.x()
        let percent = scrollLeft / (stage.width() - marker.width())
        console.log("🚀 ~ initXScrollBar ~ percent:", percent)

        headerLayer.x(-percent * (tableColumnWidth * tableColumnsCount - stage.width()))


    })

}


</script>

<style scoped lang="less">
* {
    box-sizing: border-box;
}

.table-header {
    position: relative;
    width: 100%;
    height: 40px; // 表头高度，表头所有的单元格都是这个高度
    background-color: #f00;
    overflow: hidden;
    border-bottom: 1px solid #000;
    border-top: 1px solid #000;

    .move-table-header {
        position: relative;
        display: flex;
        overflow: visible;


        .table-header-item {
            width: 100px;
            min-width: 100px;
            height: 40px;
            background-color: #0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: 1px solid #000;
        }

        .table-header-item:last-child {
            border-right: 1px solid #000;
        }



    }


}

.table-content {
    position: relative;
}

.table-fixed-left-header {
    position: absolute;
    left: 0;
    top: 0;
}

.table-fixed-right-header {
    position: absolute;
    right: 0;
    top: 0
}
</style>