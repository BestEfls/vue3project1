<template>
  <div class="tabbar_container">
    <div class="tabbar_left">
      <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="layOutStore.fold?'Fold':'Expand'"></component>
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in route.matched" :to="item.path" :key="index" v-show="item.meta.title">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar_right">
      <el-button circle icon="Refresh" @click="updateRefresh" @focus="btn1Foucs"></el-button>
      <el-button circle icon="FullScreen" @click="fullScreen" @focus="btn1Foucs"></el-button>
      <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker @change="setTheme" v-model="color" show-alpha :predefine="predefineColors" />
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="switchBtn"
              class="mt-2"
              style="margin-left: 24px"
              inline-prompt
              :active-icon="'Moon'"
              :inactive-icon="'Sunny'"
              @change="changeDark"
            />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button circle icon="Setting" @focus="btn1Foucs"></el-button>
        </template>
      </el-popover>
      <div class="avatar">
        <img width="32" style="border-radius: 50%;" height="32" :src="userStore.avatar" alt="">
      </div>
      <el-dropdown>
        <span class="el-dropdown-link" style="color:#ccc">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting.ts'
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let layOutStore = useLayOutSettingStore()
let userStore = useUserStore()
let route = useRoute()
let router = useRouter()
let switchBtn = ref<boolean>(false)

const color = ref<string>('rgba(255, 69, 0, 0.68)')
const predefineColors = ref<string[]>([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const changeIcon = () => {
  layOutStore.foldMenu()
}

const updateRefresh = () => {
  layOutStore.updateRefresh()
}


const fullScreen = () => {
  let full = document.fullscreenElement;// fullscreenElement是dom对象上的一个属性可以用来判断当前是不是全屏.如果是则为true,否则为fasle
  if (!full) {
    // 进入全屏模式 
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录
const logOut = async () => {
  await userStore.userLogOut()// 加await是为了保证退出登录成功后才导航到login路由
  router.push({ path: '/login', query: { redirect: route.path } })
}

// 取消el-button组件focus后的效果
const btn1Foucs = (e: any) => {
  let btn = e.target
  if (btn) {
    if (btn.blur) {
      btn.blur()
    }
  }
}

// switch按钮切换触发的函数
const changeDark = ()=>{
  let html = document.documentElement
  switchBtn.value?html.className='dark':html.className=''
}

const setTheme = ()=>{
  const html = document.documentElement
  console.log(html.style)
  html.style.setProperty('--el-color-primary',color.value)
  html.style.setProperty('--el-color-primary-light-5',color.value)
  
  let a=color.value.match(/\(.*(?=\))/)
  let b = a![0]
  let c = b.split(',')
  let d = parseFloat(c[c.length-1])/2
  let e = `rgba${c[0]},${c[1]},${c[2]},${d})`
  console.log(e);
  
  html.style.setProperty('--el-color-primary-light-3',e)
}
</script>

<style scoped lang="less">
.tabbar_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // background-image: linear-gradient(90deg, white, #001529);

  .tabbar_left {
    margin-left: 20px;
    display: flex;
    align-items: center;

    span {
      vertical-align: top;
      margin: 0 3px;
    }
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      margin: 0px 12px;
    }

    .el-dropdown-link {
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
      outline: none;
    }
  }
}
</style>