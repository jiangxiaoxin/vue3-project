<template>
    <div class="scroll-container">
        <div class="message-container" :class="['message-container-1']" style="background-color: green;">{{ msg }}</div>
        <div class="message-container" :class="['message-container-2']" style="background-color: blue;">{{ msg }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('nihao123123')
</script>

<style lang="less" scoped>
div {
    margin: 0;
    padding: 0;
}

.scroll-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: red;
    // overflow: hidden;
    position: relative;
    width: 400px;
    margin-left: 400px;
}

.message-container {
    width: fit-content;
    white-space: nowrap;
    
    position: relative;
}

.message-container-1 {
    left: 100%;
        transform: translateX(100%);
    animation: scroll-1 10s linear infinite;
}

.message-container-2 {
    left: 100%;
        transform: translateX(100%);
    animation: scroll-2 10s linear infinite;
    animation-delay: 8s;
}

@keyframes scroll-1 {
    0% {
        left: 100%;
        transform: translateX(100%);
    }

    100% {
        left: 0;
        transform: translateX(-100%);
    }
}

@keyframes scroll-2 {
    0% {
        left: 100%;
        transform: translateX(100%);
    }

    100% {
        left: 0;
        transform: translateX(-100%);
    }
}
</style>