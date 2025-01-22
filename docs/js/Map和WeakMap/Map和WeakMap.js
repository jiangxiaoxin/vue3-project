let a = new Map()
// let b = new WeakMap()
// ;(function () {
//   const foo = {
//     name: 'foo'
//   }

//   const bar = {
//     name: 'bar'
//   }
//   a.set('foo', foo)
//   b.set(bar, 'bar')
// })()
// // console.log(a)
// // console.log(b)

// console.log(a.get('foo'))

let elm = { name: 'elm' }

a.set(elm, '123')
elm = null

console.log(a.entries())
