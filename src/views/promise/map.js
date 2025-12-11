const vals = [1,2,3,4,5]

function getBack(val) {
    const duration = Math.max(2, Math.ceil(Math.random() * 5))
    console.log("开始请求", val, Date.now(), duration);
    return new Promise((resolve, reject) => {
        
        setTimeout(() => {
            console.log("要返回的数据", val, Date.now(), duration);
            
            resolve(val)
        }, duration * 1000);
    })
}



// // map 同步执行循环后，生成了多个异步任务，
// const promises = vals.map(async val => {
//     const res = await getBack(val)
//     console.log("🚀 ~ res:", res)

//     return res
// })
// console.log("🚀 ~ promises:", promises)

// Promise.all(promises).then(res => {
//     console.log("all 结束", res, Date.now());
// })

vals.map(val => {
    getBack(val)
})