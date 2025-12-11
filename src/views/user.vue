<template>
<div>id: {{ route.params.id }}</div>

<input type="text" v-model="text">

<h1>{{ text }}</h1>

</template>

<script setup lang="ts">
import {onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted, ref} from "vue"
import {useRouter, useRoute} from "vue-router"

const router = useRouter()
const route = useRoute()
const text  =ref("")

onMounted(() => {
    console.log("user mounted", route.params.id);
    
})

onBeforeUnmount(() => {
    console.log("user nBeforeUnmount", route.params.id);
})

onUnmounted(() => {
    console.log("user unmount", route.params.id);
    
})

onActivated(() => {
    console.log('activated');
    
})

onDeactivated(() => {
    console.log('deactivated');
    
})

</script>