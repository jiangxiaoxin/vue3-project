<template>
  <div class="app-rooter">
    <outer />
    <outer />
    <div>{{ JSON.stringify(Temp) }}</div>
    <RouterView class="router-view-in-app" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
// import routes from '@/router/router.config'
import { config as routes } from '@/router/index'
import AddRouteVue from '@/views/oneRoute/addRoute.vue'
import ModalProps from '@/views/vxe/modalprops.vue'
import ModalRef from '@/views/vxe/modalref.vue'
import outer from './views/ref和reactive/outer.vue'
import { template as Temp } from './views/ref和reactive/config'

// defineOptions({
//   name: 'VueProjectApp'
// })

const modalRef = ref<any>(null)
const openModal = () => {
  modalRef.value?.openModal()
}

const timer = ref(Date.now())
const show = ref(false)
const toggleVisible = () => {
  show.value = !show.value
  // timer.value = Date.now()
}

const customUpdate = (val: boolean) => {
  console.log('自定义的update监听', val)
  // show.value = val
}

watch(show, (newVal, oldVal) => {
  console.log('🚀 ~ parent watch ~ show:', newVal, oldVal)
})

const __msg = ref('123')

const msg = computed({
  get() {
    return __msg.value
  },
  set(value) {
    console.log('🚀 ~ set ~ value:', value)

    if (value.length > 5) {
      __msg.value = value.slice(0, 5)
    } else {
      __msg.value = value
    }
  }
})

console.log('普通的log===')
onMounted(() => {
  console.log('onMounted===', msg)
})

const showCookie = () => {
  console.log('cookie:', document.cookie)
}

const clearCookie = () => {
  throw new Error('123')
  let cookieKeys = document.cookie.match(/[^ =;]+(?=\=)/g)!

  // const cookie = cookieKeys
  //   ?.map((key) => {
  //     return key + '=0;expires=' + new Date(0).toUTCString()
  //   })
  //   .join(';')!

  // console.log(cookie)

  document.cookie = cookieKeys[0] + '=0;expires=' + new Date(0).toUTCString()

  // if (cookieKeys) {
  //   for (var i = cookieKeys.length; i--; ) {
  //     document.cookie = cookieKeys[i] + '=0;expires=' + new Date(0).toUTCString()
  //   }
  // }
}
</script>

<style scoped>
.app-rooter {
  width: 100%;
  height: 100%;
  position: relative;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    /* display: flex; */
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
