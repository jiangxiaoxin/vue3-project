import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import directives from './directives'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { useZIndex } from 'element-plus'

const zindex = useZIndex()
// console.log(
//   zindex.currentZIndex.value,
//   zindex.nextZIndex(),
//   zindex.nextZIndex(),
//   zindex.currentZIndex.value
// )

const app = createApp(App)

const pinia = createPinia()
// console.log('🚀 ~ file: main.ts:13 ~ pinia:', pinia)
/**
 * 创建的pinia实例就是个普通的对象，里面有些属性，还有几个方法
 */

app.use(pinia)
app.use(router)

app.directive('hello', {
  mounted: (el: HTMLInputElement) => {
    console.log('hello,', el.value)
  }
})

// app.directive 注册全局指令时，后面可以传一个对象，里面是钩子函数。也可以是一个函数，这个函数将使用在mounted和updated钩子函数，因为大部分简单指令都期望在mounted和updated时使用
// 指令的钩子函数，类似以前的vue2 中的生命周期，文档有
app.directive('addCls', (el: HTMLElement, binding) => {
  el.classList.add(binding.value || 'no-cls')
})

Object.keys(directives).forEach((directiveKey) => {
  app.directive(directiveKey, directives[directiveKey])
})

app.provide('globalMsg', 'hello-world')

app.use(ElementPlus)

app.mount('#app')
