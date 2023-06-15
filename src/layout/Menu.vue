<template>
      <template v-for="(item) in userMenu" :key="item.path">
        <!-- 当路由没有子路由时 -->
        <el-menu-item v-if="!item.children&&item.meta.show" :index="item.path" @click="goRoute">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
        <!-- 当路由有且只有一个子路由时 -->
        <el-menu-item v-if="item.children&&item.children.length===1&&item.meta.show" :index="item.children[0].path" @click="goRoute">
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
        <!-- 当路由有子路由且数量大于1时 -->
        <el-sub-menu :index="item.path" v-if="item.children&&item.children.length>=2">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <Menu :user-menu="item.children"></Menu>
        </el-sub-menu>
      </template>
</template>

<script setup lang="ts">
 defineProps(['userMenu']);
 import { useRouter } from 'vue-router';
 let router = useRouter()
 document.onselectstart = ()=>{
  return false
 }

 const goRoute = (vc:any)=>{
  router.push(vc.index)
 }
</script>

<style scoped>

</style>