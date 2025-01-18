<template>
  <vxe-modal
    ref="modalRef"
    title="选择批次"
    show-footer
    fullscreen
    show-zoom
    resize
    width="800"
    height="600"
    @close="afterClose"
  >
    <vxe-table
      height="auto"
      :data="batchTableData"
      :checkbox-config="{ trigger: 'row' }"
      ref="tableRef"
    >
      <vxe-column type="checkbox" width="40" fixed="left"></vxe-column>
      <vxe-column type="seq" width="60" title="序号"></vxe-column>
      <vxe-column field="批次号" title="批次号"></vxe-column>
      <vxe-column field="物料规格" title="物料规格"></vxe-column>
      <vxe-column field="库存" title="库存"></vxe-column>
    </vxe-table>

    <template #footer>
      <button @click.stop="submit">确定</button>
    </template>
  </vxe-modal>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { getBatchForMaterial } from './data'

const modalRef = ref(null)
const tableRef = ref(null)
const emits = defineEmits(['submit'])
const parentTable = ref()
const rowData = ref({})
const batchTableData = ref<any[]>([])

defineExpose({
  open: (table, row) => {
    parentTable.value = table
    rowData.value = row
    modalRef.value?.open()
    batchTableData.value = getBatchForMaterial(row.materialCode)
  }
})

const submit = () => {
  let records = tableRef.value?.getCheckboxRecords()
//   console.log('🚀 ~ submit ~ records:', records)
  let 该物料实际需要 = rowData.value?.actualNeed
  let 选中的总库存量 = records.reduce((total, item) => total + item.库存, 0)
  if (该物料实际需要 > 选中的总库存量) {
    alert('选中的库存量不足，请重新选')
    return
  }

  emits('submit', parentTable.value, rowData.value, records)
  modalRef.value?.close()
  nextTick(() => {
    afterClose()
  })
}

const afterClose = () => {
    // console.log("afterClose");
    
  rowData.value = {}
  batchTableData.value = []
}
</script>
