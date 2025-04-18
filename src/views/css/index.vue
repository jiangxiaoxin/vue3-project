<template>
  <Bg />
  <inlineModel />

  <h1>https://csscoco.com/inspiration/#/./layout/multi-column-contour</h1>

  <div :style="{ background: 'pink' }">
    <div
      :style="{
        width: '300px',
        // height: '100px',
        background: 'red',
        margin: '10px',
        border: '20px solid blue',
        // borderColor: 'transparent',
        // borderWidth: '20px',
        // borderStyle: 'solid',
        padding: '30px'
      }"
    >
      <!-- <div style="width: 100px; background: green">123123</div> -->
      <div style="background: green">123123</div>
    </div>
  </div>
  <div style="width: 100%; height: 200px; background: red; display: flex">
    <div style="width: 50%; height: 100px; background: blue; margin: auto; display: flex">
      <span style="display: block; margin: auto">flex+margin实现水平垂直居中</span>
    </div>
  </div>

  <div style="background-color: #001925;margin-top: 50px;">
    <div class="gradient-bg">渐变背景色</div>
  </div>
  <div style="background-color: bisque;">
    <div class="gradient-text">
    文字本身颜色渐变文字本身颜色渐变文字本身颜色渐变文字本身颜色渐变文字本身颜色渐变文字本身颜色渐变
  </div>
  </div>
</template>
<script setup lang="ts">
import inlineModel from "./行内元素的盒模型.vue"
import Bg from "./背景.vue"
</script>
<style lang="less" scoped>

// 渐变的实例
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_images/Using_CSS_gradients

// 渐变生成器
// https://cssgenerator.org/gradient-css-generator.html
.gradient-bg {
  height: 300px;
  line-height: 300px;
  text-align: center;
  color: #11ebd7;
  user-select: none;
  // background-image: linear-gradient(
  //   270deg,
  //   rgba(39, 247, 237, 0) 0%,
  //   rgba(17, 235, 215, 0.16) 49%,
  //   rgba(17, 235, 215, 0.01) 82%,
  //   rgba(17, 235, 215, 0) 100%
  // );


  // 4段对称渐变
  // background-image: linear-gradient(
  //   // 270deg, // 渐变轴，去掉后默认从上到下。从上到下的渐变轴也挺好看的
  //   rgba(39, 247, 237, 0) 0%,
  //   rgba(17, 235, 215, 0.01) 25%,
  //   rgba(17, 235, 215, 0.16) 50%,
  //   rgba(17, 235, 215, 0.01) 75%,
  //   rgba(17, 235, 215, 0) 100%
  // );


  // 从上到下的渐变
  // background-image: linear-gradient(
  //   red,
  //   blue
  // );

  // background-image: linear-gradient(0deg, blue, green 50%, red);;

  // background-image: linear-gradient(0deg, blue, green, red);;

  // 雷达渐变也挺好看
  background-image: radial-gradient(rgba(17, 235, 215, 0.16) 10%, rgba(17, 235, 215, 0.01) 80%, rgba(39, 247, 237, 0));
}

.gradient-text {
  width: fit-content;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, blue 33.33%, green 66.66%, red);
  height: 200px;
  line-height: 200px;
}
</style>
