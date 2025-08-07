import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DirectivesView from '@/views/DirectivesView.vue'
import BlankView from '@/views/Blank.vue'
import PiniaView from '@/views/pinia/index.vue'
import DialogView from '@/views/dialog/DialogView.vue'
import { defineAsyncComponent } from 'vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import mg1 from '@/components/mg1.vue'
import OffscreenCanvasDemo from '@/views/offscreen-canvas-demo.vue'

export const config = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    path: '/alive1',
    name: 'alive1',
    component: () => import('../views/keepAlive/one.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/alive2',
    name: 'alive2',
    component: () => import('../views/keepAlive/one.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/alive3',
    name: 'alive3',
    component: () => import('../views/keepAlive/one.vue'),
    meta: {
      keepAlive: true
    }
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
    component: () => import('../views/vxe/grid.vue')
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
  },
  {
    path: '/socket',
    name: 'socket',
    component: () => import('../views/socket/index.vue')
  },
  {
    path: '/vueuse',
    name: 'vueuse',
    component: () => import('../views/state/vueuse.vue')
  },
  {
    path: '/echart',
    name: 'echart',
    // component: () => import('../views/echart/index.vue')
    component: () => import("../views/echart/柱状图圆柱形.vue")
  },
  {
    path: '/chart1',
    name: 'chart1',
    // component: () => import('../views/echart/index.vue')
    component: () => import("../views/echart/立体圆柱柱状图.vue")
  },
  {
    path: '/dy',
    name: 'dynamicform',
    component: () => import('../views/form/index.vue')
  },
  {
    path: '/cform',
    name: 'component-form',
    component: () => import('../views/form/dyform.vue')
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('../views/draggable/index.vue')
  },
  {
    path: '/alp',
    name: 'alp',
    component: () => import('../views/alp/index.vue')
  },
  {
    path: '/fuziprops',
    name: '父子props',
    component: () => import('../views/props/父子传递.vue') //! 用中文起名也可以
  },
  {
    path: '/deep',
    name: 'deep',
    component: () => import('../views/ref和reactive/deep.vue')
  },
  {
    path: '/slot',
    component: () => import('../views/slot/index.vue')
  },
  {
    path: '/guide',
    component: () => import('../views/后台培训/index.vue')
  },
  {
    path: '/prepare',
    component: () => import('../views/prepare/index.vue')
  },
  {
    path: '/svg',
    component: () => import('../views/svg测试/index.vue')
  },
  {
    path: '/domapi',
    component: () => import('../views/domapi/index.vue')
  },
  {
    path: '/promise',
    component: () => import('../views/promise/index.vue')
  },
  {
    path: '/decimal',
    component: () => import('../views/decimal.vue')
  },
  {
    path: '/speech',
    component: () => import('../views/speech2.vue')
  },
  {
    path: '/offscreen-canvas',
    name: 'offscreen-canvas-demo',
    component: OffscreenCanvasDemo
  },
  {
    path: '/table-footer',
    name: 'table-footer',
    component: () => import("@/views/vxe/table-footer.vue")
  },
  {
    path: '/table-footer-custom',
    name: 'table-footer-custom',
    component: () => import("@/views/vxe/table-footer-custom.vue")
  },
  {
    path: '/table-merge-cell',
    name: 'table-merge-cell',
    component: () => import("@/views/vxe/table-merge-cell.vue")
  },
  {
    path: '/table-tree',
    name: 'table-tree',
    component: () => import("@/views/vxe/table-tree.vue")
  },
  {
    path: '/my-form-item',
    name: 'my-form-item',
    component: () => import("@/views/form/my-form-item.vue")
  },
  {
    path: '/group-by',
    name: 'group-by',
    component: () => import("@/views/vxe/group-table.vue")
  },
  {
    path: '/table',
    name: 'table',
    component: () => import("@/views/konva/demo4.vue")
  }
  // {
  //   path: '/leetcode',
  //   component: () => import('../views/leetcode.vue')
  // }
  // {
  //   path: '/view',
  //   component: () => import('../views/知识点/test1.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: config
})

export default router
