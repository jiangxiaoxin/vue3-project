import copy from './copy'
import container from './container'
import bg from './bg'

export default {
  test: {
    mounted: (el: HTMLElement) => {
      console.log('test mounted', el)
    },
    updated: (el: HTMLElement) => {
      console.log('test updated', el)
    }
  },
  copy: copy,
  container: container,
  bg: bg
}
