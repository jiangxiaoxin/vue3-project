// promise最大实验次数

function createTask(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(`task====[${id}]成功---------------success`)
      } else {
        reject(`task====[${id}]失败--------------error`)
      }
      // reject(`task====[${id}]失败--------------error`)
    }, 2000)
  })
}

function tryTimes(task, times) {
  return new Promise((resolve, reject) => {
    let attempt = () => {
      task
        .then((res) => {
          console.log(`task成功一次就返回 ${task.id} times:${times}`)

          resolve(res)
        })
        .catch((error) => {
          console.log(`任务执行失败 ${task.id} times:${times}`)
          times--
          if (times > 0) {
            console.log(`任务 ${task.id}可以继续尝试`)

            attempt()
          } else {
            console.log(`任务 ${task.id}没有次数了`)
            reject(error)
          }
        })
    }
    attempt()
  })
}

let urls = ['hello', 'world']
urls.forEach((url) => {
  let task = createTask(url)
  task.id = url
  tryTimes(task, 3)
    .then((res) => {
      console.log(`client 任务${url}得到数据--成功`)
    })
    .catch((error) => {
      console.log(`client 任务${url}超过次数--失败`, error)
    })
})
