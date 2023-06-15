<template>
  <div>
    <img src="../../assets/images/error_images/404.png" alt="">
  </div>
</template>

<script setup lang="ts">
import {useRoute,onBeforeRouteUpdate,onBeforeRouteLeave} from 'vue-router'
import { onMounted } from 'vue';
let route = useRoute();
onMounted(()=>{
  console.log(route.params);
})

onBeforeRouteLeave(()=>{
  console.log("1wqeqw");
})

onBeforeRouteUpdate(()=>{
  console.log(route.params);
  // console.log(to);
  // console.log(from);
})

</script>

<style scoped>

</style>