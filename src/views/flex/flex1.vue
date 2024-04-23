<template>
  <div class="flex-container" v-bg>
    <div class="flex-item" v-bg style="height: 100px">1</div>
    <div class="flex-item" v-bg style="height: 50px">2</div>
    <div class="flex-item" v-bg>3</div>
    <div class="flex-item" v-bg style="width: 200px; flex-shrink: 0">4</div>
    <div class="flex-item" v-bg>5</div>
    <div class="flex-item" v-bg>6</div>
    <div class="flex-item" v-bg>7</div>
    <div class="flex-item" v-bg>8</div>
    <div class="flex-item" v-bg>9</div>
    <div class="flex-item" v-bg>10</div>
    <div class="flex-item" v-bg>11</div>
    <div class="flex-item" v-bg>12</div>
  </div>
</template>

<style lang="less" scoped>
.flex-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  // width: 500px;
  // height: 300px;
  // flex-wrap: wrap-reverse;
  flex-wrap: wrap;
  // overflow: hidden;
}

.flex-item {
  width: 150px;
  height: 180px;
}
</style>
