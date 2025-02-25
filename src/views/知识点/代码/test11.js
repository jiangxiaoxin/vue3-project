function test1() {
  new Promise((resolve, reject) => {
    console.log(1)

    new Promise((onSuccess, onError) => {
      console.log(2)
      setTimeout(() => {
        onSuccess(3)
      }, 0)
    }).then((res) => {
      console.log(res, '====')
    })
    resolve(4)
  }).then((res) => {
    console.log(res, '111111111')
  })
}

/**
 * 
 1
2
4 111111111
3 ====
 */
// test1()

function test2() {
  new Promise((resolve, reject) => {
    console.log(1)

    new Promise((onSuccess, onError) => {
      console.log(2)
      setTimeout(() => {
        console.log('tttt')
      }, 0)
      onSuccess(3)
    }).then((res) => {
      console.log(res, '====')
    })
    resolve(4)
  }).then((res) => {
    console.log(res, '111111111')
  })
}

/**
 1
2
3 ====
4 111111111
tttt

 */
// test2()

function test3() {
  let p = new Promise((resolve, reject) => {
    // console.log(p.name) // error
    // resolve(p.name) // error
    resolve(1)
  }).then((res) => {
    console.log('res', res)
  })

  p.name = 'ppp'
}

// test3()

function test4() {
  let p = new Promise((resolve, reject) => {
    resolve(1)
  })

  let q = p.then((res) => {
    console.log('resolve', res)
  })

  console.log(p == q, p === q, p instanceof Promise, q instanceof Promise)
}

// test4()

function test5() {
  let p = new Promise((resolve, reject) => {
    console.log(resolve, 'resolve')

    resolve && resolve(1)
  })
  console.log(p)
  console.log(1111111111)

  p.then((res) => {
    console.log('res', res)
  })
  console.log(222222222222)
}

// test5()

function test6() {
  // 0-2-1-1
  console.log(0)

  let p = new Promise((resolve, reject) => {
    resolve(1)
    setTimeout(() => {
      reject(3)
    }, 0)
  })

  p.then((res) => {
    console.log(res)
  })

  p.then((res) => {
    console.log(res)
  })

  p.catch((error) => {
    console.log(error)
  })

  console.log(2)
}

// {
//   console.log('start')

//   let p = new Promise((resolve, reject) => {
//     resolve(1)
//   })

//   p.then((res) => {
//     console.log(res)

//     return '00'
//   })

//   p.then((res) => {
//     console.log(res)
//   })

//   console.log('end')
// }

function test7() {
  console.log(1111111)

  let p = new Promise((resolve, reject) => {
    console.log('in p')

    resolve(1)
  })

  p.then((res) => {
    console.log(res, 'pp')
  })

  console.log(2222222)

  let q = new Promise((resolve, reject) => {
    console.log('in q')

    resolve(2)
  })

  q.then((res) => {
    console.log(res, 'qq')
  })

  console.log(3333333)
}
/**
1111111
in p
2222222
in q
3333333
1 pp
2 qq

 */
// test7()

function test8() {
  let p = new Promise((resolve, reject) => {
    resolve(1)
  })
    .then((res) => {
      console.log('🚀 ~ test11.js:196 ~ p ~ res:', res)
      // 模拟axios去调后台接口
      return new Promise((resolve, reject) => {
        resolve(2)
      }).then((res) => {
        console.log('🚀 ~ test11.js:201 ~ returnnewPromise ~ res:', res)
      })
    })
    .then((res) => {
      console.log('🚀 ~ test11.js:206 ~ p ~ res:', res)
    })
}

// test8()

// {
//   new Promise((resolve, reject) => {
//     throw 'abc'
//     // reject('rrrrr')
//   }).then((res) => {
//     console.log(res, 'sucess')
//   }).catch((error) => {
//     console.log(error, 'error123123')
//   })
// }

// {
//   let p1 = new Promise((resolve, reject) => {
//     resolve(1)
//   })
//   console.log(p1);

//   console.log(p1.state, p1.result);

//   let p2 = new Promise((resolve, reject) => {
//     reject(2)
//   })

//   console.log(p2);

//   let p3 = new Promise((resolve, reject) => {
//     console.log('in 3');

//     setTimeout(() => {
//       resolve(3)
//     }, 1000);
//   })

//   console.log( p3);

//   Promise.all([p1, p2, p3]).then((res) => {
//     console.log("🚀 ~ MyPromise.js:205 ~ Promise.all ~ res:", res)

//   }).catch((error) => {
//     console.log("🚀 ~ MyPromise.js:209 ~ Promise.all ~ error:", error)

//   })
// }

// {
//   let p = new Promise((resolve, reject) => {
//     resolve(1)
//   }).finally(res => {
//     console.log(res, 'finally', arguments.length, arguments)
//   })
// }

// {
//   let p1 = new Promise((resolve, reject) => {
//     resolve(1)
//   }).finally(() => {
//     console.log('finally')
//     return 55
//   }).then((res) => {
//     console.log('after finally', res);
//     return 100
//   }).then((res) => {
//     console.log('after finally2', res);
//   })

//   // console.log(p1 instanceof Promise);

//   let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(2)
//     }, 2000);
//   })

//   Promise.allSettled([p1, p2]).then((res) => {
//     console.log(res)
//   })
// }

// {
//   Promise.resolve(new Promise((resolve, reject) => {
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

// {

//   let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(1)
//     }, 1000);
//   }).catch(error => {
//     console.log(error, 'error');

//   })

//   Promise.reject(p).then(res => {
//     console.log(res, 'res');

//   }).catch(error => {
//     console.log(error, 'error2', error === p); // true

//   })
// }

// {
//   let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('时间到了');
      
//       reject(0)
//     }, 1000);
//   }).catch(error => {
//     console.log(error, 'error1111');
//   })
//   Promise.race([
//     // new Error('123'),
//     2,
//     p,
//   ])
//     .then((res) => {
//       console.log(res, 'res')
//     })
//     .catch((error) => {
//       console.log(error, 'error')
//     })
// }


{
  // let p1 = new Promise((resolve, reject) => {
  //   reject(1)
  // }).catch(error => {
  //   console.log(error, 'error');
  //   return 'in err'
  // })

  // let p2 = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     reject(2)
  //   }, 1000);
  // })
  

  // Promise.allSettled([]).then(res => {
  //   console.log(res, 'res');
  // }).catch(error => {
  //   console.log(error.errors, 'error');
  // })
}

{
  let p1 = new Promise((resolve, reject) => {
    resolve(1)
  })

  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(2)
    }, 1000);
  })

  Promise.any([]).then(res => {
    console.log(res, 'res');
  }).catch(error => {
    console.log(error, 'error');
  })
}