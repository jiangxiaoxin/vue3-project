export function throttle(func, wait) {
    let timeout
    return function () {
      const context = this
      const args = arguments
      if (!timeout) {
        timeout = setTimeout(() => {
          func.apply(context, args)
          clearTimeout(timeout)
          timeout = 0
        }, wait)
      }
    }
  }