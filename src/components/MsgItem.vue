<template>
  <div>
    <p>
      <span>msg: </span>
      <span>{{ msg }}</span>
    </p>
  </div>
</template>
<script setup lang="ts">
defineProps({
  msg: String
})
</script>

<!-- MsgItem 和 MsgItem2 用来验证自定义指令作用在组件上时，是添加给谁的 -->
<!-- 如果组件只有一个根元素，就像这里最根级的div，那最后渲染后，class是添加给这个根div了 -->
<!-- 而 MsgItem2 里没有根元素，几个div元素都是平级的兄弟关系，渲染后，指令并没有添加class给任何一个元素,会报错误提醒的 -->
<!-- Runtime directive used on component with non-element root node. The directives will not function as intended.  -->
