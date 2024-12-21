<template>
    <div class="container" @scroll="handleScroll">
      <div class="list" :style="listStyle">
        <div class="list-item" v-for="item in showList" :key="item.id" :data-id="item.id" ref="listItemRef">
          <div>id: {{ item.id }}--- name: {{ item.name }}</div>
        </div>
      </div>
    </div>
    <div>
        <div>
            总条数：{{ tableList.length }}
        </div>
        <div>
            显示条数：{{ showList.length }}
        </div>
        <div>
            每页的数量：{{ pageSize }}
        </div>
        <div>
            startIndex: {{ startIndex }} endIndex: {{ endIndex }}
        </div>
      <button @click="add100">+100</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, watch, computed, provide, onMounted } from 'vue'
  import { useDebounceFn, useThrottleFn } from '@vueuse/core'
  
  /**
   * list-item 高度是固定且相同的，这样可以让内部元素布局好后，在list-item 里居中显示
   */
  
  const tableList = ref<any[]>([])
  const showList = ref<any[]>([])
  const itemHeight = 80
  const containerHeight = 600
  
  let pageSize = Math.ceil(containerHeight / itemHeight)
  console.log('🚀 ~ default pageSize:', pageSize)
  
  let safeArea = pageSize
  
  const listItemRef = ref([])
  
  function add100() {
    tableList.value = tableList.value.concat(
      new Array(100).fill(0).map((item) => {
        let _id = id++
        return {
          id: _id,
          name: `name-${_id}`
        }
      })
    )
  }
  
  let id = 0
  onMounted(() => {
    tableList.value = new Array(500).fill(0).map((item) => {
      let _id = id++
      return {
        id: _id,
        name: `name-${_id}`
      }
    })
  
    calc(0)
  
    setTimeout(() => {
      reCalc()
      calc(0)
    }, 0);
  })
  
  function reCalc() {
    // console.log('🚀 ~ reCalc ~ reCalc', listItemRef.value);
    if(listItemRef.value.length >= 2) {
      let first = listItemRef.value[0]
      let second = listItemRef.value[1]
      let diff = second.offsetTop - first.offsetTop
      console.log("🚀 ~ reCalc ~ diff:", diff)
      pageSize = Math.ceil(containerHeight / diff)
      safeArea = pageSize
      console.log('🚀 ~ reCalc ~ pageSize:', pageSize)
    }
     
  }
  
  const handleScroll = useThrottleFn((e) => {
    const target = e.target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log('到底了')
    }
    calc(scrollTop)
  }, 50)
  
  const startIndex = ref(0)
  const endIndex = ref(0)
  
  function calc(scrollTop: number) {
    let start = Math.floor(scrollTop / itemHeight)
    start = start < 0 ? 0 : start
    let end = start + pageSize
    end = end > tableList.value.length ? tableList.value.length : end
  
    start = Math.max(0, start - safeArea)
    end = Math.min(end + safeArea, tableList.value.length)
  
    startIndex.value = start
    endIndex.value = end
    showList.value = tableList.value.slice(start, end)
  }
  
  /**
   * 可见区域的数量是固定的。通过paddingTop 和 paddingBottom 再加上可视区域的高度，来撑开外层容器 list 的实际高度，这样list 的高度就跟默认渲染的高度一致了
   */
  const listStyle = computed(() => {
    // let totalHeight = tableList.value.length * itemHeight
    let topPadding = startIndex.value * itemHeight
    let bottomPadding = (tableList.value.length - endIndex.value) * itemHeight
    // console.log("🚀 ~ listStyle ~ bottomPadding:", bottomPadding)
  
    return {
      paddingTop: `${topPadding}px`,
      paddingBottom: `${bottomPadding}px`
    }
  })
  </script>
  <style lang="less" scoped>
  .container {
    background-color: red;
    height: 600px;
    overflow: auto;
  
    .list {
      background-color: blue;
  
      .list-item {
        background-color: yellowgreen;
        height: 80px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        border-bottom: 10px solid black;
        padding-bottom: 10px;
        // box-sizing: content-box;
      }
  
      .list-item:nth-child(2n) {
        background-color: yellow;
      }
    }
  }
  </style>
  