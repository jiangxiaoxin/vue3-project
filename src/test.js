function getA() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('a done')
      resolve('aaaaaaaaaaa')
    }, 1000)
  })
}

function getB() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('b done')
      resolve('bbbbbbbbbbb')
    }, 2000)
  })
}

function getC() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('c done')
      resolve('ccccccccccc')
    }, 500)
  })
}

// 调用顺序跟最后的接口返回顺序没关系
// getA()
// getB()
// getC()
// c-a-b

// 按照顺序执行请求任务，不管接口返回时间
// getA()
//   .then((res) => {
//     console.log('🚀 ~ getA ~ res:', res)

//     return getB()
//   })
//   .then((res) => {
//     console.log('🚀 ~ getb ~ res:', res)

//     return getC()
//   })
//   .then((res) => {
//     console.log('🚀 ~ getC ~ res:', res)
//   })

// async await 实现顺序处理
const sync = async () => {
  await getA()
  await getB()
  await getC()
}

sync()
