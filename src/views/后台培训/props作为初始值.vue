<template>
    <div v-container>
        <h1>从父组件获取数据作为初始值</h1>
        <div>
            父组件count: {{ count }}
        </div>
        <div>
            子组件count: {{ localCount }}
        </div>
        <button @click="changeLocal">更改子组件count</button>
    </div>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
})

const localCount = ref(props.count)

watch(() => props.count, () => {
    localCount.value = props.count
})

const changeLocal = () => {
    localCount.value++
}

</script>