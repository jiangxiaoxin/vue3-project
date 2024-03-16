// const p = function() {
//     return new Promise((resolve, reject) => {
//         const p1 = new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve(1)
//             }, 0)
//             resolve(2)
//         })
//         p1.then((res) => {
//             console.log(res);
//         })
//         console.log(3);
//         resolve(4);
//     })
// }
//
//
// p().then((res) => {
//     console.log(res);
// })
// console.log('end');

new Promise((resolve, reject) => {
    console.log("pro start")
    setTimeout(() => {
        console.log('timeout')
        resolve(0)
    }, 0)

    resolve(1)
}).then(res => {
    console.log('then 1', res)
}).then(res => {
    console.log('thne2', res)
})