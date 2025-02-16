# 基本准则：
- setTimeout 是宏任务，promise是微任务

- 两次宏任务切换之间，看微任务队列有没有任务，有就先执行微任务，没有再执行宏任务

- new Promise构造函数传入的箭头函数整体会立马执行

- 同步代码立即执行

- 同类型队列，按照该类型对列里的先后顺序

- Promise.resolve() 相当于 new Promise后在参数那个函数里执行了resolve，promise实例已经确定状态

  ```javascript
  /**
  进入1
  log1
  log2
  time1111
  1中log
  进入2
  time2222
  res 1
  */
  
  setTimeout(() => {
      console.log('time1111')
    }, 0)
    let p = new Promise((resolve, reject) => {
      console.log('进入1')
      setTimeout(() => {
        console.log('1中log')
        resolve(1)
      }, 0)
    })
  
    console.log('log1')
    setTimeout(() => {
      console.log('time2222')
    }, 0)
  
    let q = p.then((res) => {
      console.log('进入2')
  
      setTimeout(() => {
        console.log('res', res)
      }, 0)
      return 2
    })
  
    console.log('log2')
  
  
  ```

  1. setTimeout 创建一个宏任务【time1111】，在宏任务队列里等着

  2. p这个promise 箭头函数体整个是立马执行，***输出【进入1】***。然后遇到setTimout，这生成个宏任务【1中log】，在a这个宏任务之后
  
  3. 遇到console.log 同步语句，***输出【log1】***
  
  4. 又遇到 setTimeout，新的宏任务【time2222】
  
  5. 遇到q这块的promise，但此时这块代码都必须p这个promise resolve之后才能进行，那这段此时可略过
  
  6. 又到了一个console.log,输出***【log2】***
  
  7. 到这，第一次执行完毕，没有微任务了
  
  8. 拿出一个宏任务，输出***【time1111】***
  
  9. 再拿一个宏任务，输出***【1中log】***，但这会立马执行resolve(1)，这就立马进入q那里的then，输出***【进入2】***
  
  10. 然后生成一个新的宏任务【res】
  
  11. 没有微任务，再拿一个宏任务，输出***【time2222】***
  
  12. 没有微任务，再拿一个宏任务，输出和***【res，1】***



## Promise.resolve 跟同步代码 console.log 

当这两种在一起时，先同步再 Promise.resolve.  Promise.resolve 是相当于两步。

> 面试点/test9.js


<img src="C:\D\vue-project\src\views\面试点\Promise.resolve和同步代码执行顺序.png" style="zoom:50%;" />

> 输出顺序：
>
> 2
>
> 6
>
> 3
>
> 4
>
> 1
>
> 100
>
> 5
