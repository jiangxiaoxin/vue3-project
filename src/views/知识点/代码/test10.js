new Promise((resolveOuter) => {
  console.log(1111)

  resolveOuter(
    new Promise((resolveInner) => {
      console.log(2222)

      setTimeout(resolveInner, 1000, 'abc')
    })
  )
})
  .then((res) => {
    console.log('then', res, res instanceof Promise)

    if (res instanceof Promise) {
      res.then((result) => {
        console.log('result', result)
      })
    }
  })
  .then((res) => {
    console.log('res', res)
  })

// 1111
//2222
//   then abc false
//   res undefined
