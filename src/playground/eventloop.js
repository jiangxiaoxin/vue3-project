const seconds = new Date().getTime() / 1000

// while 一上来就立马执行，这样 queue 里是有任务执行的，当过了500ms以后，到了setTimeout的时机了，发现还有任务在执行，那就只能等着
setTimeout(() => {
  // prints out "2", meaning that the callback is not called immediately after 500 milliseconds.
  console.log(`Ran after ${new Date().getTime() / 1000 - seconds} seconds`)
}, 500)

while (true) {
  if (new Date().getTime() / 1000 - seconds >= 2) {
    console.log('Good, looped for 2 seconds')
    break
  }
}
