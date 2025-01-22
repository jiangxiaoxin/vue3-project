#### return 和 break 的区别

- `return` 会提前退出整个方法，不执行后续的代码，不管这个`return` 是在多少层循环之内。

```javascript
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

/**
*外层循环 i = 0
  内层循环 j = 0
  内层循环 j = 1
结果: 提前返回
*/
```

> 但如果将一个大方法拆分成几个小方法，那在小方法里的 `return`，只是打断自己这个小方法而已，对于大方法并没有打断。

- `break` 是结束当前的循环，`for`循环和`while` 循环都可以，但只能是当前循环。

```javascript
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
```

> break 只是提前终止了第二层for循环的后续执行，外面的第一层for循环 i 会一直执行，直到结束

- 是不是 `break` 就不能终止全部呢？也可以，加上标签

```javascript
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
```

> 第一层循环定义了一个标签，具名了，在第二次循环到达某个条件时，可以通过**break + 标签**的方式跳出这个指定的循环
>
> 但要注意的是，它只是跳出了循环，最后的 `return '正常完成'`这句代码是会执行的，所以最后的 `result3` 是**正常完成**了



**准确地说，`return` 和 `break` 打破的不是循环，而是打破了执行链条**