// 用在首页展示的
// ! 可以通过 import.meta 获取路由文件
const routes = [
  {
    to: '/',
    title: 'Home'
  },
  {
    to: '/about',
    title: 'About'
  },
  {
    to: '/directives',
    title: '指令'
  },
  {
    to: '/pinia',
    title: 'pinia测试集'
  },
  {
    to: '/dialog',
    title: '弹出框dialog'
  },
  {
    to: '/teleport',
    title: 'Teleport测试'
  },
  {
    to: '/scoped',
    title: 'scoped样式测试'
  },
  {
    to: '/tsx',
    title: 'tsx组件'
  },
  {
    to: '/scroll',
    title: 'scroll组件'
  },
  {
    to: '/ref',
    title: '测试ref'
  },
  {
    to: '/reactive',
    title: '测试reactive'
  },
  {
    to: '/vueuse',
    title: 'vueuse测试'
  }
]

export default routes
