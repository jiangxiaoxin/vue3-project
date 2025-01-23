export default {}

type Person = {
  name: string
  age: number
  eat: (food: string) => void
}

type Partial2<T> = {
  [key in keyof T]: T[key] | undefined
}

type partOfPerson = Partial<Person>
type partOfPerson2 = Partial2<Person>

let a: partOfPerson = {
  name: undefined
}

/**
 * ! partOfPerson 是属性可能不在,即使在，值也可能不在
 * ! partOfPerson2 是属性都在，但是属性所对应的值可以不在
 */
// let b :partOfPerson2 = {} // error

//* 1. 属性可以有，可以没有
//* 2. 属性必须有，但值可以有，可以没有
// * 3. 属性必须有，值也必须有

type partOfPerson3 = {
  name?: string
}

let c: partOfPerson3 = {
  // name: '123',
  // name: undefined
}
c.name

// type partOfPerson4 = {
//   name: string?
// }

// // type3 和 type4 是两种不同的类型

// let d: partOfPerson4 = {
//   name: null // undefined => error
// }
// d.name

// // c = d // error
