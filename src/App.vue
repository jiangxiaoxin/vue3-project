<template>
  <bar />
  <a-checkbox
    :checked="state.checkAll"
    :indeterminate="state.indeterminate"
    @change="onCheckAllChange"
    >全选</a-checkbox
  >

  <div>{{ checkedList }}</div>

  <a-checkbox
    v-for="item in visbleList"
    :key="item"
    :checked="checkedList.includes(item)"
    @change="(e) => checkedListChange(e, item)"
    >{{ item }}</a-checkbox
  >

  <a-input v-model:value="searchValue"></a-input>

  <!-- <requiredProp /> -->
  <!-- <formItemRest /> -->
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import requiredProp from './views/props/required-prop.vue'
import formItemRest from './views/antd/form-item-rest.vue'
import bar from './views/echart/bar.vue'
const foo = ref('foo000')

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const searchValue = ref('')

const visbleList = computed(() => {
  return list.filter((i) => i.toString().includes(searchValue.value))
})

const state = reactive({
  indeterminate: false,
  checkAll: false
})

const checkedList = ref([])

const checkedListChange = (e, item) => {
  if (e.target.checked) {
    checkedList.value.push(item)
  } else {
    let temp = checkedList.value.filter((i) => i !== item)
    checkedList.value = JSON.parse(JSON.stringify(temp))
  }
}

const onCheckAllChange = (e) => {
  if (e.target.checked) {
    checkedList.value = JSON.parse(JSON.stringify(list))
  } else {
    checkedList.value = []
  }
}

watch(
  checkedList,
  (newVal) => {
    state.indeterminate = !!newVal.length && newVal.length < list.length
    state.checkAll = newVal.length === list.length
  },
  { immediate: true, deep: true }
)
</script>
