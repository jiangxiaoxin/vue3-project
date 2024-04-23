<template>
  <div class="table-template-wrapper">
    <div class="table-template_form">
      <a-form :model="formState" :labelCol="{ style: 'width:100px;text-align: left' }" size="small">
        <a-row :gutter="4">
          <a-col :span="6">
            <a-form-item label="物料名称" name="materialName">
              <a-input v-model:value="formState.materialName" placeholder="物料名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="物料编码" name="materialCode">
              <a-input v-model:value="formState.materialCode" placeholder="物料编码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="物料类型" name="materialType">
              <a-select
                v-model:value="formState.materialType"
                placeholder="物料类型"
                :options="materialTypeOptions"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" v-show="showMore">
            <a-form-item label="生产时间" name="createTime">
              <a-range-picker v-model:value="formState.createTime" /> </a-form-item
          ></a-col>

          <a-col :span="6" v-show="showMore">
            <a-form-item label="创建人" name="creator">
              <a-input v-model:value="formState.creator" placeholder="创建人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item class="custom-action-wrapper">
              <a-space>
                <a-button type="primary" @click="hackSearch">查询</a-button>
                <a-button>重置</a-button>
                <a-button @click="showMore = !showMore">更多</a-button>
                <a-button type="primary" @click="addOne">新增</a-button>
                <a-button @click="addStep">步骤条</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-template_table">
      <vxe-table
        ref="tableRef"
        :data="tableData"
        border
        size="mini"
        :row-config="{ isHover: true }"
        height="auto"
      >
        <vxe-column type="seq" width="60" fixed="left"></vxe-column>
        <vxe-column field="materialName" title="物料名称"> </vxe-column>
        <vxe-column field="year" title="年"></vxe-column>
        <vxe-column field="month" title="月"></vxe-column>
        <vxe-column field="electricCharge" title="电费"></vxe-column>
        <vxe-column field="electricCharge" title="电费"></vxe-column>
        <vxe-column field="electricCharge" title="电费"></vxe-column>
        <vxe-column field="electricCharge" title="电费"></vxe-column>
        <vxe-column field="electricCharge" title="电费"></vxe-column>
        <vxe-column title="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <a-button type="link" @click="viewOne(row)">查看</a-button>
            <a-button type="link" @click="editOne(row)">编辑</a-button>
            <a-button type="link" @click="deleteOne(row)">删除</a-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="table-template_pagination">
      <a-pagination
        v-model:current="page.pageNum"
        v-model:pageSize="page.pageSize"
        :pageSizeOptions="pagination.options"
        :show-total="pagination.showTotal"
        :total="page.total"
        show-size-changer
        size="small"
        @change="tablePageChange"
        @showSizeChange="tablePageChange"
      />
    </div>

    <MaterialModal ref="materialModalRef" @success="refrshAfterSuccess" />
    <StepModal ref="stepRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import MaterialModal from './modal.vue'
import { ModeEnum } from './config'
import StepModal from './stepNormal/index.vue'

const materialModalRef = ref(null)
const stepRef = ref(null)

const showMore = ref(false)

const formState = reactive({
  materialName: '',
  materialCode: '',
  materialType: '',
  createTime: [],
  creator: ''
})

const materialTypeOptions = ref<any[]>([])
const tableData = ref<any[]>([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})

const pagination = {
  options: ['10', '20', '30', '50'],
  showTotal: (total) => `共 ${total} 条`
}

const fetchMaterialTypeOptions = () => {
  Promise.resolve().then(() => {
    setTimeout(() => {
      let types = []
      for (let i = 0; i < 10; i++) {
        types.push({
          value: i + 1,
          label: '物料类型' + (i + 1)
        })
      }
      materialTypeOptions.value = types
    }, 2000)
  })
}

const fetchTableData = () => {
  Promise.resolve().then(() => {
    setTimeout(() => {
      let data = []
      let id = Math.ceil(Math.random() * 100)
      for (let i = id; i < id + parseInt(formState.materialName || '10'); i++) {
        data.push({
          id: i,
          materialName: '物料名称' + i,
          materialCode: '物料编码' + i,
          materialType: '物料类型' + i,
          year: '2023',
          month: '01',
          electricCharge: '1000',
          desc: '123123123',
          startTime: '2020-12-23',
          endTime: '2023-12-11',
          status: 1
        })
      }
      tableData.value = data
      page.total = data.length
    }, 2000)
  })
}

fetchMaterialTypeOptions()
fetchTableData()

const tablePageChange = (pageNum: number, pageSize: number) => {
  page.pageNum = pageNum
  page.pageSize = pageSize
  fetchTableData()
}

const hackSearch = () => {
  page.pageNum = 1
  console.log('serach', formState)
  fetchTableData()
}

const addOne = () => {
  materialModalRef.value?.open(null, ModeEnum.add)
}
const editOne = (row) => {
  materialModalRef.value?.open(row, ModeEnum.edit)
}

const viewOne = (row) => {
  materialModalRef.value?.open(row, ModeEnum.view)
}
const deleteOne = (row) => {}

const refrshAfterSuccess = () => {
  hackSearch()
}

const addStep = () => {
  stepRef.value?.open({
    name: 'aaaa',
    code: 'bbbb',
    desc: 'ccccc'
  })
}
</script>
<style lang="less">
.table-template-wrapper {
  //   width: 1200px;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .table-template_form > form > .ant-row > .ant-col:last-child {
    text-align: right !important;
  }

  .table-template_form > form > .ant-row > .ant-col > .ant-form-item {
    margin-bottom: 4px !important;
  }

  .table-template_form {
    // height: 100px;
    margin-top: 4px;
  }

  .table-template_table {
    flex: 1;
    // background: blue;
    overflow: auto;
  }

  .table-template_pagination {
    padding: 10px 0;
    text-align: center;
  }
}
</style>
