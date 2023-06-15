<template>
  <div class="layout_container">
    <div class="layout_slider" :class="{fold:layOutStore.fold}">
      <logo :title="'东理甄选运营平台'" :path="'logo.png'"></logo>
      <el-scrollbar class="scrollbar">
        <el-menu :collapse="layOutStore.fold" :default-active="route.path" background-color="#001529" text-color="#fff" active-text-color="#95C42A">
          <!-- 
            el-menu组件属性解析:
              default-active:指定页面加载时默认激活的菜单. 值是要激活的那个菜单的index. 可以用来实现刷新页面后展示对应路由的菜单效果
              collapse:水平折叠收起菜单
              background-color:菜单背景颜色
              active-text-color:菜单激活时的颜色
           -->
          <Menu :user-menu="userStore.userMenu"></Menu>
        </el-menu> 
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{fold:layOutStore.fold}">
      <Tabbar></Tabbar>
    </div>
    <div class="layout_main" :class="{fold:layOutStore.fold}">
      <transition-com></transition-com>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo.vue'
import Menu from './Menu.vue';
import transitionCom from './TransitionCom.vue';
import Tabbar from './tabbar/index.vue'

import useUserStore from '@/store/modules/user.ts'
import useLayOutSettingStore from '@/store/modules/setting.ts'

import { useRoute } from 'vue-router';

let userStore = useUserStore()
let layOutStore = useLayOutSettingStore()

let route = useRoute()


</script>

<style scoped lang="less">
.layout_container{
  width: 100%;
  height: 100vh;
  .layout_slider{
    width: @base_menu_width;
    height: 100vh;
    background:@base_menu_background;
    overflow: hidden;
    transition: all 0.3s;
    .scrollbar{
      height: calc(100% - 70px);
      .el-menu{
        border-right:none
      }
    }

    &.fold{
      width: @base_menu_folded_width;
    }
  }
  .layout_tabbar{
    width: calc(100% - @base_menu_width);
    height: @base_tabbar_height;
    position: fixed;
    top: 0;
    left: @base_menu_width;
    box-shadow: 6px 6px 5px #555;
    transition: all 0.3s;
    &.fold{
      width: calc(100% - @base_menu_folded_width);
      left: @base_menu_folded_width;
    }
  }
  .layout_main{
    width:calc(100% - @base_menu_width) ;
    height: calc(100vh - @base_tabbar_height);
    box-sizing: border-box;
    position: absolute;
    top: @base_tabbar_height;
    left:@base_menu_width ;
    padding: 20px;
    overflow: auto; 
    transition: all 0.3s;
    &.fold{
      width: calc(100% - @base_menu_folded_width);
      left: @base_menu_folded_width;
    }
  }
}
</style>