<template>
  <div v-container>
    <p v-container>parent: 
        <p>{{ bar.bar }}</p>
        <button @click="changeFoo">foo</button>
    </p>

    <child :foo="foo" :bar="bar" :baz="baz" v-if="false"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, isReactive, isRef } from 'vue'
import child from './child.vue'

const foo = ref('foo')
const bar = reactive({ bar: 'bar' })
const baz = ref([1, 2, 3])

const changeFoo = () => {
    foo.value = Date.now()
}
</script>
