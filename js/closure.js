function makeAdd(num) {
    return function(val) {
        return num + val;
    }
}

let add5 = makeAdd(5)

// console.log(add5(10));
// console.log(add5(100));

function Foo() {
    let count = 0;

    return {
        add: function(val) {
            count += val;
        },
        getResult: function () {
            return count
        }
    }
}

let foo = Foo()

// foo.add(100)
// console.log(foo.getResult());
// foo.add(1000)
// console.log(foo.getResult());

// function createIncrementFunctions() {
//     let increments = [];
//     for (var i = 0; i < 5; i++) {
//         increments[i] = function() {
//             console.log(i); // 意外共享变量 i
//         };
//     }
//     console.log('pppp', i)
//     return increments;
// }
// let myIncrements = createIncrementFunctions();
// for (let j = 0; j < 5; j++) {
//     myIncrements[j]();
// }

// async function async1() {
//     console.log('async1 start')
//     await async2()
//     console.log('async1 end')
// }
// async function async2() {
//     console.log('async2')
// }
// console.log('script start')
// setTimeout(function () {
//     console.log('setTimeout')
// }, 0)
// async1()
// new Promise(function (resolve) {
//     console.log('promise1')
//     resolve()
// }).then(function () {
//     console.log('promise2')
// })
// console.log('script end')

// setTimeout(() => {
//     console.log('00')
// }, 0)
// console.log(1)
// new Promise(function(resolve, reject) {
//     console.log(2)
//     resolve()
// }).then(function() {
//     console.log(3)
// })
// Promise.resolve().then(() => {
//     console.log('aaaa')
// })
// new Promise(function(resolve, reject) {
//     console.log(5)
//     resolve()
// }).then(function() {
//     console.log(6)
// })
// console.log(4)
// new Promise(function(resolve, reject) {
//     console.log(7)
//     resolve()
// }).then(function() {
//     console.log(8)
// })
// 1
// 2
// 5
// 4
// 7
// 3
// aaa
// 6
// 8
// 00

function tick(thisFn, fn) {
    console.log('this', thisFn)
    fn && fn()
}

tick(() => {
    console.log(123)
})






