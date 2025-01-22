type P = {
  name: string
  age: number
}

function hi(person: P) {
  console.log(person.name, person.age)
}

let per = { name: '1', age: 1900 }

hi(per)

type P2 = {
  name: string
  age: boolean
}

type P3 = P | P2

let p3: P3 = {
  name: '123',
  age: true
}

// function bye(person: P2) {}

// bye(per)

// type Animal = {
//   name: string
//   age: number
// }

// type Bear = Animal & {
//   honey: boolean
//   name: boolean
// }

// const bear: Bear = {
//   name: '123',
//   honey: true,
//   age: 0
// }
// bear.name
// bear.honey

// interface Dog {
//   bark: string
// }

// interface Cat {
//   bark: number
// }

// interface Pet extends Dog, Cat {
//   name: string
// }

// type Drink = {
//   drink: () => void
// }

// type Eat = {
//   eat: () => void
// }

// type M = Drink | Eat
// type N = Drink & Eat

// let m: M = {
//   drink: () => {}
// }
// let n: M = {
//   eat: () => {}
// }

// let o: N = {
//   drink: () => {},
//   eat: () => {}
// }

interface Drink {
  drink: () => void
}

interface Eat {
  eat: () => void
}

interface A extends Drink, Eat {
  //   f: String
}

let m: A = {
  drink: () => {},
  eat: () => {}
}
