<template>
  <div v-container>
    <p>msg: {{ msg }}</p>
    <p>count: {{ count }}</p>
    <p>time: {{ time }}</p>
    <button @click="add">+1</button>
    <button @click="send">event</button>
    <button @click="random">time</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Xchild',
  props: ['msg'],
  emits: ['ok'],
  setup(props, ctx) {
    console.log('🚀 ~ setup ~ props:', props)
    const count = ref(100)
    const add = () => {
      count.value++
    }
    const send = () => {
      ctx.emit('ok', 'hello', count.value)
    }
    return {
      count,
      add,
      send
    }
  },
  data() {
    return {
      time: new Date()
    }
  },
  methods: {
    random() {
      this.time = new Date()
    }
  },
  created() {
    console.log('🚀 ~ created ~ this:', this)
  },
  mounted() {
    console.log('🚀 ~ mounted ~ this:', this)
  }
})
</script>
