<template>
  <button @click="exportData">export</button>
  <vxe-grid ref="gridRef" v-bind="gridOptions"></vxe-grid>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const gridRef = ref()
const gridOptions = reactive({
  exportConfig: {
    type: 'xlsx'
  },
  columns: [
    { type: 'seq', width: 70 },
    { field: 'name', title: 'Name' },
    { field: 'sex', title: 'Sex' },
    { field: 'no1', title: 'NO1' },
    { field: 'no2', title: 'NO2 String', cellType: 'string' }
  ],
  data: [
    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', no1: '028', no2: '028' },
    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', no1: '220', no2: '220' },
    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', no1: '003200', no2: '003200' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', no1: '02040', no2: '02040' }
  ]
})
const exportData = () => {
  const $grid = gridRef.value
  if ($grid) {
    $grid.openExport()
    // $grid.exportData({
    //   type: 'xlsx'
    // })
  }
}
</script>
