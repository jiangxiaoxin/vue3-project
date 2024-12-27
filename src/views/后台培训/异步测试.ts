
Promise.resolve().then(() => {
    console.log("0000");
    
})

console.log(1)

setTimeout(() => {
    console.log('timeout', 6);
}, 0);

const ret = await testAsync()
console.log("🚀 ~ ret:", ret)


new Promise((resolve, reject) => {
    console.log(2)
    setTimeout(() => {
        console.log(3)
        resolve(4)
    }, 0)
}).then(res => {
    console.log('res', res)
}).finally(() => {
    console.log('finally', 5)
})

console.log(7)

async function testAsync() {
    let ret =  await new Promise((resolve, reject) => {
        console.log(8)
        setTimeout(() => {
            console.log(9)
            resolve(10)
        }, 0)
    })

    console.log("🚀 ~ ret ~ ret:", ret)
    return 'testAsync ret'
}

export {}
