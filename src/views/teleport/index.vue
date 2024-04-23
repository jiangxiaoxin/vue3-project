<template>
  <div id="index2-page">
    <Teleport to="body" :disabled="!isfull">
      <div style="background-color: red; color: white; position: absolute; top: 0">
        <p>我是弹窗:{{ time }}</p>
        <button @click="isfull = !isfull">12123</button>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
/**
 * teleport 在挂载时，必须保证目标有真实的dom元素，否则会报错
 * 将 teleport 放到根的 div 内部，这样就可以了
 * 点击全屏后，挂载到body上，这样是窗口内全屏（通过样式保证），然后再f11全屏，就整个body全屏了，间接实现全屏
 */
export default defineComponent({
  data() {
    return {
      time: 11111,
      interval: null,
      isfull: false
    }
  },
  computed: {
    port: function () {
      return this.isfull ? 'body' : '#index2-page'
    }
  },
  mounted() {
    console.log('🚀 ~ mounted ~ mounted:')

    this.interval = setInterval(() => {
      this.time++
      console.log('🚀 ~ interval ~ time:', this.time)
    }, 1000)
  },
  beforeUnmount() {
    console.log('beforeUnmount')
    clearInterval(this.interval)
  },
  unmounted() {
    console.log('unmounted')
  }
})
</script>
<style>
#index2-page {
  position: relative;
}
</style>
