<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      /* overflow: hidden; */
      background-color: yellow;
    "
  >
    <div>有点复杂的flex布局，左侧中间注意如何出现滚动的</div>
    <h1>123123123123</h1>
    <div style="flex: 1; background-color: blue; display: flex; overflow: hidden">
      <div style="width: 200px; background-color: pink; display: flex; flex-direction: column">
        <div>多亏了外层容器的 overflow:hidden ，这个列表才限制在一个窗口区域内</div>
        <div style="flex: 1; background-color: green; overflow: auto">
          <div v-for="item in 100" :key="item" style="height: 50px">cccccccccccccccccccccccccc</div>
        </div>
        <div style="height: 100px; background-color: peru">bbbbbbbbbbbbbbbbbbbb</div>
      </div>

      <div style="flex: 1; background-color: blueviolet">middle</div>
      <div style="width: 200px; background-color: brown">right</div>
    </div>
  </div>
</template>

<style lang="less">
html,
body {
  height: 100%;
  // overflow: hidden;
}
</style>
