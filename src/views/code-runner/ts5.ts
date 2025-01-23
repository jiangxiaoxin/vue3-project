export default {}

let a = 'hello' as const // 'hello' 就变成一个类型了
// ! 这里的 as const 可不是 js 的意思，是 ts 类型的用法
a = 'world'

type Pet = 'dog' | 'cat' | 'fish'
let b: Pet = 'dog'

// type Same = {}
// type Same = {}

// interface Same {
//   name: string
// }

// interface Same {
//   age: number
// }

interface Person {
  name: string
  age: number
  eat: () => void
}
// type Extract<T, U> = T extends U ? T : never;

type nn<T, K> = {
  [p in keyof Pick<T, Exclude<keyof T, keyof K>>]: boolean
}

interface withName {
  name: string
}

type nname = nn<Person, withName>

let pp: Person = {
  name: 'pp',
  age: 18
}

// type Exclude<T, U> = T extends U ? never : T;

// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// };

// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type ff = Omit<Person, 'name'>

type Omit2<T, K> = Pick<T, Exclude<keyof T, keyof K>>

type gg = Omit2<Person, withName>

type hh = Omit<Person, keyof withName>

let g: gg = {
  age: 18
}
console.log(g)

let h: hh = g

type toBoolean<T> = {
  [p in keyof T]: boolean
}

type mm = toBoolean<hh>

type toType<T, k> = {
  [p in keyof T]: k
}

// string & p 以后，那又要是string，又要是p，那就是p变成了string，只能这么解释了
type toType2<T, k> = {
  [p in keyof T as `is-${string & p}`]: k
}

type xxxx = toType<Person, boolean>
type yyyy = toType2<Person, boolean>

type Getters<Type> = {
  [Property in keyof Type as `get-${Capitalize<string & Property>}`]: () => Type[Property]
}

// 把一个类型里的不是keyType类型的属性拿出来，组成新的类型
type zz<T, keyType> = {
  [p in keyof T as T[p] extends keyType ? never : p]: T[p]
}

type zzzzz = zz<Person, string>
