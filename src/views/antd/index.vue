<template>
  <a-form layout="inline" :model="queryForm.form">
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item name="name" label="名称">
      <a-input v-model:value="queryForm.form.name" allowClear size="small"></a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" size="small">123123123</a-button>
      <a-button type="default" size="small">123123123</a-button>
    </a-form-item>
    <!-- <a-row>
      <a-col span="4">
        
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4">
        <a-form-item name="alias" label="别名">
          <a-input v-model:value="queryForm.form.alias" allowClear size="small"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="4" :offset="0">
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
      </a-col>
    </a-row> -->
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
</style>
