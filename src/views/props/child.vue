<template>
  <div v-container>
    <p>child {{ Date.now() }}</p>
    <p>foo: {{ foo }}</p>
    <p>bar: {{ bar.bar }}</p>
    <p>baz: 
        <div v-for="i in baz" :key="i">{{ i }}</div>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { isReactive, isRef, onMounted, watchEffect } from 'vue';

const props = defineProps({
  foo: [String, Number],
  bar: Object,
  baz: Array<number|string>
})
console.log(props);

watchEffect(() => {
    console.log('child, foo', props.foo);
    
})

onMounted(() => {
    alert('child mounted')
})

// setTimeout(() => {
//     props.bar.bar = 'hh' // bar 是个 MutableReactiveHandler，可以修改
    
//     props.foo = 'tttttt' // props 是个 ReadonlyReactiveHandler，不能直接修改
    
// }, 2000);



console.log(isReactive(props.foo), isRef(props.foo))
</script>
