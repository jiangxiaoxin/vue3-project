{
  /**
       * 进入1
      log1
      log2
      1中log
      进入2
      res 1
       */
  //   let p = new Promise((resolve, reject) => {
  //     console.log('进入1')
  //     setTimeout(() => {
  //       console.log('1中log')
  //       resolve(1)
  //     }, 0)
  //   })
  //   console.log('log1')
  //   let q = p.then((res) => {
  //     console.log('进入2')
  //     console.log('res', res)
  //     return 2
  //   })
  //   console.log('log2')
}

console.log('=======================================')

{
  /**
 * 进入1
log1
log2
time1111
1中log
进入2
time2222
res 1
 */

  setTimeout(() => {
    console.log('time1111')
  }, 0)
  let p = new Promise((resolve, reject) => {
    console.log('进入1')
    setTimeout(() => {
      console.log('1中log')
      resolve(1)
    }, 0)
  })

  console.log('log1')
  setTimeout(() => {
    console.log('time2222')
  }, 0)

  let q = p.then((res) => {
    console.log('进入2')

    setTimeout(() => {
      console.log('res', res)
    }, 0)
    return 2
  })

  console.log('log2')
}
