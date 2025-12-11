<template>
    <layout>
        <template #header>
            <h1>header</h1>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
        </template>
        <template #body>
            body
        </template>
        <template #footer>
            footer
        </template>
        <!-- default from parent -->

        <template #noexist>
            <div>
                虽然在子组件里并没有定义这个插槽，显示上也的确没有显示这里的内容，但子组件内slots.noexist 的值是存在的
            </div>
        </template>
    </layout>
</template>

<script setup lang="ts">
import layout from './layout.vue';
import { ref } from 'vue';
import { c } from "@/utils/log"

const input = ref("")


const arr = [1, 2, 3, 4, 5]

/**
 * ids = [11111]
 * id => detail
 * for 
 */

 /**
  * for
  * promise
  */

 async function loopPrint() {
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i]
        console.log("🚀 ~ loopPrint ~ val:", val, Date.now())

       await new Promise((resolve) => {

            c.primary('输出', val, Date.now())

            resolve(true)

            // setTimeout(() => {
            //     c.primary('输出', val, Date.now())
            //     resolve(true)
            // }, 1000);
        })
    }

    // console.log('00000000000000000000');

    // map(id => promise)

    // promises


    


    // c.primary('start', Date.now())
    // arr.forEach( async item => {
    //     await new Promise(resolve => {
    //         setTimeout(() => {
    //             c.random('--', item, Date.now())
    //         }, 1000);
    //         resolve(true)
    //     })
    // })
    // c.primary('end', Date.now())


    // console.log('00', Date.now());

    // new Promise(resolve => {
    //     console.log('11', Date.now());
    //     resolve(true)

    // }).then(res => {
    //     console.log("🚀 ~ loopPrint ~ res:", res, Date.now())
    // })


    // console.log('00', Date.now());
    // arr.forEach(item => {
    //     setTimeout(() => {
    //         console.log('11', item, Date.now());

    //     }, 1000);
    // });

    // c.primary('start', Date.now())
    // // let i = 0
    // var i=0
    // for (; i < arr.length; i++) {
    //     setTimeout(() => {
    //         console.log('==', i, Date.now());
    //     }, 1000);
    // }

    // console.log(i);
    


    
    // c.primary('end', Date.now())
}

loopPrint()


// new Promise(() => {
//     console.log(111);
// })



</script>