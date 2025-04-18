<template>
  <p>
    getData的then里去发起新的请求 getData2和 getData3，getData2和
    getData3的执行不会影响getData自己的finally的执行，getData2和 getData3如果发生error，也不会被
    getData的catch拦截。如果 getData2和 getData3失败，只能由他们自己的catch去处理
  </p>
  <p>可以将then里面重新发起的promise return出来，这样就加入到外部的整个promise 链上</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123)
    }, 1000)
  })
}

const getData2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(456)
    }, 2000)
  })
}

const getData3 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(789)
    }, 3000)
  })
}

onMounted(() => {
  getData()
    .then((res) => {
      console.log('🚀 ~ index.vue:31 ~ getData ~ res:', res)

      getData2()
        .then((res) => {
          console.log('2222 data', res)
        })
        .catch((err) => {
          console.log('errr 222', err)
        })
        .finally(() => {
          console.log('finally 222')
        })
      getData3().then((res) => {
        console.log('333 data', res)
      })
    })
    .catch((err) => {
      console.log('1111', err)
    })
    .finally(() => {
      console.log('finally 1111')
    })
})
</script>
