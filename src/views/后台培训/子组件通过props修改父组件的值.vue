<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  obj: {
    type: Object,
    default: {}
  }
})
</script>

<template>
  <div>
    <!-- 会报错 -->
    <!-- <h1 @click="props.count++">子组件 count: {{ count }}</h1> -->

    <h1 @click="props.obj.count++">子组件 obj.count: {{ obj.count }}</h1>

    <!-- 会报错 -->
     <!-- 这样值类型和引用类型就统一了，通过改props的属性是不行的，因为props是readonly，而改props上的属性的属性是可以的 -->
    <!-- <h2 @click="props.obj = { count: 123123123123 }">子组件 obj.count: {{ obj.count }}</h2> -->

    
  </div>
</template>
