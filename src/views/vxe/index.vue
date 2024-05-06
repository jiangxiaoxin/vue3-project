<template>
  <div>
    <vxe-table
      border
      :column-config="{ resizable: true }"
      :scroll-y="{ enabled: false }"
      :data="tableData"
      :span-method="mergeRowMethod1"
    >
      <vxe-column field="id" title="idddd"></vxe-column>
      <vxe-column field="fkey" title="Key"></vxe-column>
      <vxe-column field="content" title="Translate"></vxe-column>
      <vxe-column field="language" title="Language" :filters="languageOptions"></vxe-column>
    </vxe-table>

    <vxe-table
      border
      :column-config="{ resizable: true }"
      :scroll-y="{ enabled: false }"
      :data="tableData"
      :span-method="mergeRowMethod2"
    >
      <!-- <vxe-column field="id" title="idddd"></vxe-column> -->
      <vxe-column field="fkey" title="Key"></vxe-column>
      <vxe-column field="content" title="Translate"></vxe-column>
      <vxe-column field="language" title="Language" :filters="languageOptions"></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tableData = ref([
  { id: 10001, fkey: 'app.label.name', content: '名称', language: 'zh_CN' },
  { id: 10002, fkey: 'app.label.name', content: 'Name', language: 'en_US' },
  { id: 10003, fkey: 'app.label.sex', content: 'Sex', language: 'zh_CN' },
  { id: 10004, fkey: 'app.label.sex', content: 'Sex', language: 'en_US' },
  { id: 100041, fkey: 'app.label.sex', content: 'Sex', language: 'en_US' },
  { id: 10005, fkey: 'app.label.age', content: '年龄', language: 'zh_CN' }
  // { id: 10006, fkey: 'app.label.age', content: 'Age', language: 'en_US' },
  // { id: 10007, fkey: 'app.label.role', content: '角色', language: 'zh_CN' },
  // { id: 10008, fkey: 'app.label.role', content: 'Role', language: 'en_US' },
  // { id: 10009, fkey: 'app.label.address', content: '地址', language: 'zh_CN' },
  // { id: 10010, fkey: 'app.label.address', content: 'Address', language: 'en_US' },
  // { id: 10011, fkey: 'app.label.nickname', content: '昵称', language: 'zh_CN' },
  // { id: 10012, fkey: 'app.label.nickname', content: 'Nickname', language: 'en_US' },
  // { id: 200, fkey: 'app.label.nickname123', content: 'Nickname123', language: 'en_US' }
])
const languageOptions = ref([
  { label: '中文', value: 'zh_CN' },
  { label: 'English', value: 'en_US' }
])
// 通用行合并函数（将相同多列数据合并为一行）
const mergeRowMethod1 = ({ row, _rowIndex, column, visibleData }) => {
  if (_rowIndex === 0 && column.property === 'fkey') {
    return { rowspan: 2, colspan: 1 }
  } else if (_rowIndex === 1 && column.property === 'fkey') {
    return { rowspan: 0, colspan: 1 }
  } else if (_rowIndex === 2 && column.property === 'content') {
    return { rowspan: 3, colspan: 1 }
  } else if (_rowIndex === 3 && column.property === 'content') {
    return { rowspan: 0, colspan: 1 }
  } else if (_rowIndex === 4 && column.property === 'content') {
    return { rowspan: 0, colspan: 1 }
  }

  return { rowspan: 1, colspan: 1 }
}

const mergeRowMethod2 = ({ row, _rowIndex, column, visibleData }) => {
  const fields = ['fkey']
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    // 超界直接访问是不会报错的
    // 报错是因为拿着直接用，访问数据了
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
}
</script>
