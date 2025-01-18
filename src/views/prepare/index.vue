<template>
  <div>
    <button @click.stop="console.log('globaldata', globalData)">globalData</button>
    <button @click.stop="doPrepareWork">去排料吧</button>
  </div>
  <div v-for="(item, index) in globalData" :key="index">
    <h1>{{ item.name }}</h1>
    <vxe-table :data="item.list" height="400">
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="materialCode" title="物料编码"></vxe-column>
      <vxe-column field="materialName" title="物料名称"></vxe-column>
      <vxe-column field="actualNeed" title="实际需要"></vxe-column>
      <vxe-column title="操作">
        <template #default="{ row }">
          <button @click.stop="openBatchSelectModal(item, row)">选择投料批次</button>
        </template>
      </vxe-column>
    </vxe-table>
  </div>

  <batchSelectModal ref="batchSelectModalRef" @submit="afterBatchSelect" />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { allData, getBatchForMaterial } from './data'
import batchSelectModal from './batch-select-modal.vue'

defineOptions({
  inheritAttrs: false
})

const globalData = ref(allData)
// provide("prepareMaterialGlobalData", globalData)

const batchSelectModalRef = ref(null)

/**
 *
 * @param item 选择的是哪个表格
 * @param row  选择的这个表格里的哪一行
 */
const openBatchSelectModal = (item, row) => {
  //   console.log('🚀 ~ openBatchSelectModal ~ args:', row)

  batchSelectModalRef.value?.open(item, row)
}

const afterBatchSelect = (tableItem, row, batchRecords) => {
  let targetTable = globalData.value.find((item) => item.id === tableItem.id)
  if (targetTable) {
    let targetRow = targetTable.list.find((item) => item.id === row.id)
    if (targetRow) {
      targetRow.batchRecords = batchRecords
    }
  }
}

const doPrepareWork = () => {
  let n = globalData.value.length
  // debugger
  for (let i = 0; i < n; i++) {
    let table = globalData.value[i]
    let m = table.list.length
    for (let j = 0; j < m; j++) {
      let row = table.list[j]
      if (!row.batchRecords || !row.batchRecords.length) {
        alert('存在未选择批次的数据' + table.name + ' ' + row.materialName)
        return
      }
    }
  }

  try {
    console.log('都选完批次了,可以尝试去配料了---------------')
    for (let i = 0; i < n; i++) {
      let table = globalData.value[i] // 某个表
      let m = table.list.length
      for (let j = 0; j < m; j++) {
        let row = table.list[j] // 某个料
        if (!row.配料方案) {
          row.配料方案 = []
        }
        let batchRecords = row.batchRecords // 这个料选中的批次
        let 总的实际需求量 = row.actualNeed // 这个料的实际需求量
        row.还需配的量 = 总的实际需求量
        while (row.还需配的量 > 0) {
          let 一配方量 = table.重量 * row.消耗系数
          let 还没用完的批次
          let k = 0 // 下面找方案时要用到这个序号
          for (; k < batchRecords.length; k++) {
            let 已经使用过的量 = batchRecords[k].已经使用过的量 || 0
            batchRecords[k].已经使用过的量 = 已经使用过的量
            let 剩余量 = batchRecords[k].库存 - batchRecords[k].已经使用过的量
            if (剩余量 > 0) {
              还没用完的批次 = batchRecords[k]
              break
            }
          }
          if (!还没用完的批次) {
            // 找了一圈，这个料的所有批次都没有剩余了
            throw new Error(
              `找了一圈，这个料${row.materialName}==${row.materialCode}的所有批次都没有剩余了,没法配了`
            )
          }
          // 找到一个可以使用的批次
          let 用这个批次一下子要加的量 =
            Math.ceil(一配方量 / 还没用完的批次.物料规格) * 还没用完的批次.物料规格
          let 这个批次的剩余量 = 还没用完的批次.库存 - 还没用完的批次.已经使用过的量
          if (这个批次的剩余量 >= 用这个批次一下子要加的量) {
            // 这个批次够用，可以往配料方案里加一条
            还没用完的批次.已经使用过的量 += 用这个批次一下子要加的量

            row.配料方案.push([
              {
                批次号: 还没用完的批次.批次号,
                加的量: 用这个批次一下子要加的量
              }
            ])
            row.还需配的量 -= 用这个批次一下子要加的量
          } else {
            // 这个批次不够用，要往下一个批次借
            if (k === batchRecords.length - 1) {
              // 这已经是最后一个批次了，没地方借了
              throw new Error(
                `当前这个批次${还没用完的批次.批次号}不够用，要往下借。但这个批次已经是这最后一个了，没地方借`
              )
            }
            let 要借的量 = 用这个批次一下子要加的量 - 这个批次的剩余量
            let 方案 = findSolution(row, k + 1, 要借的量)
            if (!方案) {
              console.log('当前行的数据', row)

              throw new Error(`这个批次${还没用完的批次.批次号}不够用，要往下借,但后面也不够借的`)
            }
            // 有方案，那加起来肯定够一配方，但因为考虑规格，可能比一配方还多
            还没用完的批次.已经使用过的量 = 还没用完的批次.库存 // 这个批次全用掉
            let 总的配料方案 = [
              { 批次号: 还没用完的批次.批次号, 加的量: 这个批次的剩余量 },
              ...方案
            ]
            let 总的配料方案能加的量 = 总的配料方案.reduce((total, item) => total + item.加的量, 0)
            row.还需配的量 -= 总的配料方案能加的量
            row.配料方案.push(总的配料方案)
          }
        }
      }
    }
    console.log('第一轮，按各自去排料结束了，排料结果')
    console.log(JSON.parse(JSON.stringify(globalData.value)))

    // 统计次数，将次数配平
    let 最多次数 = 0
    for (let tableItem of globalData.value) {
      let list = tableItem.list
      for (let row of list) {
        let 方案数 = row.配料方案.length
        if (方案数 > 最多次数) {
          最多次数 = 方案数
        }
      }
    }

    console.log('统计出最多次数', 最多次数)
    // 先将数据都还原，然后按照最多次数去重新配
    for (let tableItem of globalData.value) {
      let list = tableItem.list
      for (let row of list) {
        row.配料方案 = []
        row.还需配的量 = row.actualNeed
        row.batchRecords.forEach((item) => (item.已经使用过的量 = 0))
      }
    }

    for (let table of globalData.value) {
      let list = table.list
      for (let row of list) {
        // 要对row进行 最多次数 次的配料。如果配的过程中不够，那就throw error，整个过程结束
        // 如果不够，然后throw error，那就说明，虽然之前选批次的时候，各批次总量加起来够，但并不能满足配的要求

        let batchRecords = row.batchRecords // 这个料选中的批次
        for (let time = 0; time < 最多次数; time++) {
          let 一配方量 = table.重量 * row.消耗系数
          let 还没用完的批次
          let k = 0 // 下面找方案时要用到这个序号
          for (; k < batchRecords.length; k++) {
            let 已经使用过的量 = batchRecords[k].已经使用过的量 || 0
            batchRecords[k].已经使用过的量 = 已经使用过的量
            let 剩余量 = batchRecords[k].库存 - batchRecords[k].已经使用过的量
            if (剩余量 > 0) {
              还没用完的批次 = batchRecords[k]
              break
            }
          }
          if (!还没用完的批次) {
            // 找了一圈，这个料的所有批次都没有剩余了
            throw new Error(
              `找了一圈，这个料${row.materialName}==${row.materialCode}的所有批次都没有剩余了,没法配了`
            )
          }
          // 找到一个可以使用的批次
          let 用这个批次一下子要加的量 =
            Math.ceil(一配方量 / 还没用完的批次.物料规格) * 还没用完的批次.物料规格
          let 这个批次的剩余量 = 还没用完的批次.库存 - 还没用完的批次.已经使用过的量
          if (这个批次的剩余量 >= 用这个批次一下子要加的量) {
            // 这个批次够用，可以往配料方案里加一条
            还没用完的批次.已经使用过的量 += 用这个批次一下子要加的量

            row.配料方案.push([
              {
                批次号: 还没用完的批次.批次号,
                加的量: 用这个批次一下子要加的量
              }
            ])
          } else {
            // 这个批次不够用，要往下一个批次借
            if (k === batchRecords.length - 1) {
              // 这已经是最后一个批次了，没地方借了
              throw new Error(
                `当前这个批次${还没用完的批次.批次号}不够用，要往下借。但这个批次已经是这最后一个了，没地方借`
              )
            }
            let 要借的量 = 用这个批次一下子要加的量 - 这个批次的剩余量
            let 方案 = findSolution(row, k + 1, 要借的量)
            if (!方案) {
              console.log('当前行的数据', row)
              throw new Error(`这个批次${还没用完的批次.批次号}不够用，要往下借,但后面也不够借的`)
            }
            // 有方案，那加起来肯定够一配方，但因为考虑规格，可能比一配方还多
            还没用完的批次.已经使用过的量 = 还没用完的批次.库存 // 这个批次全用掉
            let 总的配料方案 = [
              { 批次号: 还没用完的批次.批次号, 加的量: 这个批次的剩余量 },
              ...方案
            ]
            // let 总的配料方案能加的量 = 总的配料方案.reduce((total, item) => total + item.加的量, 0)
            // row.还需配的量 -= 总的配料方案能加的量
            /**特别注意，在按次数配料时，不需要更新row的还需配的量，也不需要通过row还需配的量来判断是否继续 */
            /**因为当到了按次数这一步，是要求每个料必须配这么多次。如果料不够，那就报错 */
            row.配料方案.push(总的配料方案)
          }
        }
      }
    }

    console.log('最后的排料结果')
    console.log(JSON.parse(JSON.stringify(globalData.value)))
  } catch (error) {
    console.log(error)
    console.log('此时的数据',JSON.parse(JSON.stringify(globalData.value)))
  }
}

function findSolution(row, index, 要借的量) {
  let batchRecords = row.batchRecords // 这个料选中的批次
  let 要借的批次 = batchRecords[index]
  let 已经使用过的量 = 要借的批次.已经使用过的量 || 0
  要借的批次.已经使用过的量 = 已经使用过的量
  let 这个批次剩余的量 = 要借的批次.库存 - 要借的批次.已经使用过的量
  let 按规格借的量 = Math.ceil(要借的量 / 要借的批次.物料规格) * 要借的批次.物料规格
  if (这个批次剩余的量 >= 按规格借的量) {
    // 可以借
    要借的批次.已经使用过的量 += 按规格借的量
    return [
      {
        批次号: 要借的批次.批次号,
        加的量: 按规格借的量
      }
    ]
  }
  // 不够借的，那就往后面再借一次
  let nextIndex = index + 1
  if (nextIndex >= batchRecords.length) {
    // 已经是最后一条了，没地方借了
    return null
  }
  let 方案 = findSolution(row, nextIndex, 要借的量 - 这个批次剩余的量)
  if (!方案) {
    // 后面也不够借的
    return null
  }
  // 从后面借够了
  要借的批次.已经使用过的量 += 这个批次剩余的量 // 其实就是这个批次全用掉
  let 总方案 = [{ 批次号: 要借的批次.批次号, 加的量: 这个批次剩余的量 }, ...方案]
  return 总方案
}
</script>
