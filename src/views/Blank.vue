<template>
  <div v-container>
    <h1 v-container>我是 blank view</h1>
    <h2>如果blank view 里没有router-view，那后续的组件就没有渲染的父节点</h2>
    <RouterView />
  </div>
</template>
<script lang="ts" setup>

const promise1 = new Promise((resolve, reject) => {
  console.log('enter promise1');
  
  setTimeout(() => {
    resolve("result from promise1")
  }, 2000);
})

function pro2() {
  return new Promise((resolve, reject) => {
  console.log('enter promise2');
  
  setTimeout(() => {
    // reject("result from promise2")
    // throw new Error('error in promise2')
  }, 2000);
})
}

promise1.then((res) => {
  console.log('promise1 then==', res);
  pro2()
  
}).catch((err) => {
  console.log('promise1 catch', err);
  
})

</script>
