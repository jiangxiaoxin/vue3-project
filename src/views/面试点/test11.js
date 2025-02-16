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
  console.log(0);
  
  let p = new Promise((resolve, reject) => {
    resolve(1)
    setTimeout(() => {
      reject(3)
    }, 0);
  })

  p.then(res => {
    console.log(res);
    
  })

  p.then(res => {
    console.log(res);
    
  })

  p.catch(error => {
    console.log(error);
    
  })

  console.log(2);
  
}

{
  console.log('start');

let p = new Promise((resolve, reject) => {
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
}
