type name = string

import { hello } from './constants'

type Person = {
  name: string
  age: number
  address?: string
  [key: string]: string | number | undefined
}

function hi(person: Person) {
  console.log(`${person.name}, ${person.age}, ${person.address}`)
}

hi({ name: 'mike', age: 18 })
hi({ name: 'dove', age: 100, address: 'qd', school: '1' })

// //strictNullChecks=false 不检查undefined和null对别的类型的赋值
// let a: string = undefined

type Index = {
  name: string
  [key: string]: string | number
  [pos: number]: number
}

// type Index2 = {
//   [key: string]: number | string
//   [pos: number]: boolean // boolean 不是上面的 number|string 的子集，index signature 之间不能起冲突
// }
