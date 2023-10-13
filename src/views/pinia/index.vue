<template>
  <h1>pinia测试</h1>

  <ul>
    <li>
      <EffectScopeVue />
    </li>
    <li>
      <demo1 />
      <!-- <demo2 /> -->
    </li>
  </ul>
</template>
<script setup lang="ts">
import demo1 from './demo1.vue'
// import demo2 from './demo2.vue'
import EffectScopeVue from '@/views/effectScope/index.vue'
</script>
