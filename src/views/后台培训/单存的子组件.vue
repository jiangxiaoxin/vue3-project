<template>
    <h1>子组件 count: {{ count }}</h1>

    <button @click.stop="num++">改num: {{ num }}</button>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref } from 'vue';


const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
})

const num = ref(22)

onBeforeMount(() => {
    console.log('子组件 beforeMount')
})

onMounted(() => {
    console.log('子组件 mounted')
})

onBeforeUpdate(() => {
    console.log('子组件 beforeUpdate')
})


onUpdated(() => {
    console.log('子组件 updated')
})

onBeforeUnmount(() => {
    console.log('子组件 beforeUnmount')
})

onUnmounted(() => {
    console.log('子组件 unmounted')
})
</script>