<template>
    <div>
        {{ info }}
    </div>
</template>

<script setup>
import {slotConfig} from "./config"
import { ref } from 'vue'
const info = ref(slotConfig)
console.log('iiii', info.value, slotConfig)
</script>