<template>
    <div class="container" id="cc" >


    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import Konva from 'konva';


onMounted(() => {
    init()
})

function init() {
    let stage = new Konva.Stage({
        container: '#cc', // 用id 或者 class 的方式都可以，就是普通的 css selector 方式
        width: 1000,
        height: 500
    })

    let layer = new Konva.Layer()
    stage.add(layer)

    // 添加标题文本（简单文本，不使用 Label）
    let titleText = new Konva.Text({
        x: 20,
        y: 20,
        text: 'Konva Label 示例 - 我是代码添加的text',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: 'black',
        fontStyle: 'bold'
    })
    layer.add(titleText)

    let positions = [
        [0, 0],
        [stage.width(), 0],
        [stage.width(), stage.height()],
        [0, stage.height()],
        [stage.width() / 2, stage.height() / 2]
    ]

    positions.forEach((position, index) => {
        let circle = new Konva.Circle({
            x: position[0],
            y: position[1],
            radius: 10,
            fill: 'blue',
        })

        layer.add(circle)
    })

    stage.on("mousedown", (e) => {
        console.log("🚀 ~ init ~ e:", e)
        let position = stage.getPointerPosition() // 获取鼠标在 stage 上的位置
        console.log("🚀 ~ init ~ position:", position)
        let circle = new Konva.Circle({
            x: position.x,
            y: position.y,
            radius: 1,
            fill: 'red',
        })
        layer.add(circle)

        // 创建 Label 和 Text
        let label = new Konva.Label({
            x: position.x,
            y: position.y + 1,
            opacity: 0.9
        })

        // 创建 Tag
        let tag = new Konva.Tag({
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 1,
            cornerRadius: 5,
            pointerDirection: 'up',
            pointerWidth: 10,
            pointerHeight: 10
        })

        // 创建 Text
        let text = new Konva.Text({
            text: `(${Math.round(position.x)}, ${Math.round(position.y)})`,
            fontFamily: 'Arial',
            fontSize: 14,
            padding: 8,
            fill: 'black'
        })

        // 添加到 label
        label.add(tag)
        label.add(text)
        layer.add(label)

        // // 获取 Tag 尺寸的几种方法
        // setTimeout(() => {
        //     // 方法1: 使用 getClientRect() - 推荐
        //     const tagRect = tag.getClientRect()
        //     console.log('Tag ClientRect:', {
        //         x: tagRect.x,
        //         y: tagRect.y,
        //         width: tagRect.width,
        //         height: tagRect.height
        //     })

        //     // 方法2: 使用 width() 和 height() 方法
        //     console.log('Tag width():', tag.width())
        //     console.log('Tag height():', tag.height())

        //     // 方法3: 使用 size() 方法
        //     const tagSize = tag.size()
        //     console.log('Tag size():', tagSize)

        //     // 方法4: 获取 Label 的整体尺寸
        //     const labelRect = label.getClientRect()
        //     console.log('Label ClientRect:', labelRect)

        //     // 方法5: 获取文本尺寸（用于计算 Tag 应该的大小）
        //     const textRect = text.getClientRect()
        //     console.log('Text ClientRect:', textRect)
        // }, 100) // 延迟一下确保渲染完成


    })

}

</script>
<style lang="less" scoped>
.container {
    width: 1000px;
    height: 500px;
    margin: 100px auto;
    background-color: beige;
}
</style>