<template>
    <div>
      <vxe-table
        show-footer
        border
        height="300"
        :column-config="{minWidth: 200}"
        :data="tableData"
        :footer-data="footerData">
        <vxe-column field="seq" type="seq" width="70" fixed='left'>
          <template #footer="{ row }">
            <span style="color: blue;">{{ row.seq }}</span>
          </template>
        </vxe-column>
        <vxe-column field="name" title="Name" fixed='left'></vxe-column>
        <vxe-column field="role" title="Role"></vxe-column>
        <vxe-column field="sex" title="Sex">
            <template #footer="{ row }">
                <!-- <div @click="() => console.log(row)">{{ row.sex }}</div> -->
                <div >台数{{ row.sex[0] }}元</div>
                <div >容量{{ row.sex[1] }}元</div>
            </template>
        </vxe-column>
        <vxe-column field="num" title="Num">
          <template #footer="{ row }">
            <span style="color: red;">￥000===={{ row.num }}元</span>
          </template>
        </vxe-column>
        <vxe-column field="address" title="Address" show-overflow></vxe-column>
        <vxe-column field="num1" title="Num"></vxe-column>
        <vxe-column field="num2" title="Num"></vxe-column>
        <vxe-column field="num3" title="Num"></vxe-column>
        <vxe-column field="num4" title="Num"></vxe-column>
        <vxe-column field="num5" title="Num"></vxe-column>
        <vxe-column field="num6" title="Num"></vxe-column>
        <vxe-column field="num7" title="Num"></vxe-column>
        <vxe-column field="num8" title="Num"></vxe-column>
        <vxe-column field="num9" title="Num"></vxe-column>
        
      </vxe-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const tableData = ref([
    { id: '10001', name: 'Test1', role: 'Develop', sex: 'Man', num: '28', address: 'test abc' },
    { id: '10002', name: 'Test2', role: 'Test', sex: 'Women', num: '22', address: 'Guangzhou' },
    { id: '10003', name: 'Test3', role: 'PM', sex: 'Man', num: '32', address: 'Shanghai' },
    { id: '10004', name: 'Test4', role: 'Designer', sex: 'Women', num: '24', address: 'Shanghai' },
    { id: '10005', name: 'Test5', role: 'Develop', sex: 'Man', num: '42', address: 'Guangzhou' },
    { id: '10006', name: 'Test6', role: 'Test', sex: 'Women', num: '39', address: 'Shanghai' },
    { id: '10007', name: 'Test7', role: 'Develop', sex: 'Man', num: '46', address: 'Shanghai' },
    { id: '10008', name: 'Test8', role: 'PM', sex: 'Women', num: '49', address: 'Guangzhou' }
  ])
  const footerData = ref([
    { seq: '合计', num: '282', sex: [101,202] },
    // { seq: '平均', num: '2.88' }
  ])
  
  </script>
  