import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DirectivesView from '@/views/DirectivesView.vue'
import BlankView from '@/views/Blank.vue'
import PiniaView from '@/views/pinia/index.vue'
import DialogView from '@/views/dialog/DialogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
    }
  ]
})

export default router
