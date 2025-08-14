<template>
    <div style="width: 200px;height: 200px;background-color: blue;"></div>
  <canvas style="width: 200px;height: 200px;background-color: red;" ref="canvasRef1"/>
  <canvas style="width: 200px;height: 200px;background-color: red;" ref="canvasRef2"/>
  <canvas style="width: 200px;height: 200px;background-color: red;" ref="canvasRef3"/>
  <canvas style="background-color: red;" width="200" height="200" ref="canvasRef4"/>

  <!-- 这个canvas 只通过style 设置了宽高，但是它的绘制空间依然是300*150 -->
  <!-- <canvas style="width: 200px;height: 200px;background-color: red;"/> -->
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
const canvasRef1 = ref()
const canvasRef2 = ref()
const canvasRef3 = ref()
const canvasRef4 = ref()


// 把浏览器放大到dpr=2
// 虽然css里设置200*200，但量一下，浏览器里已经是400*400
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

onMounted(() => {
  const can1 = canvasRef1.value!
  const can2 = canvasRef2.value!
  const can3 = canvasRef3.value!
  const can4 = canvasRef4.value!

  can1.width = 200 // 如果不设置，那会采用canvas默认的 300*150  也可以在html上直接设置width和height
  can1.height = 200

  // 对can1来说，他认为自己是在200*200的空间上画的，画完以后，浏览器将这个200*200的空间映射到屏幕上，此时是200*200--->400*400，那原本不模糊的线，现在也模糊了

  drawLine(can1.getContext('2d')!)

  const dpr = window.devicePixelRatio||1
  const rect2 = can2.getBoundingClientRect();

  can2.width = rect2.width * dpr // 将绘制的空间尺寸放大后，canvas绘制空间成了400*400，画完以后，又映射到屏幕上的400*400，那这样就不会模糊了
  can2.height = rect2.height * dpr

  drawLine(can2.getContext('2d')!)


  const rect3 = can3.getBoundingClientRect();
  console.log("🚀 ~ exp2.vue:45 ~ rect3:", rect3)


  can3.width = rect3.width * dpr
  can3.height = rect3.height * dpr
// 原本想着200*200，但如果屏幕尺寸放大了，用开发者工具去点选元素，显示的css 宽高依然是200*200，但实际上它在页面上已经放大了
// 我的电脑，推荐125%，放大后，点选依然是200的格子，但用截屏的去量那块空间，已经变成了250，正好是1.25*200
// can3 在图上就正好画了一半的宽度，用尺子量是125，但代码是按照之前的意愿：在200的宽度上画100的宽度，正好占一半

  const ctx3 = can3.getContext('2d')!
  ctx3.scale(dpr, dpr) // 虽然can2中绘制不模糊了，但存在一个问题，人为的扩大了绘制空间，原本我就想在200*200的空间上画，代码里定位，大小，长度的数值都是要按照200*200都是没问题的，比如200长的一条线，就是要画到最右边了，但是现在扩大空间后，原来画200的代码，就真的是一条200长的线，只到canvas的中间了。所以同步的把canvas内坐标放大一下，这样虽然还是画的200，但因为scale放大了，就相当于这条线放大了2倍，就画到了最右边了
  // ! 到此canvas在搞dpr下的模糊问题才是真的解决了
  drawLine(ctx3)


  const ctx4 = can4.getContext('2d')!
  ctx4.scale(dpr, dpr)
  drawLine(ctx4)

})


function drawLine(ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.moveTo(0, 100)
  ctx.lineTo(100, 100)
  ctx.stroke()
}
</script>

<style lang="less" scoped>
canvas {
  display: block;
  margin-bottom: 10px;
}

</style>
