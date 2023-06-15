<template>
  <div id="box">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import { reqLogin } from '@/api/user';
  import { onMounted } from 'vue';
  import {useRouter} from 'vue-router'
</script>

<style scoped lang="less">
</style>