<template>
  <div>
    <div v-container>open : {{ state }}</div>
    <div v-container>data: {{ JSON.stringify(data) }}</div>
    <button @click="open">connect</button>
    <button @click="close">disconnnet</button>
    <div>
      <input v-model="msg" />
      <button @click="sendMsg">send</button>
    </div>

    <div>qrcode : {{ formState.qrcode }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useSimpleSocket } from './util'
const msg = ref('')

const { open, close, send, data, state } = useSimpleSocket('ws://124.222.224.186:8800', {
  onMessage: (ws, evt) => {
    console.log('msg::::', evt)
  },
  onError: (ws, err) => {
    console.log('errrrrrrrrrr', err)
  }
})

const sendMsg = () => {
  send(msg.value)
}

const formState = reactive({
  qrcode: 0
})

const inc = () => {
  //   formState.qrcode++
  requestAnimationFrame(() => {
    inc()
  })
}

// inc()
</script>
