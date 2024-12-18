<template>
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
</template>
<script setup lang="ts"></script>
