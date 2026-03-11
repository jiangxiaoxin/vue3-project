<template>
    <div>{{ inputvalue }}</div>
    <child :value="inputvalue" :update="updateValue"/>
</template>

<script setup lang="ts">
import {ref} from "vue"
import child from "./child.vue"

const inputvalue = ref("hello")

const updateValue = (str) => {
    console.log('能调到', str);
    inputvalue.value = str;
    
}
</script>