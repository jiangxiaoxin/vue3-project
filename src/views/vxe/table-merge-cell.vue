<template>
    <h1>编辑table，同步更新别的列</h1>
    <button @click="() => console.log('--', tableData)">tabledata</button>
    <vxe-table border height="auto" :data="tableData" :span-method="rowspanMethod" :edit-config="{trigger: 'click', mode: 'cell'}">
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="module" title="模块" width="100"></vxe-column>
        <vxe-column field="lv1" title="一级分类" width="100"></vxe-column>
        <vxe-column field="lv2" title="二级分类" width="100"></vxe-column>
        <vxe-column field="bz" title="标准" width="100"></vxe-column>
        <vxe-column field="kou" title="扣分" width="100" :edit-render="{}">
            <template #edit="{ row }">
                <a-input v-model:value="row.kou" type="number" placeholder="请输入扣分" @blur="() => row.bz = '同步' + row.kou"></a-input>
            </template>
        </vxe-column>
        <vxe-column field="total" title="总分" width="100"></vxe-column>
        <vxe-column field="percent" title="百分比" width="100"></vxe-column>
    </vxe-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tableData = ref([
    {
        module: '氨系统',
        lv1: '氨探头报警',
        lv2: '一级(25ppm)',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {
        module: '氨系统',
        lv1: '氨探头报警',
        lv2: '2级(25ppm)',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {
        module: '氨系统',
        lv1: '氨探头报警',
        lv2: '3级(25ppm)',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {

        module: '氨系统',
        lv1: '高储罐液位报警',
        lv2: '超高液位（90%）',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {

        module: '氨系统',
        lv1: '高储罐液位报警',
        lv2: '高液位（80%）',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {

        module: '二氧化碳',
        lv1: '二氧化碳报警',
        lv2: '高液位（70%）',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {

        module: '二氧化碳',
        lv1: '信号大连',
        lv2: '高液位（50%）',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    },
    {

        module: '安全',
        lv1: '安全进入告警',
        lv2: '高液位（10%）',
        bz: '100',
        kou: 100,
        total: 100,
        percent: 100
    }
])

const rowspanMethod = ({ row, _rowIndex, column, visibleData }) => {
  let fields = ['module', 'lv1']
  let cellValue = row[column.field]
  if (fields.includes(column.field) && cellValue) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }


  fields = ['total', 'percent']
  if (fields.includes(column.field) && cellValue) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow['module'] === row['module']) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow['module'] === row['module']) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
  
}

</script>