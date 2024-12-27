<template>
    <button @click.stop="count++">改count : {{ count }}</button>
    <a单存的子组件 :count="count"/>
</template>

<script lang="ts" setup>

import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import a单存的子组件 from './单存的子组件.vue';

const count = ref(1)

onBeforeMount(() => {
    console.log('父组件 beforeMount')
})

onMounted(() => {
    console.log('父组件 mounted')
})

onBeforeUpdate(() => {
    console.log('父组件 beforeUpdate')
})

onUpdated(() => {
    console.log('父组件 updated')
})

onBeforeUnmount(() => {
    console.log('父组件 beforeUnmount')
})

onUnmounted(() => {
    console.log('父组件 unmounted')
})
</script>