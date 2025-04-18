<template>
    <div>voices</div>
    <div v-for="(item,index) in voices" :key="index">
        {{ item.name }}
    </div>
    <div>--------</div>
    <div>{{ voices }}</div>


    <div>=============</div>
    <div>api:{{ api }}</div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const voices = ref<any[]>([])

const api = ref()

onMounted(() => {
    setTimeout(() => {
        voices.value = window.speechSynthesis.getVoices()
        console.log(voices.value);

        if(window.speechSynthesis) {
            api.value = true
        } else {
            api.value = false
        }
        
    }, 5000);
})

</script>