setTimeout(() => {
  console.log(1)
}, 0)

console.log(2)

setTimeout(() => {
  console.log(100)
}, 0)

Promise.resolve(3)
  .then((res) => {
    console.log(res)
    return 4
  })
  .then((res) => {
    console.log(res)
    setTimeout(() => {
      console.log(5)
    }, 0)
  })

console.log(6)

// console.log(1)
// new Promise((resolve, reject) => {
//   console.log(2)
//   resolve(3)
// }).then((res) => {
//   console.log(4, res)
// })
// console.log(5) //1 ,2 ,5 ,4,3
