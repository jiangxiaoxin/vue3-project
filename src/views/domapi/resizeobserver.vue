<template>
    <div>
        <label for="width" >
            宽度
            <input type="number" v-model="size.width">
        </label>
        
        <label for="height" >高度<input type="number" v-model="size.height"></label>
        <label for="border" >border<input type="number" v-model="size.border"></label>
        <label for="border" >margin<input type="number" v-model="size.margin"></label>
        <label for="border" >padding<input type="number" v-model="size.padding"></label>
        <button @click="doResize">resize</button>
        <div style="background-color: green;">
            <div ref="divRef" style="background-color: red;transform: translateX(100px) translateY(100px);box-sizing: content-box;">rect</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref , reactive, onMounted, onUnmounted } from "vue"

const size = reactive({
    width: 200,
    height: 200,
    
    margin: 10,
    border: 20,
    padding: 30
})

const divRef = ref<HTMLDivElement>()

const doResize = () => {
    divRef.value!.style.width = `${size.width}px`
    divRef.value!.style.height = `${size.height}px`

    // divRef.value!.style.margin = `${size.margin}px`
    divRef.value!.style.border = `${size.border}px solid black`
    divRef.value!.style.padding = `${size.padding}px`
}

let observer: ResizeObserver

onMounted(() => {
    doResize()
    observer = new ResizeObserver((entries) => {
        console.log('entries', entries)
        /**
         * entries里的参数很奇怪
         */
    })

    observer.observe(divRef.value!, {box: 'border-box'})

})

onUnmounted(() => {
    observer?.unobserve(divRef.value!)
    observer.disconnect()
})

</script>