<template>
    <div v-container>
        <h2>扫码队列模拟</h2>
        <div>
            <button @click="scan">扫码1次</button>
            <button @click="() => scanN(5)">扫码5次</button>
            <button @click="() => scanN(15)">扫码15次</button>
            <button @click="() => scanN(23)">扫码23次</button>
            <span style="margin-left: 12px">失败概率：{{ (failRate * 100).toFixed(0) }}%</span>
            <input type="range" min="0" max="0.8" step="0.05" v-model.number="failRate" style="width: 160px; vertical-align: middle; margin-left: 8px" />
        </div>

        <div style="margin-top: 12px">
            <strong>队列(待拉取详情)</strong>：{{ queue.length }}
        </div>

        <div style="margin-top: 12px">
            <strong>当前未打包详情数</strong>：{{ result.length }}
            <strong>已打包但尚未成功发送的数量</strong>：{{ packReadyCount }}
            <Table :columns="columns" :data-source="result" :pagination="false" rowKey="id" />
        </div>

        <div style="margin-top: 12px">
            <strong>待发送分组</strong>：{{ groupQueue.length }}
            <div v-for="(g, gi) in groupQueue" :key="'gq'+gi" style="padding: 6px 8px; border: 1px dashed #999; margin: 6px 0">
                <div>分组 {{ gi + 1 }}（{{ g.length }} 条）</div>
                <div v-for="row in g" :key="'gqrow'+row.id">;[[[[[[[]]]]]]]
                    {{ row.id }} - {{ row.name }} - {{ row.time }}
                </div>
            </div>
        </div>

        <div style="margin-top: 12px">
            <strong>已发送分组</strong>：{{ sentGroups.length }}
            <div v-for="(g, gi) in sentGroups" :key="'sg'+gi" style="padding: 6px 8px; border: 1px solid #6abf69; margin: 6px 0">
                <div>分组 {{ gi + 1 }}（{{ g.length }} 条）</div>
                <div v-for="row in g" :key="'sgrow'+row.id">
                    {{ row.id }} - {{ row.name }} - {{ row.time }}
                </div>
            </div>
        </div>

        <div style="margin-top: 16px; color: #666">
            <div>fetching: {{ fetching }}</div>
            <div>sending: {{ sending }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Table } from 'ant-design-vue'
import dayjs from 'dayjs'

type Detail = {
    id: number
    name: string
    time: string
}

// 扫码 id 队列（保持顺序）
const queue = ref<number[]>([])

// 当前未打包的详情（每满5条就打包一次）
const result = ref<Detail[]>([])

// 待发送的分组队列（每个元素是5条详情）
const groupQueue = ref<Detail[][]>([])

// 已打包但尚未成功发送的数量（以 5 的倍数计数）。用于确保打包后不立即清空表格，
// 而是在 send 成功后再从表格头部移除对应数量的行
const packReadyCount = ref(0)

// 已成功发送的分组，仅用于展示
const sentGroups = ref<Detail[][]>([])

// 状态位
const fetching = ref(false)
const sending = ref(false)

// 失败概率（0 ~ 0.6 可调），用于模拟失败与重试
const failRate = ref(0.2)

let nextId = 1

// 表格列定义（Ant Design Vue）
const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Time', dataIndex: 'time', key: 'time', width: 180 }
]

const scan = () => {
    queue.value.push(nextId++)
    processQueue()
}

const scanN = (n: number) => {
    for (let i = 0; i < n; i++) {
        queue.value.push(nextId++)
    }
    processQueue()
}

// 模拟获取详情
const getDetailById = (id: number): Promise<Detail> => {
    console.log('获取详情', id);
    
    return new Promise((resolve, reject) => {
        const timeout = Math.max(300, Math.ceil(Math.random() * 900))
        setTimeout(() => {
            const failed = Math.random() < failRate.value
            if (failed) {
                console.log('获取详情失败11111111111111111', id);
                
                reject(new Error('fetch failed'))
                return
            }
            resolve({
                id,
                name: 'name-' + id,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss')
            })
        }, timeout)
    })
}

// 模拟发送分组
const sendGroup = (g: Detail[]): Promise<true> => {
    console.log('发送分组', g.map(item => item.id).join(","));
    
    return new Promise((resolve, reject) => {
        const timeout = Math.max(400, Math.ceil(Math.random() * 1200))
        setTimeout(() => {
            const failed = Math.random() < failRate.value
            if (failed) {
                console.log('打包失败2222222222222222', g.map(item => item.id).join(","));
                
                reject(new Error('send failed'))
                return
            }
            resolve(true)
        }, timeout)
    })
}

// 处理扫码 id 队列（严格按顺序）
const processQueue = () => {
    if (fetching.value) return
    if (queue.value.length === 0) return

    const id = queue.value[0] // 先看队首，不立即移除
    fetching.value = true

    getDetailById(id)
        .then((detail) => {
            // 成功后才真正移除队首，保证严格顺序
            queue.value.shift()
            result.value.push(detail)
            console.log('获取详情成功44444444444444444', id);
            

            // 以 5 条为单位，按顺序打包，但不清空表格数据，待发送成功后再清理
            while (result.value.length - packReadyCount.value >= 5) {
                const packet = result.value.slice(packReadyCount.value, packReadyCount.value + 5)
                groupQueue.value.push(packet)
                packReadyCount.value += 5
                processSendQueue()
            }
        })
        .catch(() => {
            // 失败重试：保持队首 id 不变，延迟后重试
            // 以免死循环，这里给定一个固定退避时间
            setTimeout(() => processQueue(), 500)
        })
        .finally(() => {
            fetching.value = false
            // 继续处理队列
            processQueue()
        })
}

// 依次发送打包分组（严格顺序，失败重试）
const processSendQueue = () => {
    if (sending.value) return
    if (groupQueue.value.length === 0) return

    const packet = groupQueue.value[0] // 取队首，不立即移除
    sending.value = true

    sendGroup(packet)
        .then(() => {
            console.log('打包成功33333333333333333', packet.map(item => item.id).join(","));
            
            // 成功后移除并记录
            groupQueue.value.shift()
            sentGroups.value.push(packet)
            // 从表格数据中移除已成功发送的前 5 条
            result.value.splice(0, 5)
            packReadyCount.value -= 5
        })
        .catch(() => {
            // 失败：保持队首不动，延迟重试
            setTimeout(() => processSendQueue(), 800)
        })
        .finally(() => {
            sending.value = false
            // 继续处理后续分组
            processSendQueue()
        })
}
</script>

<style scoped>
.v-container {
    padding: 12px;
}
button {
    margin-right: 8px;
}
</style>


