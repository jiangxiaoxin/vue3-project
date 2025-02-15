new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('111')
    }, 1000);
}).then((res) => {
    console.log('res', res)
    return new Promise((resolve, reject) => {
        reject('222')
    })
}).catch((error) => {
    console.log('error', error)
    // catch 内部的 return 也可以带出来值供下个then去获取使用
    return 'from catch'
}).then(res => {
    
    console.log('====', res)
}).finally(() => {
    console.log('finally')
})

/**
res 111
error 222
==== from catch
finally
 */

 async function ab() {
    let bb = await Promise.reject(1).catch(error => {
        console.log('error', error)
    })
    console.log(bb, bb instanceof Promise);
 }


 ab()