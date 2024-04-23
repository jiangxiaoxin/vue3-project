<template>
  <div v-container>
    <button @click="showAllRoutes">所有的路由</button>
    <button @click="addRouteToHome">给home添加个子路由</button>
    <button @click="toHomeChild">to home child</button>
    <button @click="addOneRoute">给app添加oneRoute</button>
    <button @click="toOneRoute">to oneRoute</button>
    <button @click="addAnotherRouteToHome">home相对路径子路由</button>
  </div>
  <!-- app 下有个根的router-view，那 router里 / 根路径配置的组件，就会在这个根的 router-view里 -->
  <ul v-container>
    <li>app.vue 下的router-view，加载 / 对应的路由配置中指定的 component</li>
    <li>而这个对应的component 就是 BlankView， 所以BlankView 组件会显示在这</li>
    <li>
      同时router 配置里，/
      路由会redirect去另外个路由，那个路由是home路由的子路由，所以那redirect去的路由会显示在
      BlankView的 router-view里
    </li>
    <li>
      但是要求 redirect 去的应该是 home 路由的子路由，如果不是子路由，比如 redirect 去
      about，那会发现配置的 component: BlankView 是不会显示的
    </li>
    <li>啥是子路由？在路由的children里的是子路由</li>
  </ul>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const addOneRoute = () => {
  router.addRoute({
    name: 'one-route',
    path: '/one-route',
    component: () => import('@/views/OneRoute/index.vue')
  })
}

const toOneRoute = () => {
  router.push('/one-route')
}

const showAllRoutes = () => {
  console.log('all routes:', router.getRoutes())
}

const addRouteToHome = () => {
  router.addRoute('home', {
    name: 'home-child-route',
    path: '/home/child',
    component: () => import('@/views/HomeView.vue')
  })
}

const toHomeChild = () => {
  router.push('/home/child')
}

const addAnotherRouteToHome = () => {
  router.addRoute('home', {
    name: 'home-another-route',
    path: '/home/another',
    component: () => import('@/views/HomeView.vue')
  })

  setTimeout(() => {
    router.push('/home/another')
  }, 1000)
}
</script>
