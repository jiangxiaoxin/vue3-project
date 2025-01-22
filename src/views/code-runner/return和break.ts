function testNestedLoops() {
  for (let i = 0; i < 3; i++) {
    console.log(`外层循环 i = ${i}`)

    for (let j = 0; j < 3; j++) {
      console.log(`  内层循环 j = ${j}`)

      if (j === 1) {
        return '提前返回' // 这里会直接跳出整个函数
      }
    }
  }

  return '正常完成'
}

const result = testNestedLoops()
console.log(`结果: ${result}`)

function testWithBreak() {
  for (let i = 0; i < 3; i++) {
    console.log(`外层循环 i = ${i}`)

    for (let j = 0; j < 3; j++) {
      console.log(`  内层循环 j = ${j}`)

      if (j === 1) {
        break // 只跳出内层循环
      }
    }
  }

  return '正常完成'
}

const result2 = testWithBreak()
console.log(`结果: ${result2}`)

function testWithLabel() {
  outerLoop: for (let i = 0; i < 3; i++) {
    console.log(`外层循环 i = ${i}`)

    for (let j = 0; j < 3; j++) {
      console.log(`  内层循环 j = ${j}`)

      if (j === 1) {
        break outerLoop // 跳出标记为outerLoop的循环
      }
    }
  }

  return '正常完成'
}

const result3 = testWithLabel()
console.log(`结果: ${result3}`)
