- `promise` 链中在某一步出现错误，就会跳过这一步后面的`then`的逻辑，直到被最近的`catch`捕获到。

- `catch` 捕获到以后，`promise`链就没有了危险，这个链可以从这个`catch`往后继续执行 `then` 逻辑。

  ```javascript
  // function a() {
  //   return Promise.resolve('function a')
  // }
  //
  // a()
  //   .then((result) => {
  //     console.log('res', result)
  //     throw new Error('自己搞的error')
  //     // console.log('error 后面紧跟代码') // 会提示代码无效，不会执行
  //   })
  //   .catch((err) => {
  //     // catch到错误后，就相当于这个promise链上没有错误了，后面的then可以继续正常走了
  //     console.log('err111', err)
  //     return 'from err111'
  //   })
  //   .then((args) => {
  //     console.log('222', args)
  //   })
  //   .finally(() => {
  //     console.log('finally')
  //   })
  
  // 这样就单独一个模块了，可以定义各种变量和方法，不会报警告了
  export default {}
  
  function foo() {
    return Promise.resolve()
      .then(() => {
        throw new Error('1111')
      })
      .catch((err) => {
        console.log('catch', err)
      })
  }
  
  /**
   * 虽然foo里面会报错，但被catch到了，有兜底了饿，promise链会继续成功的走下去，执行后面的then
   */
  foo().then(() => {
    console.log('foo-then')
  })
  
  ```

  