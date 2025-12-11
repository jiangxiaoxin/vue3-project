<template>
    <div>
        <div v-container>
            <slot name="header"></slot>
        </div>
        <div v-container>
            <slot name="body"></slot>
        </div>
        <div v-container>
            <slot name="footer"></slot>
        </div>

        <div v-container>
            <p>一个组件内，可以有多个同名的插槽.父组件内这个名字插槽的内容会被渲染多次</p>
            <slot name="header"></slot>
        </div>

        <p>条件插槽，当父容器里通过这些具名插槽传入内容时，layout 里的slots.default 才会渲染，否则不渲染。当然不渲染也就看不到下面的红色字</p>
        <div v-container>
            <slot v-if="slots.default">
                <div style="color: red;">default slot</div>
            </slot>
        </div>
        <p>
            layout 里有footer插槽，但是父组件不使用footer插槽，那么layout 里的slots.footer就不会有值，也就不会渲染下面的红色div
        </p>
        <div v-if="slots.footer">
           <div style="width: 100px; height: 100px; background-color: red;"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {isProxy, isReactive, isRef, onMounted, useSlots} from "vue"
import { template } from "../ref和reactive/config";

const slots = useSlots() // slots 取到的key不是子组件里有哪些插槽，而是父组件里传递进来哪些插槽的使用

onMounted(() => {
    // console.log("header", slots.header);
    
})

console.log(slots, isProxy(slots), isReactive(slots), isRef(slots))

</script>

<style lang="less" scoped>

div {
    min-height: 20px;
}

</style>