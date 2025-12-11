<template>
  <div>
    <div style="width: 100px; height: 100px; background: red" id="rect"></div>

    <p>
      green 是200*200 一个背景
      blue 是150*150，内部一个red是200*200，这样blue 就会出现滚动条，但是滚动条会占据blue 可以用来显示的空间，所以同时能看到的 red 只能是 150-15=135的尺寸
    </p>

    <div style="width: 200px;height: 200px;background: green">
      <div
      style="
        width: 150px;
        height: 150px;
        background: blue;
        overflow: scroll;
      "
    >
      <!-- <div style="height: 100%; width: 100%;background: red;">123</div> -->
       <div style="height: 200px;width: 200px;">33333</div>
    </div>
    </div>

    <div class="outer" ref="conRef" @scroll="handleScroll">
      <div v-for="item in 20" :key="item" class="item">index: {{ item }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const conRef = ref(null)

const handleScroll = (e) => {
  // 最大滚动600px，一共20个item，每个height=40， 总共占据20*40=800px，可见区域200px，所以最大滚动800-200=600px
  console.log('scroll top:', e.target.scrollTop)
}

onMounted(() => {
  const rect = document.getElementById('rect')
  rect?.addEventListener('click', (e) => {
    console.log('click', e)
  })

  rect?.addEventListener('dblclick', (e) => {
    console.log('dbclick', e);
    e.preventDefault()
    e.stopPropagation()
  }, { capture: true})
})


onMounted(() => {
  function getScrollBarSize() {
  // 创建一个隐藏的 div
  const div = document.createElement('div');
  // div.style.visibility = 'hidden';
  div.style.overflow = 'scroll'; // 强制出现滚动条
  div.style.width = '100px';
  div.style.height = '100px';
  document.body.appendChild(div);

  // 创建一个子 div 填满父 div
  // const innerDiv = document.createElement('div');
  // innerDiv.style.width = '100%';
  // innerDiv.style.height = '100%';
  // div.appendChild(innerDiv);

  // 计算滚动条宽度和高度
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  const scrollbarHeight = div.offsetHeight - div.clientHeight;

  // 移除 div
  // document.body.removeChild(div);

  return {
    width: scrollbarWidth,
    height: scrollbarHeight
  };
}

// 使用方法
const scrollbarSize = getScrollBarSize();
console.log('滚动条宽度:', scrollbarSize.width, 'px');
console.log('滚动条高度:', scrollbarSize.height, 'px');
})





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
