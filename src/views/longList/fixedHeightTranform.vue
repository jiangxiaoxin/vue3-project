<template>
  <div class="container" @scroll="handleScroll" :data-size="pageSize" ref="containerRef">
    <div class="list" :style="listStyle">
      <div class="list-item" v-for="(item, index) in showList" :key="index" :data-id="item.id">
        <slot name="item" :data="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, nextTick, onMounted } from 'vue'

const props = defineProps({
  dataSource: {
    type: Array,
    required: true,
    default: []
  },
  itemHeight: {
    type: Number,
    required: true
  },
  safeArea: {
    type: Number,
    required: true,
    default: 10
  },
  defaultPageSize: {
    type: Number,
    default: 10
  }
})

/**
 * 通过height 和 translateY 来实现虚拟列表滚动，
 * 本质是计算好showList的数据后，再计算外层容器内，从此时startIndex开始到整个列表的数据条数，就得出了整个高度，但整个高度并不是容器的全部高度，还要对startIndex 之前的数据进行一个高度计算，这样前面的高度做translateY，再加上个height，就是整个容器的高度
 */

/**
 * 每隔 wait 毫秒执行一次 func
 * 通过timeout来实现，如果再次运行，发现timeout还在，那说明，已经准备好执行一次了，本次就先不考虑，等已经安排好的这次执行了，再重新安排下一次
 */
function throttle(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args)
        clearTimeout(timeout)
        timeout = 0
      }, wait)
    }
  }
}

const containerRef = ref<HTMLDivElement>()

const scrollTop = ref(0)

const pageSize = ref(props.defaultPageSize)

onMounted(() => {
  nextTick(() => {
    pageSize.value =
      Math.ceil(containerRef.value!.getBoundingClientRect().height / props.itemHeight) +
      2 * props.safeArea
  })
})

const showList = computed(() => {
  return props.dataSource.slice(startIndex.value, endIndex.value)
})

const listStyle = computed(() => {
  return {
    height: `${(props.dataSource.length - startIndex.value) * props.itemHeight}px`,
    transform: `translateY(${startIndex.value * props.itemHeight}px)`
  }
})

const handleScroll = throttle((e: Event) => {
  const __scrollTop = (e.target as HTMLElement)?.scrollTop
  scrollTop.value = __scrollTop
}, 100)

const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.safeArea)
})

const endIndex = computed(() => {
    return Math.min(startIndex.value + pageSize.value, props.dataSource.length)
})

</script>
<style lang="less" scoped>
.container {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .list {
    position: relative;
    box-sizing: border-box;
  }

  .list-item {
    box-sizing: border-box;
  }
}
</style>
