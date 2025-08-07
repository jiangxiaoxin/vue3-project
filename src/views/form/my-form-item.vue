<template>
    <a-form :model="formState" ref="formRef">
        <a-form-item label="Username" name="username"
            :rules="[{ required: true, message: 'Please input your username!', trigger: ['change', 'blur'] }]">
            <a-input v-model:value="formState.username" />
        </a-form-item>

        <!-- <a-form-item label="Password" name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item> -->
        <a-form-item label="msg" name="msg" :rules="[{ required: true, message: 'Please input your password!' }]">
            <div @click="openMsg" @blur="handleMsgBlur"
                style="min-width: 200px;min-height: 100px;border: 1px solid gray;cursor: pointer;" tabindex="0">
                <span>我是个普通的div</span>
                <div>{{ formState.msg }}</div>
            </div>
        </a-form-item>
    </a-form>
    <button @click="submit">submit</button>
    <a-modal v-model:open="open" title="Basic Modal">
        <a-input v-model:value="msg"></a-input>
        <button @click="close">close</button>
    </a-modal>
</template>
<script lang="ts" setup>
import { reactive, ref, nextTick, inject } from 'vue';

const formRef = ref()

const formState = reactive({
    username: '',
    password: '',
    msg: ""
});

// 注入 FormItem 的验证方法
const formItemContext = inject('FormItemInputContext', null);

// 处理 msg 字段的 blur 事件
const handleMsgBlur = () => {
    if (formItemContext?.onFieldBlur) {
        formItemContext.onFieldBlur()
    }
};

const submit = () => {
    formRef.value?.validate().then((res: any) => {
        console.log("🚀 ~ submit ~ res:", res)

    }).catch((error: any) => {
        console.log("🚀 ~ submit ~ error:", error)

    })
}


const msg = ref()
const open = ref(false)
const openMsg = () => {
    open.value = true
    msg.value = formState.msg
}

const close = () => {
    open.value = false
    formState.msg = msg.value

    // 方法1：使用 FormItem Context 触发验证（推荐）
    nextTick(() => {
        if (formItemContext?.onFieldChange) {
            formItemContext.onFieldChange()
        } else {
            // 降级方案：手动触发表单验证
            formRef.value?.validateFields(['msg'])
        }
    })
}


</script>