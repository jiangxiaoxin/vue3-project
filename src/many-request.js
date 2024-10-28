let list = [1, 2, 3, 4, 5, 6]

function getData(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(query)
    }, 2000)
  })
}

/**
 * 请求队列，要连续请求一个接口很多次，但限制同时发起的请求。
 * 先启动3个，然后等执行完一个，就看看有多少个还没执行完。
 * 如果还有没执行完的，就再启动一个，继续执行
 * 如果执行完了，判断下是否所有的请求都结束了，如果结束了，就把结果返回。如果还没结束，就等着。
 * 最后一个请求结束后，会执行返回的。
 * 这适合最终一次性拿所有的返回结果。
 * 如果是返回一次就可以处理一次，那可以在成功返回后就执行更新本地数据。最后就不需要一起返回result了
 */

function queue() {
  let index = 0
  let result = {}
  let num = list.length
  return new Promise((resolve) => {
    let request = async () => {
      let id = index
      let query = list[id]

      console.log(`===================================================${index}--${query}开始请求了`)

      index++
      try {
        let data = await getData(query)
        console.log(`${index}--${query}请求成功，数据是${data}`)
        result[id] = data
      } catch (error) {
        console.log(error)
      } finally {
        console.log('--走finally', num)

        num--
        if (index < list.length) {
          request()
        } else {
          console.log('num', num)

          if (num == 0) {
            resolve(result)
          }
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      request()
    }
  })
}

queue().then((res) => {
  console.log('[完成]', res)
})
