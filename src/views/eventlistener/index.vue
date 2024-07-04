<template>
  <div v-container>
    <h1>event listener</h1>

    <!-- <ul>
      <li v-container>
        <p>最普通的情形，btn监听到以后，外层div再监听到</p>
        <div @click="click2" class="size-100" v-bg>
          <button @click="click1">click</button>
        </div>
      </li>
      <li v-container>
        <p>btn监听到以后，禁用传递，外层div再也监听不到</p>
        <div @click="click2" class="size-100" v-bg>
          <button @click="click3">click</button>
        </div>
      </li>
      <li v-container>
        <p>pointer-events: none 目标不参与鼠标事件</p>
        <div @click="click2" class="size-100" v-bg>
          <button @click="click1" style="pointer-events: none">click</button>
        </div>
      </li>

      <li v-container>
        <p>
          父元素none之后，子元素不修改，那么pointer-events 会整体继承下去，所以子元素也不响应事件了
        </p>
        <p>
          但如果父元素设置none后，子元素又修改了，那么点击子元素时，父元素的监听器还是会跑。但如果只点击父元素，父元素是不会出发监听器的
        </p>
        <div @click="click2" class="size-100" v-bg style="pointer-events: none">
          <button @click="click1" style="pointer-events: auto">click</button>
        </div>
      </li>
    </ul> -->

    <div>
      <input type="text" />
    </div>
  </div>
</template>
<!-- <script setup>
const click1 = (event) => {
  console.log('click1==', event)
}
const click2 = (event) => {
  console.log('click2===', event)
}

const click3 = (event) => {
  console.log('click3=====', event)
  event.stopPropagation()
}
</script> -->

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  async created() {
    console.log('created')
    try {
      await longtime()
    } catch (a) {}
  },

  mounted() {
    console.log('--mounted')
  },
  methods: {
    longtime() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(123)
        }, 10000)
      })
    }
  }
})
</script>
<style lang="less">
.size-100 {
  width: 100px;
  height: 100px;
}

.size-200 {
  width: 200px;
  height: 200px;
}
</style>
