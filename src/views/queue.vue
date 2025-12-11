<template>
    <button @click="scan">扫码</button>
    <button @click="scan15">15</button>
    <div v-container>
        <h1>队列::{{ queue.length }}</h1>
        <div v-for="item in queue" :key="item">
            {{ item }}
        </div>
    </div>
    <div v-container>
        <h1>结果::{{ result.length }}</h1>
        <div v-for="item in result" :key="item.id">
            {{ item.id }}---
            {{ item.name }}---
            {{ item.time }}
        </div>
    </div>
    <div v-container>
        <h1>分组::{{ group.length }}</h1>
        <div v-for="(g, gi) in group" :key="gi" v-container>
            <h3>Group {{ gi + 1 }} ({{ g.length }})</h3>
            <div v-for="row in g" :key="row.id">
                {{ row.id }}---
                {{ row.name }}---
                {{ row.time }}
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
const queue = ref<any[]>([])
const result = ref<any[]>([])

const group = ref<any[][]>([])
let id = 0
const fetching = ref(false)
const scan = () => {
    queue.value.push(id++)
    checkToFetch()
}

const scan15 = () => {
    for(let i = 0; i < 15; i++) {
        queue.value.push(id++)
    }
    checkToFetch()
}

const getDetailById = (id: number) => {
    return new Promise((resolve) => {
        const timeout = Math.max(1000, Math.ceil(Math.random() * 2000))
        setTimeout(() => {
            resolve({
                id,
                name: 'name' + id,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
        }, timeout)
    })
}

const checkToFetch = () => {
    if (fetching.value) return
    if (queue.value.length === 0) return
    const id = queue.value.shift()
    fetching.value = true
    getDetailById(id).then((res) => {
        console.log("res", res)
        result.value.push(res)
        fetching.value = false
        if (result.value.length === 5) {
            // 将当前 result 的 5 个元素作为一个分组推入 group，并清空 result
            group.value.push(result.value.slice())
            result.value = []
        }
    }).then(() => {
        console.log('2级then');
        return checkToPack()
    }).catch(() => {
        // 不考虑出错的情况
        fetching.value = false
    }).then(() => {
        console.log('error 后then');
        return checkToFetch()
    })
}

const checkToPack = () => {
    console.log('checkToPack');

    return new Promise((resolve) => {
        setTimeout(() => {
            if (group.value.length) {
                const g = group.value.shift()
                console.log('ggggg pack00000000000', g)
                resolve(true)
            } else {
                resolve(false)
            }
        }, 1000)
    })
}


</script>