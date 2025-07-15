<template>
  <!-- <quality :data="qualityData"/> -->

  <!-- <testEstimatedHeightList /> -->
  <!-- <testFixedHeightTransform /> -->
  <!-- <fixedHeight /> -->

  <!-- <div style="display: flex; background-color: blue; align-items: stretch">
    <div style="width: 80%; background-color: green">
      <div style="height: 20px">80</div>
      <div style="height: 30px">80</div>
    </div>
    <div style="width: 20%; background-color: red">
      <div style="width: 100%; height: 100%; background-color: gold; line-height: 1.4">20</div>
    </div>
  </div> -->
  <!-- 
  <div>obj.name:{{ obj1.name }}</div>
  <div @click="addSize">obj.size:{{ obj1.size }}</div> -->

  <!-- <button @click="addWatch">watch</button>
  <button @click="count++">{{ count }}</button>

  <input type="text" v-model="message" />
  <button @click="talk">speack</button>

  <div>
    <button @click="goto(1)">alive1</button>
    <button @click="goto(2)">alive2</button>
    <button @click="go3">alive3</button>
    <button @click="go4">alive4</button>
    <button @click="gotoAbout">about</button>
  </div> -->

  <router-view v-slot="{ Component }">
    <keep-alive :include="aliveIncludes">
      <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.fullPath" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
  <!-- <div v-if="!router.currentRoute.value.meta?.keepAlive">

    <div>out keep-alive:::{{ router.currentRoute.value.meta?.keepAlive }}</div>
    <router-view></router-view>
  </div> -->
</template>

<script lang="ts">
// import './js/arrow-function'

const obj1 = ref<BigObj>({ name: 'obj1', size: 100 })

const addSize = () => {
  obj1.value.size++
}

let fn: typeof API.getListApi

fn = () => {
  return [1, 2, 3]
}

console.log(fn())

// console.log(API)
</script>

<script setup lang="ts">
import fixedHeight from './views/longList/fixedHeight.vue'
import testFixedHeightTransform from './views/longList/testFixedHeightTransform.vue'
import testEstimatedHeightList from './views/longList/testEstimatedHeightList.vue'
import { onMounted, ref, watch, type WatchHandle } from 'vue'

// import VConsole from 'vconsole';

// const vConsole = new VConsole();

const count = ref(100)

let stopWatch: WatchHandle|undefined

const addWatch = () => {
  if(stopWatch) {
    stopWatch()
    stopWatch = undefined
  }
 stopWatch =  watch(count, (newVal, oldVal) => {
    console.log('count', newVal, oldVal);
  })
}


onMounted(() => {
  console.log('env', import.meta.env.VITE_VITE_SOME_KEY, import.meta.env);
  
})


import quality from './quality.vue'
import { Decimal } from 'decimal.js'

// const message = ref('你有一条新的送料信息，请注意查看！1号线送料机需要10吨啤酒花')
const message = ref('产线包装100#机台灌酒机物料青岛啤酒干啤316瓶盖数量为900')

// 语音播报
// https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/


let startTime = 0
const talk = () => {
  console.log('message', message.value)
  console.log('voices');
  console.log(window.speechSynthesis.getVoices());
  
  

  if (window.speechSynthesis.speaking) {
    alert('speechSynthesis.speaking')
    return
  }

  if (message.value !== '') {
    const utterThis = new SpeechSynthesisUtterance(message.value)

    utterThis.onstart = function (event) {
      console.log('talkInstance onstart', event)
    }

    utterThis.onend = function (event) {
      let endTime = Date.now()
      let duration = endTime - startTime
      alert('onend::' + duration)
    }

    utterThis.onerror = function (event) {
      alert('onerror' + event.error )
      console.log(event)
    }

    const voiceName = 'Google 普通话（中国大陆）'
    console.log(window.speechSynthesis.getVoices().find((item) => item.name === voiceName));
    

    // utterThis.voice = window.speechSynthesis.getVoices().find((item) => item.name === voiceName)!
    utterThis.pitch = 1
    utterThis.rate = 1.5
    utterThis.volume = 1
    utterThis.lang = "zh-CN";
    startTime = Date.now()
    window.speechSynthesis.speak(utterThis)
  }
}

onMounted(() => {
  // setTimeout(() => {
  //   talk()
  // }, 2000)
})

onMounted(() => {
  // @ts-ignore
  window.Decimal = Decimal
})

const qualityData = ref([
  ['糖化', 125, 10, 40, 10],
  ['发酵', 125, 230, 110, 20],
  ['清酒', 125, 120, 330, 1110],
  ['包装', 125, 420, 120, 10]
])

const aliveIncludes = [] // 如果这里不加对应的名字，但又在keep-alive上用了include，那就虽然包在keep-alive里，但依然不会缓存
import router from '@/router'

const goto = (val) => {
  router.push('/alive' + val + '?id=' + val)
}

const gotoAbout = () => {
  router.push('/about')
}

const go3 = () => {
  router.push('/alive3?id=3')
}

const go4 = () => {
  router.push('/alive3?id=4')
}

/**
 * 1
 * 2
 * 4444
 * main res 5555
 * res 2222
 * ---- 3333
 * 整了两条promise链
 */

function foo() {
  return Promise.resolve()
    .then(() => {
      console.log(1)

      new Promise((resolve, reject) => {
        console.log(2)
        setTimeout(() => {
          resolve(2222)
        }, 2000)
      })
        .then((res) => {
          console.log('res', res)
          return 3333
        })
        .then((res) => {
          console.log('----', res)
        })
    })
    .then(() => {
      console.log(4444)
      return 5555
    })
}

// foo().then(res => {
//     console.log('main res', res);

// })

/***
 * 1
 * 2
 * res 2222
 * ---- 3333
 * 4444
 * bar main res 5555
 * 把所有的promise 任务都放在一条链上
 */

function bar() {
  return Promise.resolve()
    .then(() => {
      console.log(1)

      return new Promise((resolve, reject) => {
        console.log(2)
        setTimeout(() => {
          resolve(2222)
        }, 2000)
      })
    })
    .then((res) => {
      console.log('res', res)
      return 3333
    })
    .then((res) => {
      console.log('----', res)
    })
    .then(() => {
      console.log(4444)
      return 5555
    })
}

// bar().then(res => {
//     console.log('bar main res', res);

// })
</script>
