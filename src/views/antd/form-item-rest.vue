<template>
  <div v-container>
    <a-form
      :model="formState"
      ref="formRef"
      :labelCol="{ style: { width: '80px' } }"
      :rules="rules"
    >
      <a-form-item label="name" name="name">
        <a-input v-model:value="formState.name"></a-input>
      </a-form-item>
      <!-- <a-form-item label="age" name="age">
        <a-form-item-rest>
          <a-input v-model:value="formState.age" placeholder="age"></a-input>
        </a-form-item-rest>
        <a-form-item-rest>
          <a-input v-model:value="formState.address" placeholder="address"></a-input>
        </a-form-item-rest>
      </a-form-item> -->

      <!-- <a-form-item label="address" name="address">
        <a-input v-model:value="formState.address"></a-input>
      </a-form-item> -->

      <!-- 虽然可以正常的显示，输入，校验，绑定到formState上，但address会样式上作为age的内元素，而不是同级元素，所以还是不行 -->
      <!-- <a-form-item label="age" name="age">
        <a-input v-model:value="formState.age" placeholder="age"></a-input>
        <a-form-item label="address" name="address">
          <a-input v-model:value="formState.address"></a-input>
        </a-form-item>
      </a-form-item> -->
    </a-form>
  </div>
  <button @click="submit">提交</button>
  <div v-container>{{ JSON.stringify(formState, null, 4) }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref<any>(null)
const formState = ref({
  name: '',
  age: '',
  address: ''
})

const rules = {
  age: [{ required: true, message: 'age必填' }],
  address: [{ required: true, message: '来个验证' }]
}

const submit = () => {
  formRef.value
    ?.validate()
    .then((res) => {
      console.log('success', res)
      console.log('formState', formState.value)
    })
    .catch((err) => {
      console.log('error', err)
    })
}
</script>
