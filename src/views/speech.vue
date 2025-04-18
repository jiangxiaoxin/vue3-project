<template>
  <div v-for="(item, index) in tableList" :key="index">
    <view style="margin: 10px; padding: 10px">{{ item }}</view>
  </div>
  <button @click="testSound">测试</button>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'

function getAllData() {
  return Promise.resolve([
    {
      id: 1,
      name: '张三',
      classCode: '3',
      workCenterCode: '2'
    },
    {
      id: 2,
      name: '李四',
      classCode: '4',
      workCenterCode: '1'
    },
    {
      id: 3,
      name: '王五',
      classCode: '1',
      workCenterCode: '1'
    },
    {
      id: 33,
      name: '123王五',
      classCode: '4',
      workCenterCode: '1'
    },
    {
      id: 32222,
      name: '2222王五',
      classCode: '1',
      workCenterCode: '1'
    },
    {
      id: 4,
      name: '赵六',
      classCode: '1',
      workCenterCode: '3'
    },
    {
      id: 5,
      name: '孙七',
      classCode: '2',
      workCenterCode: '4'
    },
    {
      id: 6,
      name: '周八',
      classCode: '5',
      workCenterCode: '3'
    }
  ])
}

let onceTalkTime = 15_000 // 一次播报用的时间
let pageTime = 20_000 // 一页停留时间

let pageSize = 8 // 每页显示8条数据

// 获取全部数据

function work() {
  console.log('====--=-= 完全新的一次数据请求 =-=-====')

  getAllData().then((res) => {
    let list = res
    // 获取数据后，判断哪些数据需要播放
    list.forEach((item) => {
    //   item.talk = Math.random() > 0.5 // test
        item.talk = true // test
    })
    // 先按照workCenterCode进行分组
    list.sort((a, b) => a.workCenterCode - b.workCenterCode)
    // console.log(list);

    let lineMap = {}
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (lineMap[item.workCenterCode]) {
        lineMap[item.workCenterCode].push(item)
      } else {
        lineMap[item.workCenterCode] = [item]
      }
    }

    // 再按照物料进行分组
    for (let key in lineMap) {
      lineMap[key].sort((a, b) => a.classCode - b.classCode)
    }

    // console.log('lineMap', lineMap);

    let lineCount = Object.keys(lineMap).length // 产线数量

    lineList = new Array(lineCount).fill(null)
    for (let key in lineMap) {
      //TODO  这里后台返回的workCenterCode 是 002100203 这种格式，要转成 1 ，2,3 这种产线格式。提前写一个固定配置
      lineList[key - 1] = lineMap[key]
    }

    // lineList = lineList.filter((item) => item)

    console.log('分好组了', lineList) // 分好组了

    walkLine()
  })
}

// work()

let tableList = ref([]) // 当前页面显示的数据
let pageScrollInterval = null
let pageTalkInterval = null
let currentLineIndex = 0 // 当前产线索引
let lineList
let currentTalkIndex = 0 // 完整的播放列表里的序号
let currentTalkRepeatList = [] // 当前页，完整的播放列表
let currentLinePageIndex = 0 // 当前产线翻页的索引

let talkLoopCount = ref(0) // 当前产线，需要播报的数据，是否完整播放一圈了
let pageLoopCount = ref(0) // 当前产线，需要翻页的数据，是否完整翻了一圈了

let repeatCount = 3 // 播报次数

// 开始处理某条产线数据
function walkLine() {
  let currentLineList = lineList[currentLineIndex]
  let currentLineTalkList = currentLineList.filter((item) => item.talk)

  // 播报数据
  if (currentLineTalkList.length === 0) {
    // 不需要播报，那就只需要翻页就行了
    talkLoopCount.value = 1 // 直接设置为1，表示已经播报完了
  } else {
    // 需要播报，设置为0，表示还没有播报完
    talkLoopCount.value = 0
    currentTalkRepeatList = []
    for (let i = 0; i < repeatCount; i++) {
      currentTalkRepeatList = currentTalkRepeatList.concat(currentLineTalkList)
    }
    // 开始播报
    currentTalkIndex = 0

    function onceTalk() {
      if (currentTalkIndex >= currentTalkRepeatList.length) {
        currentTalkIndex = 0
        talkLoopCount.value = 1 // 播报完了.
        console.log('起码播放一遍了')
      }
      let currentTalkItem = currentTalkRepeatList[currentTalkIndex]
      // 播报当前数据
      talk(currentTalkItem)
      currentTalkIndex++
    }

    pageTalkInterval = setInterval(() => {
      onceTalk()
    }, onceTalkTime)

    onceTalk() // 先播报一次，避免第一次延迟
  }

  // 翻页数据
  currentLinePageIndex = 0
  pageLoopCount.value = 0

  function oncePage() {
    if (currentLinePageIndex >= Math.ceil(currentLineList.length / pageSize)) {
      // 翻页已经起码一遍了
      currentLinePageIndex = 0
      pageLoopCount.value = 1
      console.log('起码翻页一遍了')
    }
    let showList = currentLineList.slice(
      currentLinePageIndex * pageSize,
      currentLinePageIndex * pageSize + pageSize
    )
    while (showList.length < pageSize) {
      showList.push({}) // 补齐数据
    }
    tableList.value = showList
    currentLinePageIndex++
  }

  pageScrollInterval = setInterval(() => {
    oncePage()
  }, pageTime)

  oncePage() // 先翻页一次，避免第一次延迟
}

watch([talkLoopCount, pageLoopCount], (newValue) => {
  if (newValue[0] === 1 && newValue[1] === 1) {
    // 播报完了，翻页也翻完了，开始下一个产线
    clearInterval(pageScrollInterval)
    clearInterval(pageTalkInterval)
    currentLineIndex++

    // 开始下一次之前，需要重置数据
    currentLinePageIndex = 0 // 重置翻页索引
    currentTalkIndex = 0 // 重置播报索引
    pageLoopCount.value = 0 // 重置翻页次数
    talkLoopCount.value = 0 // 重置播报次数

    // 如果已经到达最后一条产线了，那就下一次请求数据
    if (currentLineIndex >= lineList.length) {
      //TODO
      currentLineIndex = 0 // 重置产线索引
      work()
    } else {
      // 继续处理下一个产线
      console.log('继续处理下一个产线', currentLineIndex)

      walkLine()
    }
  }
})

function talk(talkItem) {
  console.log('🚀 ~ speech.vue:204 ~ talk ~ talkItem:', talkItem)

//   if (!alreadyTest.value) {
//     console.log('声音测试没有完成，不能播报')

//     return
//   }

  let message = talkItem.name + '，' + talkItem.classCode + '，' + talkItem.workCenterCode
//   let message = 'hello,哈哈哈'
  message = message.repeat(3)
  if (window.speechSynthesis.speaking) {
    alert('speechSynthesis.speaking')
    return
  }

  talkInstance(message)
}

function talkInstance(message) {
  const utterThis = new SpeechSynthesisUtterance(message)

  utterThis.onend = function (event) {}

  utterThis.onerror = function (event) {
    //   alert('onerror')
    console.log('onerror', event)
  }

  utterThis.onstart = function (event) {
    console.log('talkInstance onstart', event)
  }

  let voices = window.speechSynthesis.getVoices().filter((item) => item.lang === 'zh-CN')
  for(let i=0;i<voices.length;i++){
    console.log('voices', voices[i].name, voices[i].lang, voices[i].default, voices[i])
  }
  let voice = voices.find(item => item.default)
  if(!voice){
    voice = voices[0]
  } 

  const voiceName = 'Google 普通话（中国大陆）'
  window.speechSynthesis.getVoices().find((item) => item.name === voiceName)

  utterThis.voice = voice
  utterThis.pitch = 1
  utterThis.rate = 1.5
  utterThis.volume = 1
  utterThis.lang = 'zh-CN'
  window.speechSynthesis.speak(utterThis)
}

let alreadyTest = ref(false)

function testSound() {
  console.log('window', window);
  console.log('speee', window.speechSynthesis, );

  
  
  if (window.speechSynthesis.speaking) {
    alert('speechSynthesis.speaking')
    return
  }

  const utterThis = new SpeechSynthesisUtterance(new Date().toLocaleTimeString())

  utterThis.onstart = function (event) {
    console.log('onstart', event)
  }

  utterThis.onend = function (event) {
    console.log('onend', event)
    alreadyTest.value = true
  }

  utterThis.onerror = function (event) {
    alert('onerror', event)
  }

  const voiceName = 'Google 普通话（中国大陆）'
  window.speechSynthesis.getVoices().find((item) => item.name === voiceName)

  //utterThis.voice = window.speechSynthesis.getVoices().find((item) => item.name === voiceName)
  utterThis.pitch = 1
  utterThis.rate = 1.5
  utterThis.volume = 1
  //utterThis.lang = 'zh-CN'
  window.speechSynthesis.speak(utterThis)
}

onMounted(() => {
  // setTimeout(() => {
  //   testSound()
  // }, 3_000);

  // setInterval(() => {
  //   testSound()
  // }, 5000);
})
</script>
