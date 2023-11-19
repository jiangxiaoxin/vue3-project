function func1() {
  let a = { name: 'a' }
  let arr = []

  arr.push(a)

  a = null

  console.log(arr)
}

function func2() {
  let p = { name: 'p' }
  changeParam(p)
  console.log(p)

  anotherParam(p)
  console.log(p)
}

func2()

function changeParam(params) {
  // 这个 params 就相当于 let params = p 这么行代码
  // params 是本地变量，它指向的值跟p指向的一致。通过 params 可以修改p的值
  params.name = 'params'
}

function anotherParam(params) {
  // 但给params换一个指向，并不能修改原来p的指向
  params = { age: 18 }
}
