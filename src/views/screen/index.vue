<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <top></top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <ChinaMap class="map"></ChinaMap>
          <LineMap class="line"></LineMap>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <year class="year"></year>
          <Couter class="couter"></Couter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
// 引入顶部组件
import Top from './components/top/index.vue'
// 引入左侧的三个组件
import Age from './components/age/index.vue'
import Sex from './components/sex/index.vue'
import Tourist from './components/tourist/index.vue'
// 引入中间的两个组件
import ChinaMap from './components/map/index.vue'
import LineMap from './components/line/index.vue'
// 引入右侧的三个组件
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Couter from './components/couter/index.vue'

let screen = ref<HTMLDivElement>()
onMounted(()=>{
  // @ts-ignore
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

function getScale(w=1920,h=1080){
  let ww = window.innerWidth/w
  let hh = window.innerHeight/h
  return ww<hh?ww:hh
}

window.onresize = ()=>{
  // @ts-ignore
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style scoped lang="less">
.container{
  width: 100vw;
  height: 100vh;
  background:url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen{
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top{
      width: 100%;
      height: 40px;
    }
    .bottom{
      display: flex;
      .left{
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist{
          flex: 1;
        }
        .sex{
          flex: 1;
        }
        .age{
          flex: 1;
        }
      }
      .right{
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 1040px;
        .rank{
          flex:1.3
        }
        .year{
          flex:1
        }
        .couter{
          flex:1
        }
      }
      .center{
        flex: 2;
        display: flex;
        flex-direction: column;
        .map{
          flex: 4;
        }
        .line{
          flex: 1;
        }
      }
    }
  }
}
</style>