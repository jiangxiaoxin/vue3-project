function longTask(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Date().toLocaleString())
    }, duration * 1000)
  })
}

function main() {
  longTask(1)
    .then((res) => {
      console.log('longTask 1', res)

      longTask(2)
        .then((res) => {
          console.log('longTask 2', res)




        })
        .catch((err) => {
          console.log('longTask 2 error', err)
        })
        .finally(() => {
          console.log('finally longTask 2')
        })
    })
    .catch((err) => {
      console.log('longTask 1 error', err)
    })
    .finally(() => {
      console.log('finally longTask 1')
    })
}

main()
