<template>

</template>
<script setup lang="ts">

let a = Promise.reject(1)
console.log("🚀 ~ a:", a)



function foo() {
    console.log("🚀 ~ foo ~ foo:")
    setTimeout(() => {
        return "foo"
    }, 2000);
    // return "dfsdfs"
}

function bar() {
    return Promise.resolve('bar')
}

function baz() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('bazzzzz')
        }, 2000)
    })
}

async function main() {
   let res:any = await bar()
   
   console.log("🚀 ~ main ~ bar:", res)

   // await 并不会等foo里面执行到settimeout的return。如果后面紧跟return，这个res 就是这个紧跟的return值
   res = await foo()
   console.log("🚀 ~ main ~ foo:", res)

   res = await 1;
   console.log("🚀 ~ main ~ res:", res)

   res = await baz()
   console.log("🚀 ~ main ~ baz:", res)
}

main()
</script>