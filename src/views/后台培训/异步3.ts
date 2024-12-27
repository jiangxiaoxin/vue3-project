console.log(1);

new Promise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        console.log(3);
        resolve(4)
    }, 0);
}).then(res => {
    console.log('new promise then', res);
    
})

Promise.resolve(5).then((res) => {
    console.log("🚀 ~ Promise.resolve ~ res:", res)

    console.log(6);
    setTimeout(() => {
        console.log(7);

        return 'abc'
    }, 0);
    
}).then(res => {
    console.log('then', res);
    
})

console.log(100);



