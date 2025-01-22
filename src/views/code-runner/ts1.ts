type Pet = 'dog' | 'cat'

let p1: Pet = 'dog'
// let p2: Pet = 'fish' // error

type Dog = 'dog'
let d1 = 'dog'
function feedDog(pet: Dog) {
  console.log(pet)
}
// feedDog(d1) // error d1是string型，并不是Dog型
// feedDog(d1 as Dog)

function bar(pet?: Pet): number {
  switch (pet) {
    case 'dog':
      return 1111
    case 'cat':
      return 222
    default:
      //   throw new Error()
      const bad: never = pet as never // 不加as never 就会报错
      return bad
  }
}

console.log(bar('dog'))
console.log(bar('cat'))
console.log(bar())
