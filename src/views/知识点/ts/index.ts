type name = string

import { hello } from "./constants"


function hi(person: name) {
  console.log(hello, person)
}
// hi('mike')

// hi(100)

// //strictNullChecks=false 不检查undefined和null对别的类型的赋值
// let a: string = undefined