let arr = [1, 2, 3, 4, 5]

async function download(urls) {
  let queue = []
  let max = 2
  let index = 0
  while (index < urls.length) {
    if (queue.length < max) {
      let url = urls[index]
      let task = api(urls[index])
        .then((res) => {
          console.log('client收到数据==success=====' + res)
        })
        .catch((error) => {
          console.log('client收取数据error==', error)
        })
        .finally(() => {
          console.log('client接受完毕：：：', url)

          let idx = queue.indexOf(task)
          if (idx != -1) {
            queue.splice(idx, 1)
          }
        })
      queue.push(task)
      index++
    } else {
      await Promise.race(queue)
    }
  }
}

function api(id) {
  console.log('client希望下载===id', id)

  return new Promise((resolve, reject) => {
    console.log('server服务器收到请求', id)

    let time = Math.ceil(Math.random() * 5) * 1000
    setTimeout(() => {
      console.log('==server服务器处理', id)
      let isOk = Math.random() > 0.5
      if (isOk) {
        resolve('数据内容' + id)
      } else {
        reject('数据 server error==>' + id)
      }
    }, time)
  })
}

download(arr)
