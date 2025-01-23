export default {}

function a(t: any): any {
  return t
}

// console.log(a(1).length) // 编译没问题，执行没问题，只不过undefined
// console.log(a(2)[0]) // undefined

function b<T>(t: T): T {
  return t
}

// console.log(b<number>(1)) // all ok
// console.log(b<number>('aa')) // type error

function c(t: unknown) {
  return t
}
// c 返回的类型是 unknown，就是你不知道返回是啥类型，那直接调用返回结果的属性和方法，ts都认为是错误的，必须narrow type一下，比如 as string， if(typeof ), if(  instanceof ) 这样之后，才能执行后续
console.log((c('1') as string).length)
console.log((c(1) as string).length) // number=> Number => xx.length => undefined

function d<T extends { length: number }>(data: T) {
  return data.length
}
