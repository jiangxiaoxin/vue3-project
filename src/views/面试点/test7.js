let p = new Promise((resolve, reject) => {
  console.log('进入1')
  setTimeout(() => {
    console.log('1中log')
  }, 0)
  resolve(1)
})

console.log('log1')

let q = p.then((res) => {
  console.log('进入2')

  console.log('res', res)
  return 2
})

console.log('log2')

/**
 * 进入1
 * log1
 * log2
 * 进入2
 * res， 1
 * 1中的log
 */
