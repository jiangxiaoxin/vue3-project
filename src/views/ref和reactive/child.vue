<template>
    <el-input :model-value="value" @update:modelValue="update"/>
</template>

<script setup lang="ts">
import {ref} from "vue"

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    update: {
        type: Function,

    }
})
</script>