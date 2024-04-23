import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DirectivesView from '@/views/DirectivesView.vue'
import BlankView from '@/views/Blank.vue'
import PiniaView from '@/views/pinia/index.vue'
import DialogView from '@/views/dialog/DialogView.vue'
import { defineAsyncComponent } from 'vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

export const config = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'home',
    component: BlankView
    // redirect: '/about'
    // redirect: '/home/index',
    // children: [
    //   {
    //     path: '/home/index',
    //     name: 'homex',
    //     // component: defineAsyncComponent(() => import('@/views/HomeX.vue'))
    //     component: () => import('@/views/HomeX.vue')
    //     // component: () => import('../views/AboutView.vue')
    //   }
    // ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/directives',
    name: 'directives',
    component: DirectivesView
  },
  {
    path: '/pinia',
    name: 'pinia',
    component: PiniaView
  },
  {
    path: '/dialog',
    name: 'dialog',
    component: DialogView
  },
  {
    path: '/teleport',
    name: 'teleport',
    component: () => import('@/views/teleport/teleporta.vue')
  },
  {
    path: '/scoped',
    name: 'scoped',
    component: () => import('@/views/scoped/index.vue')
  },
  {
    path: '/tsx',
    name: 'tsx',
    component: () => import('@/views/writeTsx/index.vue')
  },
  {
    path: '/scroll',
    name: 'scroll',
    component: () => import('@/views/scroll/index.vue')
  },
  {
    path: '/ref',
    name: 'ref',
    component: () => import('@/views/ref和reactive/ref')
  },
  {
    path: '/reactive',
    name: 'reactive',
    component: () => import('@/views/ref和reactive/reactive')
  },
  {
    path: '/props',
    name: 'props',
    component: () => import('@/views/props/index.vue')
  },
  {
    path: '/watch',
    name: 'watch',
    component: () => import('@/views/watch/index.vue')
  },
  {
    path: '/reac',
    name: 'reactivity',
    component: () => import('@/views/ref和reactive/reactivity.vue')
  },
  {
    path: '/css',
    name: 'css',
    component: () => import('@/views/css/index.vue')
  },
  {
    path: '/tinyforest',
    name: 'tinyforest',
    component: () => import('@/views/tinyforest/index.vue')
  },
  {
    path: '/vuex/demo1',
    name: 'vuex-demo1',
    component: () => import('../views/vuex/demo1/index.vue')
  },
  {
    path: '/vuex/demo2',
    name: 'vuex-demo2',
    component: () => import('../views/vuex/demo1/main.vue')
  },
  {
    path: '/keepalive',
    name: 'keepalive',
    component: () => import('../views/keepAlive/index.vue')
  },
  {
    path: '/antd',
    name: 'antd',
    component: () => import('../views/antd/form.vue')
  },
  {
    path: '/flex',
    name: 'flex',
    component: () => import('../views/flex/index.vue')
  },
  {
    path: '/vxe',
    name: 'vxe',
    component: () => import('../views/vxe/index.vue')
  },
  {
    path: '/event',
    name: 'event',
    component: () => import('../views/eventlistener/index.vue')
  },
  {
    path: '/native',
    name: 'native',
    component: () => import('../views/nativeDom/index.vue')
  },
  {
    path: '/table',
    name: 'table',
    component: () => import('../views/template/table.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
