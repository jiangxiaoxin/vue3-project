<template>
  <div style="width: 40%">
    <div class="qc-table">
      <div class="header">
        <div class="arrow" style="visibility: hidden"></div>
        <div class="header-column">工段</div>
        <div class="header-column">检验总量</div>
        <div class="header-column">合格量</div>
        <div class="header-column">不合格量</div>
        <div class="header-column">检验中</div>
      </div>
      <div class="body">
        <div class="body-row" v-for="(item, index) in data" :key="index">
          <div class="arrow"></div>
          <div class="header-column" v-for="(col, idex) in item" :key="index + '-' + idex">{{ col }}</div>
        </div>
        <!-- <div class="body-row">
          <div class="arrow"></div>
          <div class="header-column">发酵</div>
          <div class="header-column">24</div>
          <div class="header-column">23</div>
          <div class="header-column">34</div>
          <div class="header-column">234</div>
        </div>
        <div class="body-row">
          <div class="arrow"></div>
          <div class="header-column">清酒</div>
          <div class="header-column">24</div>
          <div class="header-column">23</div>
          <div class="header-column">34</div>
          <div class="header-column">234</div>
        </div>
        <div class="body-row">
          <div class="arrow"></div>
          <div class="header-column">包装</div>
          <div class="header-column">24</div>
          <div class="header-column">23</div>
          <div class="header-column">34</div>
          <div class="header-column">234</div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
    data: {
        default: []
    }
})

</script>
<style lang="less" scoped>
.qc-table {
  background: #08421a;
  padding: 12px 12px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    color: #89e4a9;
    background: url('@/assets/header-bg.png') no-repeat center center;
    background-size: contain;
  }

  .arrow {
    display: block;
    width: 11px;
    height: 15px;
    background: url('@/assets/arrow.png') no-repeat center center;
    background-size: contain;
    position: relative;

    &::after {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background-image: radial-gradient(#5fe7a0, #13f367);
      filter: blur(5px);
    }
  }

  .header-column {
    // background-color: red;
    width: 17%; // 17 * 5 + arrow
    text-align: center;
    white-space: nowrap;
  }

  .body-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;
    align-items: center;

    &:nth-child(even) {
      background-color: #094a1e;
    }

    .arrow + .header-column {
      color: white;
      font-weight: bolder;
    }

    .header-column:nth-child(3) {
      color: transparent;
      background-clip: text;
      background-image: linear-gradient(to right, rgb(119, 172, 227), rgb(85, 146, 255));
    }
    .header-column:nth-child(4) {
      color: transparent;
      background-clip: text;
      background-image: linear-gradient(to right, rgb(125, 245, 180), rgb(70, 255, 76));
    }
    .header-column:nth-child(5) {
      color: transparent;
      background-clip: text;
      background-image: linear-gradient(to right, rgb(250, 102, 102), rgb(255, 64, 66));
    }
    .header-column:nth-child(6) {
      color: transparent;
      background-clip: text;
      background-image: linear-gradient(to right, rgb(255, 252, 106), rgb(250, 209, 67));
    }
  }
}

// .blur {
//   width: 40px;
//   height: 40px;
//   background-image: radial-gradient(#5fe7a0, #13f367);
//   filter: blur(10px);
// }
</style>
