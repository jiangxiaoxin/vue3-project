<template>
  <div>
    <div style="width: 100px; height: 100px; background: red">123</div>

    <div
      style="
        width: 150px;
        height: 150px;
        background: blue;
        margin: 10px;
        padding: 20px;
        border: 10px solid black;
        overflow: auto;
      "
    >
      <div style="height: 200px; width: 200px">123</div>
    </div>

    <div class="outer" ref="conRef" @scroll="handleScroll">
      <div v-for="item in 20" :key="item" class="item">index: {{ item }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const conRef = ref(null)

const handleScroll = (e) => {
  // 最大滚动600px，一共20个item，每个height=40， 总共占据20*40=800px，可见区域200px，所以最大滚动800-200=600px
  console.log('scroll top:', e.target.scrollTop)
}
</script>

<style scoped>
.outer {
  height: 200px;
  overflow: auto;
}

.outer::-webkit-scrollbar {
  display: none;
}

.item {
  height: 40px;
}
</style>
