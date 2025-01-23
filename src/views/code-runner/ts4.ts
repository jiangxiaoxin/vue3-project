export default {}

function iden<T extends { length: number }>(datas: T) {
  return datas.length
}

iden([1, 2])
iden('123')

type idenType = <T extends { length: number }>(datas: T) => number

let foo: idenType = iden
foo('asdf')

// interface idenInterface<T extends { length: number }> {
//   (datas: T): number
// }

// let bar: idenInterface<number[]> = iden
// // bar('123') // error
// bar([1, 2, 3])

// let bar: idenInterface<Array<number>> = iden // ok
// bar([1, 2, 3])

// let bar :idenInterface = iden// error

interface Iden2 {
  <T extends { length: number }>(datas: T): number
}

/**
 * @description type 定义类型，和 interface 定义类型，都可以转化，可以相互赋值
 */
let bb: Iden2 = iden
bb('12121')
bb([1, 2, 3])

interface Iden3<T extends { length: number }> {
  (args: T): number
}
/**
 * Iden3 的定义，在使用时，后面要加泛型的具体类型说明，而Iden2 不需要
 * 这不就是上面的 idenInterface 定义吗
 * https://www.typescriptlang.org/docs/handbook/2/generics.html
 * 官方文档上也写出了这两种的对比
 */
let cc: Iden3<{ length: number }> = iden
cc('123')
cc([1, 2])
