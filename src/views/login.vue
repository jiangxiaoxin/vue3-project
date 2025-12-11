<template>
  <div>
    <h1>login</h1>
    <input type="text" v-model="username" id="username" />
    <input type="password" v-model="password" id="password" />
    <input type="text" v-model="subsysId" id="subsysId" />
    <button @click="login" id="login">login</button>
  </div>

  <div>visible: {{ visible }}</div>
  <div>isfocus: {{ isfocus }}</div>
  <div>isblur: {{ isblur }}</div>

  <button @click="goUser(1)">use:1</button>
  <button @click="goUser(2)">use:2</button>

  
</template>
<script setup lang="ts">




const goUser = (id: number) => {
  router.push(`/user/${id}`)
}






import { c } from '@/utils/log'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import dayjs from 'dayjs';
const router = useRouter()
const username = ref('')
const password = ref('')
const subsysId = ref('')

const visible = computed(() => {
  return document.visibilityState
})

const isfocus = ref(false)
const isblur = ref(false)

console.log("document", document, window, document.visibilityState);

// onMounted(() => {
//   window.onblur = () => {
//     c.primary("onblur", document.visibilityState, dayjs().format("YYYY-MM-DD HH:mm:ss"));
//     isblur.value = true
//     isfocus.value = false
//   }

//   window.onfocus = () => {
//     c.primary("onfocus", document.visibilityState, dayjs().format("YYYY-MM-DD HH:mm:ss"));
//     isblur.value = false
//     isfocus.value = true
//   }

//   document.addEventListener("visibilitychange", visibilitychangeHandler)
// })

const visibilitychangeHandler = () => {
    c.primary("visibilitychange", document.visibilityState, dayjs().format("YYYY-MM-DD HH:mm:ss"));
}

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', visibilitychangeHandler)
})



const login = () => {
  console.log('00000000', username.value, password.value, subsysId.value)

  axios
    .post('http://61.184.73.91:7091/api/login', {
      password: 'QUVTL0diYS90cW10UnlyTndIa3QzNVFOdz09',
      subsysId: '10001',
      username: 'admin'
    })
    .then((response) => {
      console.log('=>(login.vue:24) response', response)
      if (response.data && response.data.code === 200) {
        console.log('登录成功')
        window.localStorage.setItem('token', response.data.token)
        router.push('/about')
      }
    })
    .catch((error) => {
      console.log('=>(login.vue:26) error', error)
    })
}






</script>
<style scoped lang="less">
</style>
