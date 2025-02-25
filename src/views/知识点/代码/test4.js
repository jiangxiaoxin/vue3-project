
let a = Promise.reject(1)

let b = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(2222)
    }, 1000)
})

let c = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3)
    }, 5000);
})

Promise.race([a, b, c]).then(res => {
    console.log(res, '=========settle');
}).catch(error => {
    console.log(error, 'errr====');
    
}).finally(() => {
    console.log('finally');
    
})