async function manyTasks(tasks, fn) {
  const results = []
  for (const item of tasks) {
    let p = Promise.resolve().then(() => fn(item))
    console.log(`${item} 放入队列`)

    results.push(p)
  }
  return Promise.all(results)
}

async function main() {
  const tasks = [1, 2, 3, 4, 5]
  const fn = (item) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`执行fn了 ${item}`)
        resolve(item * 10)
      }, 1000)
    })
  }
  // const res = await manyTasks( tasks, fn)
  const res = await parallel(2, tasks, fn)
  console.log('最后的收货', res)
}

async function parallel(maxConcurrency, tasks, fn) {
  const results = []
  const running = []
  for (const item of tasks) {
    let p = Promise.resolve().then(() => fn(item))
    console.log(`${item} 放入队列`)
    results.push(p)
    console.log('-------------------------------');
    

    if (maxConcurrency <= tasks.length) {
      console.log(`发现同时干不了这么多呀。。。${item}`)
      const e = p.then(() => {
        console.log(`执行完毕了 ${item}，从队列中删除`)
        running.splice(running.indexOf(e), 1)
        return `${item}完了，从 running里移除`
      })
      console.log(`把 ${item} 放到 running里，记录下`)
      console.log('================================');
      
      running.push(e)

      if (running.length >= maxConcurrency) {
        console.log(`${item}等待执行完毕`)

        const r = await Promise.race(running)
        console.log(`有个结束了#####  ${r}`);
        
      }
    }
  }
  return Promise.all(results)
}

// main()


let nums = [1,2,3,4,5]
let plist = []
for(let num of nums) {
    plist.push(new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`执行fn了 ${num}`)
            resolve(num * 10)
        }, 1000)
    }))
}
