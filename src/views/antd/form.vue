<template>
  <a-form :model="queryForm.form">
    <a-row :gutter="4">
      <a-col span="6">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6" style="background-color: green">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="6">
        <div class="btns">
          <span class="code365-table-page-search-buttons">
            <a-button type="primary" size="small" class="top-search-btn" @click="onTableSearch">
              <Code365Icon icon="SearchOutlined" />
              {{ '查询' }}
            </a-button>
            <a-button size="small" class="top-reset-btn" @click="onTableReload">
              <Code365Icon icon="redo-outlined" />
              {{ '重置' }}
            </a-button>
          </span>
        </div>
      </a-col>
      <a-col span="6">
        <div
          style="
            width: 100%;
            height: 100%;
            background-color: aqua;
            padding-top: 4px;
            text-align: right;
          "
        >
          <a-button type="primary" size="small" class="top-search-btn" @click="onTableSearch">
            <Code365Icon icon="SearchOutlined" />
            {{ '查询' }}
          </a-button>
          <a-button size="small" class="top-reset-btn" @click="onTableReload">
            <Code365Icon icon="redo-outlined" />
            {{ '重置' }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </a-form>
  <div class="foo">
    <div class="bar"></div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const queryForm = reactive({
  form: {
    name: '',
    alias: ''
  }
})

const onTableSearch = () => {}
const onTableReload = () => {}
</script>

<style lang="less" scoped>
.foo {
  width: 200px;
  display: flex;
  align-items: center;
  min-height: 50px;
  background-color: red;

  .bar {
    display: block;
    max-width: 100%;
    flex: auto;
    background: blue;
    height: 100px;
  }
}

.btns {
  width: 100%;
  height: 100%;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    flex: auto;
  }

  button + button {
    margin-left: 4px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
