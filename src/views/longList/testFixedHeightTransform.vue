<template>
  <div style="background-color: bisque">
    <span>length: {{ tableList.length }}</span>
    <button @click="add100">add100</button>
  </div>
  <div style="height: 400px">
    <fixedHeightTranform :data-source="tableList" :item-height="itemHeight" :safe-area="safeArea">
      <template v-slot:item="{ data, index }">
        <div class="test-item">
          id: {{ data.id }}--- name: {{ data.name }} --- index: {{ index }}
        </div>
      </template>
    </fixedHeightTranform>
  </div>
</template>
<script lang="ts" setup>
import fixedHeightTranform from './fixedHeightTranform.vue'
import { onMounted, ref } from 'vue'
const tableList = ref<any[]>([])

const itemHeight = 60
const safeArea = 10

onMounted(() => {
  setTimeout(() => {
    tableList.value = new Array(500).fill(0).map((item, index) => {
      return {
        id: index,
        name: `name-${index}`
      }
    })
  }, 2000)
})
function add100() {
  let list = []
  let length = tableList.value.length
  for (let i = 0; i < 100; i++) {
    list.push({
      id: length + i,
      name: `name-${length + i}`
    })
  }
  tableList.value = [...tableList.value, ...list]
}
</script>
<style lang="less" scoped>
.test-item {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: aqua;
}
</style>
