<template>
  <div id="box">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import { getCurrentInstance,inject } from 'vue';
  let instance = getCurrentInstance()
  console.log(instance);
  
</script>

<style scoped lang="less">
</style>