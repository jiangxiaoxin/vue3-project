const pending = 'pending'
const fulfilled = 'fulfilled'
const rejected = 'rejected'
class MyPromise {
  state = pending
  result = undefined
  #handlers = []

  constructor(fn) {
    const resolve = (result) => {
      if(this.state !== pending) return
      this.state = fulfilled
      this.result = result
      if(this.#handlers.length) {
        this.#handlers.forEach(item => {
          item.onFulfilled(this.result)
        })
      }
    }
    const reject = (reason) => {
      if(this.state !== pending) return
      this.state = rejected
      this.result = reason
      if(this.#handlers.length) {
        this.#handlers.forEach(item => {
          item.onRejected(this.result)
        })
      }
    }
    fn(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (result) => result
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }
    if(this.state === fulfilled) {
      queueMicrotask(() => onFulfilled(this.result))
    } else if(this.state === rejected) {
      queueMicrotask(() => onRejected(this.result))
    } else {
      this.#handlers.push({
        onFulfilled: () => {
          queueMicrotask(() => {
            onFulfilled(this.result)
          })
        },
        onRejected: () => {
          queueMicrotask(() => {
            onRejected(this.result)
          })
        }
      })
    }
  }
}


console.log('start');

let p = new MyPromise((resolve, reject) => {
  resolve(1)
})

p.then((res) => {
  console.log(res)

  return '00'
})

p.then((res) => {
  console.log(res)
})

console.log('end');



