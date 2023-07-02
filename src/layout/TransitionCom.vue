<template>
  <router-view #default="a"><!-- 路由过渡动效 a.route代表当前路由对象,a.component代表虚拟dom -->
      <transition  enter-active-class="animate__animated animate__backInDown">
        <component :is="a.Component" v-if="flag"></component>
      </transition>
    </router-view>
</template>

<script setup lang="ts">
import 'animate.css'
import useLayOutSettingStore from '@/store/modules/setting.ts'
import {watch,ref,nextTick} from 'vue';

let layOutStore = useLayOutSettingStore()

let flag = ref(true)

watch(()=>layOutStore.refreshing,()=>{
  flag.value=false 
  nextTick(()=>{
    flag.value = true
  })
})
</script>

<style scoped>
.animate__animated.animate__backInDown{
  --animate-duration: 400ms
}
</style>