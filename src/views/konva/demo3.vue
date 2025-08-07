<template>
    <a-dropdown :trigger="['contextmenu']">
        <div style="background-color: red;">
            <div class="container" id="cc" style="width: 1000px;height: 500px;background-color: bisque;margin: auto;">
            </div>
        </div>
        <template #overlay>
            <a-menu>
                <a-menu-item key="1">1st menu item</a-menu-item>
                <a-menu-item key="2">2nd menu item</a-menu-item>
                <a-menu-item key="3">3rd menu item</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script setup lang="ts">

import { onMounted, nextTick } from 'vue';
import Konva from 'konva'
import { getRandomColor } from './utils'

onMounted(() => {
    nextTick(() => {
        init()
    })
})

function init() {
    const stage = new Konva.Stage({
        container: 'cc',
        width: 1000,
        height: 500
    })
    stage.on('click', (e) => {
        // alert(1)
    })
    
}
</script>