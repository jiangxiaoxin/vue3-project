export default {}

// let a = 1
// const b = 2

function foo() {
  // okay to capture 'a'
  return a
}
console.log(foo()) // a 先用了，但没问题，这个a 是从globalThis上找的
let a = 11

// function bar() {
//   console.log(b) // error b还没定义就先用了
//     let b = 1
// }

const b = 1

bar()

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, i + 100)
}
