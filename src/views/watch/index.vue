<template>
  <div>
    <div v-container>
      <button @click="changeShallowList">shallow ref list</button>
      <ul>
        <li v-for="item in shallowList" :key="item">{{ item }}</li>
      </ul>
    </div>
    <p>{{ JSON.stringify(pinfo, null, 4) }}</p>
    <button @click="funca">111</button>
    <button @click="funcb">2222</button>
    <button @click="funcc">pinfo.time</button>
    <button @click="funcd">pinfo.foo.bar</button>
    <div>
      <button
        @click="
          () => {
            shallowRefInfo.time = Math.random()
          }
        "
      >
        shallowRef info.time:{{ shallowRefInfo.time }}
      </button>
      <button
        @click="
          () => {
            let a = Math.random()
            shallowRefInfo.foo.bar = a
            console.log('123', a, shallowRefInfo)
          }
        "
      >
        123shallowRef info.foo.bar :{{ shallowRefInfo.foo.bar }}
      </button>
      <button @click="resetShallowRefInfo">shallowRefInfo info {{ shallowRefInfo.time }}</button>
    </div>

    <div v-container>
      <button
        @click="
          () => {
            count++
            shallowCount = Math.random()
          }
        "
      >
        count:{{ count }} shallow: {{ shallowCount }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, watchEffect, shallowRef } from 'vue'

const shallowList = shallowRef<number[]>([])
watch(shallowList, () => {
  console.log('==watch shallowList ----')
})
const changeShallowList = () => {
  let ar = []
  for (let i = 0; i < 5; i++) {
    ar.push(Math.random())
  }
  shallowList.value = ar
}

const count = ref(0)
const shallowCount = shallowRef(0)

const info = {
  time: Math.random(),
  foo: {
    bar: Math.random()
  }
}

const pinfo = reactive(info)
let shallowRefInfo = shallowRef(info)

const resetShallowRefInfo = () => {
  // shallowRefInfo = ref({
  // time: Math.random(),
  // foo: {
  //   bar: Math.random()
  // }
  // })

  shallowRefInfo.value = {
    time: Math.random(),
    foo: {
      bar: Math.random()
    }
  }
}

watchEffect(() => {
  console.log('pinfo watchEffect info', pinfo)
})

const funcc = () => {
  pinfo.time = Math.random()
}

const funcd = () => {
  pinfo.foo.bar = Math.random()
}

const funca = () => {
  info.time = Math.random()
  console.log('--func', info)
}

const funcb = () => {
  info.foo.bar = Math.random()
}

watchEffect(() => {
  console.log('info.time', info.time)
})

// watch(
//   () => info,
//   (newV, oldV) => {
//     console.log('info new', newV)
//     console.log('info old', oldV)
//   },
//   {
//     deep: true
//   }
// )
</script>
