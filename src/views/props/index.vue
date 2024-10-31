<template>
  <div>
    <h1>props:{{ modalShow }}</h1>
    <div>
      <span>{{ currentTime }}</span>
      <button @click="updateTime">update time</button>
    </div>

    <input :value="value" @input="inputChange" />
    <pa :message="value" :time="currentTime" />

    <div v-container>
      <button @click="changeOrigin">rorigin: {{ rorigin.name }}</button>
    </div>

    <div v-container>
      <showvue :show="showToChildProps" v-model:see="seeInParent" :foo="foo" />
      <p>父组件内的深度对象 {{ foo.bar }}</p>
      <div>父组件里showToChildProps: {{ showToChildProps }}</div>
      <button @click="showToChildProps = !showToChildProps">父组件里改showToChildProps</button>
      <div>父组件里seeInParent: {{ seeInParent }}</div>
      <button @click="seeInParent = !seeInParent">父组件里改父组件里seeInParent</button>
    </div>

    <!--    <vmodal v-model="modalShow" />-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import vmodal from './vmodal.vue'
import pa from './pa.vue'
import showvue from './show.vue'
const currentTime = ref(Date.now())
const showToChildProps = ref(false)
const seeInParent = ref(true)
const foo = ref({ bar: Date.now() })
const updateTime = () => {
  currentTime.value = Date.now()
}
const value = ref('input')
const inputChange = (evt) => {
  //   console.log(evt.target.value)
  value.value = evt.target.value
}

const origin = {
  name: Math.random()
}

const rorigin = reactive(origin)

const changeOrigin = () => {
  rorigin.name = Math.random()
  setTimeout(() => {
    console.log('-prigin name', origin.name, rorigin.name)
  }, 0)
}

const modalShow = ref(false)
</script>
