export default {}

type CanFly = {
  fly: () => void
}

type CanRun = {
  run: () => void
}

type CanFlyAndRun = CanFly & CanRun

let fly: CanFly = {
  fly() {}
  //   run() {}  // error 没有 run这个方法的声明
}

let run: CanRun = {
  run() {}
}

// let a: CanFlyAndRun = fly // error fly对象缺少run方法定义
//! 这也说明，CanFlyAndRun 类型是同时有 CanFly 和CanRun 的方法才行
/**
 * ?那两个的属性和方法冲突呢？
 * 类型是可以声明的，就像下面的 Baz，但声明后 name的类型成了 string & string[]，这样怎么赋值都不可能同时是 string和string[],那基本上就意味着 同名但不同类型，交叉后就是不能用过了
 */

type Foo = {
  name: string
}

type Bar = {
  name: string[]
}

type Baz = Foo & Bar

// let baz: Baz = {
//   name: 'aaa' // the string type is not assignable to type string & string[]
// }

// let a: CanFlyAndRun = {
//   fly() {},
//   run() {}
// }

type CanFlyOrRun = CanFly | CanRun

let b: CanFlyOrRun = fly
console.log(b)

b = {
  fly() {},
  run() {}
  //   swim() {} // error 这就不行，swim没有声明
}

type TypeA = {
  name: string
  fly: () => void
}

type TypeB = {
  age: number
  run: () => void
}

type A_B = TypeA | TypeB

let c: A_B = {
  name: 'aaa',
  fly() {},
  age: 11,
  run() {}
}
/**
 * ! A_B 联合类型，要么是A，要么是B，但不能同时都是
 * ! c 出了A类型定义的属性和方法之外，还多了个age，这样c就不能当成A类型，下面对c的使用就会报错
 */
// c.name
// c.age

/**
 * & 和 | 构建的新类型，变量的值都不可以添加额外的未定义的属性和方法
 * & 得到的新类型，变量的值必须是所有的属性和方法都有，没有就报错
 * | 得到的新类型，变量的值，只能符合一个类型，
 */
