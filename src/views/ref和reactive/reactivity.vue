<template>
  <div>
    <div id="cc" ref="ele">{{count}}</div>
    <button
      @click="btnClick"
    >
      count
    </button>
  </div>
</template>
<script setup>
import {ref, effect, onMounted, nextTick} from 'vue'
const count = ref(0)
const ele = ref(null)

// onMounted(() => {
//   console.log('==ele', ele.value.textContent)
// })

const btnClick = async () => {
  nextTick(() => {
    console.log('11', ele.value.textContent)
  })
  nextTick(() => {
    console.log('aaaa', ele.value.textContent)
  })
  count.value++;
  console.log(ele.value.textContent)


  const p = await nextTick()

  nextTick(() => {
    console.log('fffff', ele.value.textContent)
  })
  count.value++;
  nextTick(() => {
    console.log('cccc', ele.value.textContent)
  })
  console.log(ele.value.textContent)
  count.value++;
  console.log(ele.value.textContent)
  nextTick(() => {
    console.log('22', ele.value.textContent)
  })



}

// effect(() => {
//   console.log('in effect', count.value)
// })
</script>
