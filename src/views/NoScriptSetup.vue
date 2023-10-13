<template>
  <div>
    <p v-world>{{ count }}</p>
    <button @click="add">add</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ref, reactive } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    const add = () => {
      count.value++
    }
    return {
      count,
      add
    }
  },
  directives: {
    world: {
      mounted: (el) => {
        console.log('world, ', el)
      },
      updated: (el) => {
        console.log('world updated, ', el)
      }
    }
  }
})
</script>
