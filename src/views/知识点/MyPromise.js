// https://www.bilibili.com/video/BV1mH4y1Q7Z7/?spm_id_from=333.788.player.switch&vd_source=80821227b1acfcdbc8854c7cc218720b&p=29


const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  state = PENDING
  result = undefined
  #handlers = []

  constructor(fn) {
    const resolve = (result) => {
      if (this.state !== PENDING) return
      this.state = FULFILLED
      this.result = result
      if (this.#handlers.length) {
        this.#handlers.forEach((item) => {
          item.onFulfilled(this.result)
        })
      }
    }
    const reject = (reason) => {
      if (this.state !== PENDING) return
      this.state = REJECTED
      this.result = reason
      if (this.#handlers.length) {
        this.#handlers.forEach((item) => {
          item.onRejected(this.result)
        })
      }
    }

    try {
      // new 实例化时，fn会立刻被执行一次，这可能导致错误
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (result) => result
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const p = new MyPromise((resolve, reject) => {
      // 这里的代码相当于一个新promise实例的构造函数参数，是同步的立即执行
      if (this.state === FULFILLED) {
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.result) // then里的回调返回可以是普通值和对象，也可以是个新的promise实例

            // ! 留个不使用封装方法的写法
            if (result instanceof MyPromise) {
              if (result === p) {
                // 递归的情况
                throw new TypeError('Chaining cycle detected for promise #<MyPromise>')
                // throw 之后直接打断了所有后续的执行
              }
              result.then(
                (res) => resolve(res),
                (err) => reject(err)
              )
            } else {
              resolve(result)
            }
          } catch (error) {
            rejected(error)
          }
        })
      } else if (this.state === REJECTED) {
        // 出现错误，执行错误回调，但不是再报错
        queueMicrotask(() => {
          try {
            const result = onRejected(this.result)

            resolvePromise(p, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else {
        // 调用then方法时，状态还是pending，没有执行结果。把方法存下来，等有确定的结果后执行
        this.#handlers.push({
          onFulfilled: () => {
            queueMicrotask(() => {
              try {
                const result = onFulfilled(this.result)
                resolvePromise(p, result, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
          },
          onRejected: () => {
            queueMicrotask(() => {
              try {
                const result = onRejected(this.result)
                resolvePromise(p, result, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
          }
        })
      }
    })

    return p
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    // /**
    //  * ! 演示的代码里，是把 onFinally 直接传给了 this.then, 但then里的方法是可以访问 result和reason的，原生的promise在finally里是无法访问res的，所以这里再包一层回调
    //  */
    // const cb = (result) => {
    //   // console.log('内部callback里能访问result', result);

    //   onFinally()
    // }
    // return this.then(cb, cb)

    return this.then(onFinally, onFinally)
    // ! 不直接传的话，就不会访问到result，对 allSettled的测试里，带finally的实例最后打印就没有result
  }

  static resolve(value) {
    if(value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise((resolve) => {
        resolve(value)
      })
    }
  }

  // 参照mdn上关于方法的说明编写的
  // 与 Promise.resolve() 不同，即使 reason 已经是一个 Promise 对象，Promise.reject() 方法也始终会将其封装在一个新的 Promise 对象中
  static reject(reason) {
    return new MyPromise((_, reject) => {
      // 如果传入的reason 是个promise实例，那reject() 返回的promise实例跟的catch方法里，error得到的将会是一个promise实例
      reject(reason)
    })
  }


  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if(Array.isArray(promises) === false) {
        reject(new TypeError('all 方法需要传入个数组'))
      }
      if(promises.length === 0) {
        resolve([])
        return
      }
      let count = 0
      let result = []
      for (let i = 0; i < promises.length; i++) {
        promises[i] = MyPromise.resolve(promises[i])
        promises[i].then(
          (res) => {
            count++
            result[i] = res
            if (count === promises.length) {
              resolve(result)
            }
          },
          (err) => {
            // 只要有一个promise 实例的结果是 error，那就走到了 reject，这个reject 就是后面的错误处理
            reject(err)
          }
        )
      }
    })
  }

  static race(promises) {
    
    return new MyPromise((resolve, reject) => {
      if(Array.isArray(promises) === false) {
        reject(new TypeError('race 方法需要传入个数组'))
      }
      for (let i = 0; i < promises.length; i++) {
        // 静态的resolv方法，如果是一个普通值，那就返回一个新的promise对象，如果已经是一个promise了，那就直接返回，所以这里也就不用判断类型了
        promises[i] = MyPromise.resolve(promises[i])
        // if(promises[i] instanceof MyPromise === false) {
        //   promises[i] = MyPromise.resolve(promises[i])
        // }
        promises[i].then(
          (res) => {
            resolve(res) // 有任何一个有了确定结果，就会resolve或者reject，race调用后面跟的then或者catch就会执行
          },
          (err) => {
            reject(err)
          }
        )
      }
    })    
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if(Array.isArray(promises) === false) {
        reject(new TypeError('allSettled 方法需要传入个数组'))
      }
      if(promises.length === 0) {
        resolve([])
        return
      }
      let count = 0
      let result = []
      for (let i = 0; i < promises.length; i++) {
        promises[i] = MyPromise.resolve(promises[i])
        promises[i].then(
          (res) => {
            count++
            result[i] = {
              status: 'fulfilled',
              value: res
            }
            if (count === promises.length) {
              resolve(result)
            }
          },
          (err) => {
            count++
            result[i] = {
              status: 'rejected',
              reason: err
            }
            if (count === promises.length) {  
              resolve(result)
            }
          }
        )
      }
    })
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if(Array.isArray(promises) === false) {
        reject(new TypeError('any 方法需要传入个数组'))
      }
      if(promises.length === 0) {
        console.log('数组为空了');
        
        reject(new AggregateError([], 'All promises were rejected'))
      }
      let result = []
      let count = 0
      for(let i = 0; i < promises.length; i++) {
        promises[i] = MyPromise.resolve(promises[i])
        promises[i].then(
          (res) => {
            resolve(res)
          },(err) => {
            count++
            result[i] = err
            if(count === promises.length) {
              reject(new AggregateError(result,'All promises were rejected'))
            }
          }
        )
      }
    })
  }

}

// 简写版，比规范要简单
function resolvePromise(p, result, resolve, reject) {
  if (result instanceof MyPromise) {
    if (result === p) {
      // 递归的情况
      throw new TypeError('Chaining cycle detected for promise #<MyPromise>')
    }
    result.then(
      (res) => resolve(res),
      (err) => reject(err)
    )
  } else {
    resolve(result)
  }
}


{
  let p1 = new MyPromise((resolve, reject) => {
    resolve(1)
  })

  let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(2)
    }, 1000);
  })

  MyPromise.any([100,p1, p2]).then(res => {
    console.log(res, 'res122121');
  }).catch(error => {
    console.dir(error, 'error111');
  })
}


// {


//   let p = new MyPromise((resolve, reject) => {
//     reject(222)
//     // setTimeout(() => {
//     //   reject(1)
//     // }, 1000);
//   }).catch(error => {
//     console.log(error, 'error');
//     return 'in error'
//   })

//   MyPromise.allSettled([1, p]).then(res => {
//     console.log(res, 'res');
    
//   }).catch(error => {
//     console.log(error, 'error2', error === p); // true
    
//   })
// }

// {
//   MyPromise.resolve(new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       // resolve(1)
//       reject(2)
//     }, 1000);
//   }).then(res => {
//     console.log(res, 'res');
//   }, err => {
//     console.log('err', err);
//     return 33
//   })).then(res => {
//     console.log('out', res);
    
//   })
// }


// let p1 = new MyPromise((resolve, reject) => {
//   resolve(1)
// })

// let p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(2)
//   }, 2000);
// })

// MyPromise.allSettled([p1, p2]).then((res) => {
//   console.log(res)
// })

// let p2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     reject(2)
//   }, 2000);
// })

// let p3 = new MyPromise((resolve, reject) => {
//   console.log("in p3");

//   setTimeout(() => {
//     resolve(3)
//   }, 1000);
// })

// MyPromise.all([p1, p2, p3]).then((res) => {
//   console.log("🚀 ~ MyPromise.js:205 ~ Promise.all ~ res:", res)

// }).catch((error) => {
//   console.log("🚀 ~ MyPromise.js:209 ~ Promise.all ~ error:", error)
//   console.log(p1.state, p2.state, p3.state);

// })

// new MyPromise((resolve, reject) => {
//   // throw new Error(11)
//   throw 112233
// })
//   .then((res) => {
//     console.log(res, 'sucess')
//   })
//   .catch((error) => {
//     console.log(error, '----error')
//   })

// console.log('start')

// let p = new MyPromise((resolve, reject) => {
//   resolve(1)
// })

// p.then((res) => {
//   console.log(res)

//   return '00'
// })
//   .then(
//     (res) => {
//       console.log(res)
//       throw 111
//     },
//     (error) => {
//       console.log(error)
//     }
//   )
//   .then(
//     () => {
//       // throw new Error('自己搞的error')
//     },
//     (error) => {
//       console.log('拿到错误', error)
//       return 'abc'
//     }
//   )
//   .then((res) => {
//     console.log('error后的then', res)
//   })

// console.log('end')
