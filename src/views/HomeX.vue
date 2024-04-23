<template>
  <div v-container>
    <!-- <XChild @ok="childOK" msg="123abc" /> -->
    <button @click="toggle">toggle</button>
    <button @click="testObj1">testObj1</button>
    <button @click="testObj2">testObj2</button>
    <div
      v-bg
      style="
        height: 500px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      "
    >
      <div v-bg v-if="show" style="height: 20px">head</div>
      <div v-bg style="flex: 1">content</div>
      <div v-bg style="height: 50px">foot</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import XChild from './XChild.vue'
import { testObj } from './test'

export default defineComponent({
  name: 'HomeX',
  components: {
    XChild
  },
  setup() {
    const show = ref(true)
    const toggle = () => {
      show.value = !show.value
    }
    return { show, toggle }
  },
  methods: {
    childOK(msg: string, count: number) {
      console.log('childOK', msg, count)
    },
    testObj1() {
      console.log('testObj1111', testObj)
      testObj.name = '11111'
      console.log('testObj2222', testObj)
    },
    testObj2() {
      console.log('testObj3333', testObj)
      testObj.name = '22222'
      console.log('testObj4444', testObj)
    }
  }
})
</script>
