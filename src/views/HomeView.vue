<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <glo />
  <!-- <main>
    <TheWelcome />
  </main> -->
  <div class="router-view-cls">
    <RouterView />
  </div>
</template>
