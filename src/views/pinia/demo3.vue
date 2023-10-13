<template>
  <div>
    <h1>demo3</h1>
  </div>
</template>
<script lang="ts">
import { useCounterStore } from '@/stores/counter'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const store = useCounterStore()

    const msg = ref('123')

    return {
      store,
      msg
    }
  },
  methods: {
    foo() {
      this.msg.length
    }
  }
})
</script>
