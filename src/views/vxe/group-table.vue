<template>
  <div style="display: flex;">
    <!-- <div style="width: 50%;">
      {{ JSON.stringify(tableData, null, 2) }}
    </div> -->
    <!-- <div style="width: 50%;">
      {{ JSON.stringify(groupTableData, null, 2) }}
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const tableData = [
  {
    id: 1,
    name: '1',
    gender: 1,
    score: 85,
    city: '北京'
  },
  {
    id: 2,
    name: '1',
    gender: 2,
    score: 72,
    city: '上海'
  },
  {
    id: 3,
    name: '3',
    gender: 1,
    score: 94,
    city: '广州'
  },
  {
    id: 4,
    name: '3',
    gender: 2,
    score: 63,
    city: '深圳'
  },
  {
    id: 5,
    name: '3',
    gender: 1,
    score: 78,
    city: '杭州'
  },
  {
    id: 6,
    name: '3',
    gender: 2,
    score: 91,
    city: '南京'
  },
  {
    id: 7,
    name: '7',
    gender: 1,
    score: 56,
    city: '成都'
  },
  {
    id: 8,
    name: '8',
    gender: 2,
    score: 89,
    city: '武汉'
  },
  {
    id: 9,
    name: '9',
    gender: 1,
    score: 47,
    city: '西安'
  },
  {
    id: 10,
    name: '10',
    gender: 2,
    score: 82,
    city: '重庆'
  }
]

function tableGroupByField(table, field) {
  const map = {}
  for (let i = 0; i < table.length; i++) {
    let row = table[i]
    let val = row[field]
    if (!map[val]) {
      map[val] = []
    }
    map[val].push(row)
  }
  console.log('map', map);




  let result = []
  for (let key in map) {
    let children = map[key]
    let virtual = {
      field: field,
      type: 'group',
      total: children.length,
      children
    }
    result.push(virtual)
    // result = result.concat(...children)
  }
  return result
}

// const result = tableGroupByField(tableData, 'name')
// console.log(JSON.stringify(result, null, 2))

const multiGroupResult = doGroupByFields(tableData, ['name', 'gender'])
// console.log(JSON.stringify(multiGroupResult, null, 2))

const flatResult = flatArray(multiGroupResult)
console.log('flat', JSON.stringify(flatResult, null, 2))





function doGroupByFields(table: any[], fields: string[]): any[] {
  if (!fields || fields.length === 0) {
    return table
  }

  function groupRecursively(data: any[], remainingFields: string[]): any[] {
    if (remainingFields.length === 0) {
      return data
    }

    const [currentField, ...nextFields] = remainingFields
    const grouped = tableGroupByField(data, currentField)

    if (nextFields.length > 0) {
      return grouped.map(group => ({
        ...group,
        children: groupRecursively(group.children, nextFields)
      }))
    }

    return grouped
  }

  return groupRecursively(table, fields)
}

function flatArray(groupedData: any[]): any[] {
  const result: any[] = []

  function extractDataItems(data: any[]) {
    for (const item of data) {
      if (item.type === 'group') {
        if (item.children && item.children.length > 0) {
          extractDataItems(item.children)
        }
      } else {
        result.push(item)
      }
    }
  }

  extractDataItems(groupedData)
  return result
}



</script>