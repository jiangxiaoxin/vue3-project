<template>
  <div v-container>
    <p v-for="id in 10">
     paragrpah -- {{ id }}
    </p>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import "./js/arrow-function"
</script>

<script lang="ts" setup>
import { ref, reactive, watch, computed, provide } from 'vue'
import provideinject from './views/provide-inject/index.vue'
let noRefValue = {
  age: 123
}
const value = ref(100)
provide('app-value', value)
provide('no-ref', noRefValue)



</script>
<style lang="less" scoped>


</style>
