<template>
  <p>foo:{{ foo }}</p>
  <p>time: {{ res.time }}</p>
  <button @click="changeFoo">改foo</button>
  <button @click="stopScope">stop scope</button>
</template>

<script setup lang="ts">
import { EffectScope, ref, watch, watchEffect, computed } from 'vue'
const foo = ref(Date.now())

const changeFoo = () => {
  foo.value = Date.now()
}

watchEffect(() => {
  console.log('--watcheffect foo', foo.value)
})

const scope = new EffectScope()
const res = scope.run(() => {
  watch(foo, () => {
    console.log('scope watch,foo', foo.value)
  })
  watchEffect(() => {
    console.log('scope watch effect,foo', foo.value)
  })
  const time = computed(() => {
    return new Date(foo.value)
  })

  return {
    time
  }
})

const stopScope = () => {
  scope.stop()
}
</script>
