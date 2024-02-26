const flattern = (array) => {
  const res = []
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      res.push(...flattern(array[i]))
    } else {
      res.push(array[i])
    }
  }
  return res
}

const a = [
  1,
  [
    [21, 22, 23, [24, 25]],
    [3, [4]]
  ]
]

const b = [1, [2, [3, [4]]]]

// console.log('a', flattern(a))

const flatten2 = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    console.log('====arr', arr)
    arr = [].concat.apply([], arr)
    console.log('-----arr', arr)
  }
  return arr
}

// console.log(flatten2(b))

var arr1 = [0, 0, 0]
// arr1 = arr1.concat(b) // 直接concat b，是把b这个数组跟arr1数组元素合并
// console.log(arr1)
// arr1 = [].concat.apply([0, 0, 0], b) // 这种方式，是把b数组的元素破去一级然后添加进去。跟...b是一样的
// console.log(arr1)
arr1 = arr1.concat(...b)
console.log(arr1)

// const c = [...b]
// console.log(...b) //直接解构是不允许的，但console.log 可以直接跟解构
// console.log(c)

// function p() {
//   console.log('args', arguments.length)

//   console.log(arguments[0])
//   console.log(arguments[1])
// }

// p(...b)

function flatten3(arr) {
  return arr.reduce(function (prev, cur) {
    return prev.concat(Array.isArray(cur) ? flatten3(cur) : cur)
  }, [])
}
