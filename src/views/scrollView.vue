<template>
  <div style="height: 200px">
    <el-scrollbar>
      <div v-for="index in 20" :key="index" style="height: 20px">index: {{ index }}</div>
    </el-scrollbar>
  </div>

  <div style="height: 200px">
    <el-scrollbar :native="true">
      <div v-for="index in 20" :key="index" style="height: 20px">index: {{ index }}</div>
    </el-scrollbar>
  </div>
</template>
