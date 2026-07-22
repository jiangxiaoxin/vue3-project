<template>
  <div v-container>
    <h1>Page A</h1>
    <button @click="goToB">Go to B</button>
    <button @click="back">router back</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated, onDeactivated, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const query = route.query

onMounted(() => {
  console.log('Page A mounted', query)
})

onBeforeUnmount(() => {
  console.log('Page A onBeforeUnmount', query)
})

onActivated(() => {
  console.log('Page A activated', query)
})

onDeactivated(() => {
  console.log('Page A deactivated')
})

const goToB = () => {
  router.replace('/b')
}

const back = () => {
  router.back()
}
</script>
