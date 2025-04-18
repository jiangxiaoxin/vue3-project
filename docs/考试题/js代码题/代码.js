console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

new Promise((resolve, reject) => {
    console.log(3);
    resolve();
}).then(() => {
    console.log(4);
}).finally(() => {
    console.log(5);
})

// Promise.resolve().then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(4);
// }).finally(() => {
//     console.log(5);
// })

console.log(6);

// 1 3 6 4 5 2
// 1 6 3 4 5 2

