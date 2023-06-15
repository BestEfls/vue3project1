<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="toHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计数据</span>
      <span class="time">当前时间{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import getNowTime from '@/utils/getNowTime.ts'
let router = useRouter()

let time = ref<string>('')
let timer:any = 0

onMounted(()=>{
  timer=setInterval(()=>{
    time.value = getNowTime()
  },1000)
})

onBeforeUnmount(()=>{
  clearInterval(timer)
})


const toHome = ()=>{
  router.push('/home')
}
</script>

<style scoped lang="less">
.top{
  width: 100%;
  height: 100%;
  display: flex;
  .left{
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    .lbtn{
      float: right;
      width: 150px;
      height: 100%;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;   
    }
  }
  .right{
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn{
      float: left;
      width: 150px;
      height: 100%;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;   
    }
    .time{
      color: #29fcff;
      margin: 10px 20px;
      font-size: 18px;
    }
  }
  .center{
    flex: 2;
    .title{
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
      font-weight: bolder;
    }
  }
}
</style>