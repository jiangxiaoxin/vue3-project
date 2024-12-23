<template>
    <div class="container" @scroll="handleScroll" :data-size="pageSize" ref="containerRef">
        <div class="list" :style="listStyle">
            <div class="list-item" v-for="item in showList" :key="item.id" :data-id="item.id" ref="listItemRef">
                <div>id: {{ item.id }}--- name: {{ item.name }}</div>
            </div>
            <!-- <div class="cover-bg" :style="coverBgStyle"></div> -->
        </div>
    </div>
    <div style="background-color: bisque;">
        <span>length: {{ tableList.length }}</span>
        <button @click="add100">add100</button>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref , reactive} from "vue"

/**
 * 通过height 和 translateY 来实现虚拟列表滚动，
 * 本质是计算好showList的数据后，再计算外层容器内，从此时startIndex开始到整个列表的数据条数，就得出了整个高度，但整个高度并不是容器的全部高度，还要对startIndex 之前的数据进行一个高度计算，这样前面的高度做translateY，再加上个height，就是整个容器的高度
 */

/**
 * 每隔 wait 毫秒执行一次 func
 * 通过timeout来实现，如果再次运行，发现timeout还在，那说明，已经准备好执行一次了，本次就先不考虑，等已经安排好的这次执行了，再重新安排下一次
 */
function throttle(func, wait) {
    let timeout
    return function() {
        const context = this;
        const args = arguments;
        if(!timeout) {
            timeout = setTimeout(() => {
                func.apply(context, args)
                clearTimeout(timeout)
                timeout = 0
            }, wait)
        }
    }
}

const tableList = ref<any[]>([])

const coverBgStyle = computed(() => {
    return {
        height: itemHeight * tableList.value.length + 'px'
    }
})

function add100() {
    let list = []
    let length = tableList.value.length
    for(let i=0;i<100;i++) {
        list.push({
            id: length + i,
            name: `name-${length + i}`
        })
    }
    tableList.value = [...tableList.value, ...list]
}

const containerRef = ref<HTMLDivElement>()

const info = reactive({
    startIndex: 0,
    endIndex: 100
})

const itemHeight = 60
const safeArea = 10

const pageSize = computed(() => {
    if(containerRef.value) {
        return Math.ceil(containerRef.value.getBoundingClientRect().height / itemHeight) + 2 * safeArea
    }
    return 10 // 默认值
})

const showList = computed(() => {
    return tableList.value.slice(info.startIndex, info.endIndex)
})

const listStyle = computed(() => {
    return {
        height: `${(tableList.value.length-info.startIndex) * itemHeight}px`,
        transform: `translateY(${info.startIndex * itemHeight}px)`
    }
})

const handleScroll = throttle((e: Event) => {
    const scrollTop = (e.target as HTMLElement)?.scrollTop
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - safeArea)
    const endIndex = Math.min(startIndex + pageSize.value, tableList.value.length)
    info.startIndex = startIndex
    info.endIndex = endIndex

    // console.log('startIndex:', startIndex, 'endIndex:', endIndex, 'scrollTop:', scrollTop);
    
}, 100)
 

onMounted(() => {
    setTimeout(() => {
        tableList.value = new Array(500).fill(0).map((item, index) => {
        return {
            id: index,
            name: `name-${index}`
        }
    })
    }, 2000);
})
</script>
<style lang="less" scoped>
.container {
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: red;

    .list {
        position: relative;
        background-color: green;
    }

    .list-item {
        height: 60px;
        background-color: blue;
    }

    // .cover-bg {
    //     background: green;
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     bottom: 0;
    //     z-index: -1;
    // }
}

</style>