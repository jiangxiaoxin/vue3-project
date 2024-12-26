<template>
  <div>num: {{ num }}</div>
  <div>str: {{ str }}</div>
  <div>arr: {{ arr }}</div>
  <div>
    map size: {{ map.size }}
    <button @click="changeMap">改map</button>
    <p>map: {{ map }}</p>
  </div>
  <div>
    set size: {{ set.size }}
    <button @click="changeSet">改set</button>
    <p>set: {{ set }}</p>
  </div>

  <div v-container></div>

  <div>
    <code>reactive 深层次对象中深层次的属性也能响应式</code>
    <p>objReactive.child.name: {{ objReactive.child.name }}</p>
    <button @click="objReactive.child.name = Date.now().toString()">修改</button>
  </div>

  <div>
    <code>动态给ref 和 reactive 添加属性呢</code>
    <button @click="addDynamic">添加</button>
    <code>
        <br>
        ref obj.deep: {{ obj.deep }}
        <br>
        reactive objReactive.deep:{{ objReactive.deep }}
    </code>
  </div>

  <div>
    <div>
        ref 包对象， person.value.address.city: {{ person.address.city }}
        <button @click="person.address.city = 'london'">改</button>
    </div>
    
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const num = ref(10)
const str = ref('hello')
const arr = ref([1, 2, 3])
const map = ref(new Map())
const set = ref(new Set())
const obj = ref<any>({})

const person = ref({ name: 'Alice', address: { city: 'Paris' } });

const changeMap = () => {
  map.value.set(map.value.size, 1)
}

const changeSet = () => {
  set.value.add(set.value.size)
}

// const undefinedRef = ref(undefined)
// const nullRef = ref(null)
// const zeroRef = ref()

// const undefinedRec = reactive(undefined)
// const nullRec = reactive(null)
// const zeroRec = reactive()
// const arrRec = reactive([])
// const mapRec = reactive(new Map())
// const setRec = reactive(new Set())

const objReactive = reactive({
  name: 'hello',
  age: 19,
  likes: ['eat', 'sleep'],
  child: {
    name: 'child',
    age: 10
  }
})

const addDynamic = () => {
    obj.value.deep = Date.now()
    objReactive.deep = Date.now()
}

</script>
