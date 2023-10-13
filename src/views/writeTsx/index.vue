<template>
  <renderComp msg="hello" />

  <setupReturnRender :init-value="voo" />
  <div v-container>
    <button @click="randomVoo">change init value in parent</button>
    <p>voo in parent: {{ voo }}</p>
  </div>

  <input type="text" v-model="count" />
  <loopItem :count="count" />
  <div>123</div>
</template>

<script setup lang="ts">
import renderComp from './renderFunction'
import setupReturnRender from './setupReturnRender'
import loopItem from './loopItem'
import { ref } from 'vue'

const voo = ref(Math.random())

const randomVoo = () => {
  voo.value = Math.random()
}

const count = ref('3')
</script>
