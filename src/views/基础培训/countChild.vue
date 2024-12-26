<template>
    <div v-container>
        <section>我是子组件</section>
        <div>count: {{props.count}}</div>
        <div>time: {{props.time}}</div>
        <div>refArr: {{props.refArr.join(',')}}</div>
        <div>num in obj: {{props.obj.num.join(',')}}</div>
        <button @click="changeCount">修改count,会报错，不能直接修改</button>
        <button @click="changeObjNum">改obj.num,可以改，并且不会报错</button>
    </div>

</template>
<script setup lang="ts">

const props = defineProps({
    count: {
        type: Number,
        default: 0
    },
    time: {
        type: Number,
        default: 0
    },
    refArr: { // ref 包的数组
        type: Array,
        default: []
    },
    obj: {
        type: Object,
        default: {}
    }
})

const changeCount = () => {
    props.count++
}

const changeObjNum = () => {
    // 虽然能改，但不能这么用，违反了数据单一的规则，会造成数据的混乱
    // 最直接的就是会直接改掉父组件里的数据，最后如果关掉页面，不保存这些数据，但此时父组件里已经修改了。
    props.obj.num.push(Date.now())
}
</script>