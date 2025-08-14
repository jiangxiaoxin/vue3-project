<template>
  <div id="container" style="width: 100%; height: 400px; background-color: bisque"></div>

  <div style="width: 100%; height: 400px; background-color: aquamarine">
    <canvas
      id="cc"
      width="400"
      height="400"
      style="display: block; background-color: burlywood"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { onMounted } from 'vue'
import { c } from '@/utils/log'
import { getRandomColor } from './utils'

onMounted(() => {
  init()

  draw()
})

const init = () => {
  const container = document.getElementById('container')! as HTMLDivElement

  c.primary('container width: ', container.clientWidth, 'height: ', container.clientHeight)

  const stage = new Konva.Stage({
    container: container,
    width: container.clientWidth,
    height: container.clientHeight
  })

  const layer = new Konva.Layer()
  stage.add(layer)

  /**
   * 按照 x y width  height 去fill 一个red 图，那就是按照预想的 在那个位置开始画那个宽高的red rect
   * 但是添加stroke以后，stroke 会分为两份尺寸，一份向rect外部延伸，一份向rect内部延伸
   *
   * 这也跟canvas 本身的fill 和stroke 保持一致
   */

  //   const rect1 = new Konva.Rect({
  //     x: 100,
  //     y: 100,
  //     width: 100,
  //     height: 100,
  //     fill: 'red',
  //     stroke: 'rgba(0,0,0,0.1)',
  //     strokeWidth: 50
  //   })

  //   layer.add(rect1)

  let startX = 100
  let startY = 100
  for (let i = 0; i < 1; i++) {
    const rect = new Konva.Rect({
      x: startX,
      y: startY,
      width: 100,
      height: 100,
      fill: getRandomColor(),
      stroke: getRandomColor(),
      strokeWidth: 50,
      dash: [0, 0]
    })
    layer.add(rect)
    startX += 100
  }
}

const move = {
  x: 0,
  y: 0
}

function Star(x, y) {
  this.x = x
  this.y = y

  this.draw = function () {
    const ls = {
      x: this.x,
      y: this.y
    }
    this.x = move.x 
    this.y = move.y 
    const c = context
    c.beginPath()
    c.lineWidth = 4
    c.strokeStyle = 'red'
    c.moveTo(ls.x, ls.y)
    // 计算90%位置的点
    const endX = ls.x + (this.x - ls.x) * 0.9999
    const endY = ls.y + (this.y - ls.y) * 0.9999
    c.lineTo(endX, endY)
    c.stroke()
    c.closePath()
  }
}

let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D
let star: Star
const draw = () => {
  canvas = document.getElementById('cc') as HTMLCanvasElement
  context = canvas.getContext('2d')!

  move.x = canvas.width >> 1
  move.y = canvas.height >> 1

  // canvas.addEventListener('mousemove', (e) => {
  //   // console.log("🚀 ~ demo7.vue:87 ~ draw ~ e:", e)
  //   move.x = e.offsetX
  //   move.y = e.offsetY
  // })

   canvas.onmousemove = function (e) {
        move.x = e.offsetX;
        move.y = e.offsetY;
      };

  star = new Star(move.x, move.y)

  drawStar()
}

// 动画的核心原理，利用视觉
// 画一个拖尾的流星效果
const drawStar = () => {
  requestAnimationFrame(drawStar)
  if (!canvas || !context) {
    return
  }
  context.fillStyle = 'rgba(0,0,0,0.05)' // 拖尾的关键是在这。如果是白色，会很快就看不到，就视觉上没有 这种效果了
  // context.fillStyle = 'blue'
  context.fillRect(0, 0, canvas.width, canvas.height) // fillRect 也很重要

  star.draw()
}
</script>
