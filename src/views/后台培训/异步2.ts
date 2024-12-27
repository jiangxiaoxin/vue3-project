console.log(1);

new Promise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        console.log(3);
        resolve(4)
    }, 0);
}).then(res => {
    console.log(res);
    
})

console.log(5);

/**
 * 1
 * 2 new Promise 以后会里面开始执行里面的方法，这样才能知道里面要干嘛
 * 5
 * 3
 * 4
 */

