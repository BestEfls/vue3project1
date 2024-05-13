<template>
  <div id="box">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import { getCurrentInstance,reactive,ref } from 'vue';
  import axios from 'axios';

</script>
<style scoped lang="less">
</style>