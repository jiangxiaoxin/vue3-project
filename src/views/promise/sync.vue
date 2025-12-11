<template>

    <button @click="test10">10个 await</button>

    <button @click="test10Promise">10个promise</button>

    <button @click="test1">单个</button>

    <button @click="push1">push 1个</button>

    <p>当前扫码队列：{{ arr }}</p>

    <div v-container>
        <div v-for="value in records">
            {{ value }}
        </div>
    </div>

</template>


<script setup lang="ts">
import { c } from '@/utils/log'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
const test10 = async () => {
    for (let i = 0; i < 10; i++) {
        c.primary(`开始请求${i}`)
        const res = await getDetail(i)
        c.random("🚀 详情:", res)

        await packPackage(i)
        c.primary(`请求${i}打包结束`)
    }
}

const getDetail = (i: number) => {
    c.primary(`进入请求${i}`)
    return new Promise((resolve) => {
        const time = Math.max(1000, Math.ceil(Math.random() * 2000))
        setTimeout(() => {
            c.primary(`请求${i}找到数据库信息了`)
            resolve(i)
        }, time)
    })
}

const packPackage = (i: number) => {
    c.primary(`开始打包${i}`)
    return new Promise((resolve) => {
        const time = Math.max(1000, Math.ceil(Math.random() * 2000))
        setTimeout(() => {
            c.primary(`请求${i}打包成功`)
            resolve(true)
        }, time)
    })
}

const test10Promise = () => {
    for (let i = 0; i < 10; i++) {
        c.primary(`开始请求${i}`)
        getDetail(i).then((res) => {
            c.random("🚀 ~ test10 ~ res:", res)
            packPackage(i).then(() => {
                c.primary(`请求${i}打包结束`)
            })
        })
    }
}

let id = 0
const test1 = async () => {
    const i = id++
    c.primary(`开始请求${i}`)
    const res = await getDetail(i)
    c.random("🚀 详情:", res)

    await packPackage(i)
    c.primary(`请求${i}打包结束`)
}


const arr = ref<number[]>([])

const push1 = async () => {
    arr.value.push(id++)

    // while(arr.value.length > 0) {
    //     let first = arr.value.shift()!
    //     c.primary(`开始请求${first}`)
    //     const res = await getDetail(first)
    //     c.random("🚀 详情:", res)

    //     await packPackage(first)
    //     c.primary(`请求${first}打包结束`)
    // }
}

let timer: number
let running = ref(false)
let records = ref<any[]>([])
let everyPack = 5
let packing = ref(false)

let timer2: number
onMounted(() => {
    timer = setInterval(async () => {
        if (running.value) {
            return
        }
        if (arr.value.length) {
            try {
                running.value = true
                let first = arr.value[0]
                c.primary(`开始请求${first}`)
                const res = await getDetail(first)
                c.random("🚀 详情:", res)


                await getCode1()

                await getCode2()

                arr.value.shift()
                records.value.push(res)

            } catch (error) {
                console.log(error);

            } finally {
                running.value = false
            }
        }
    }, 2000)


    timer2 = setInterval(async () => {
        if (packing.value) {
            return
        }
        if (records.value.length >= everyPack) {
            try {
                packing.value = true
                await pack()
                let temp = records.value.splice(0, everyPack)
                c.primary(`请求${temp}打包结束`)

            } catch (error) {

            } finally {
                packing.value = false
            }
        }
    }, 2000);
})

const getCode1 = () => {
    c.random('code1111111')
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1)
        }, 1000)
    })
}

const getCode2 = () => {
    c.random('code2222222')
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2)
        }, 1000)
    })
}

const pack = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let succ = Math.random() < 0.5
            if(succ) {
                resolve(true)
            } else {
                reject(new Error('打包失败'))
            }
        }, 1000)
    })
}

onBeforeUnmount(() => {
    clearInterval(timer)
    clearInterval(timer2)
})




</script>