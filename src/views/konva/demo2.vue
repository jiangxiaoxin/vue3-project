<template>
    <div class="editor" style="background-color: cadetblue;" @contextmenu.capture.stop.prevent="openContextMenu"
        @click.capture.stop.prevent="clickOut">、
        <!-- <div style="width: 200px;height: 200px;background-color: red;" @click="() => console.log('222')" @contextmenu.prevent=""></div> -->
        <div class="container" id="cc" style="width: 1000px;height: 500px;background-color: bisque;margin: auto;">
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import Konva from 'konva'
import { getRandomColor } from './utils'

onMounted(() => {
    nextTick(() => {
        init()
    })
})

function openContextMenu(e) {
    // alert(1)
    // console.log('右键', e);

}

function clickOut(e) {
    // console.log('点击', e);

}

function init() {
    const cc = document.getElementById('cc') as HTMLDivElement
    const rect = cc.getBoundingClientRect()
    // console.log("🚀 ~ init ~ rect:", rect)

    const stage = new Konva.Stage({
        container: 'cc',
        width: 1000, //rect.width,
        height: 500, //rect.height
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    // console.log(layer.width(), layer.height(), "0000000000");
    

    const centerx = stage.width() / 2
    const centery = stage.height() / 2



    /**
     * konva click 事件是不区分左键还是右键的，都能触发
     * 但事件上的native event 的button 表明了是左键，右键，还是中键
     * 0 左键
     * 1 中键
     * 2 右键
     */
    stage.on("pointerclick", (e) => {
        const nativeEvent = e.evt
        // console.log("🚀 ~ init ~ nativeEvent:", nativeEvent)
        if(nativeEvent.button !== 0) return

        const points = stage.getPointerPosition()

        const line = new Konva.Line({
            points: [centerx, centery, points.x, points.y],
            stroke: getRandomColor(),
            strokeWidth: 1,
        })

        layer.add(line)
    })
}

</script>