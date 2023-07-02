<template>
  <div>
    <el-card class="box_container">
      <el-card class="sentence">
        {{ sentence }}<span class="cursor">_</span>
      </el-card>
      <el-card class="header">
        <img :src="userStore.avatar" alt="" @click="show=!show">
        <div class="username">
          {{ time }},{{ userStore.username }}
          <br>
          <span>东理甄选运营平台</span>
          <canvas id="c1" width="600" height="400"></canvas>
        </div>
      </el-card>
      <img src="../../assets//forest-7774205_1920.jpg" style="width: 100%;height: 330px;margin-top: 20px;" alt="">
    </el-card>
    <div class="popNotify" v-show="show">
      <div>学号:2021213147</div>
      <div>班级:2121805</div>
      <div>姓名:万腾</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import request from '@/utils/request';
let userStore = useUserStore()
const getTime = (): string => {
  let hours = new Date().getHours()
  if (hours <= 9) {
    return '早上好'
  } else if (hours <= 12) {
    return '上午好'
  } else if (hours <= 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
}
let show = ref<boolean>(false)
let time = ref<string>(getTime())
let sentence = ref<string>('Hello World!!!')


const cursorAnimation = ():void=>{
  request.get<any, any>('https://api.apiopen.top/api/sentences').then((res) => {
    let tt = setInterval(() => {
      sentence.value = sentence.value.slice(0, sentence.value.length - 1)
      if (sentence.value.length == 0) {
        clearInterval(tt)
        let index = 0
        let t = setInterval(() => {
          sentence.value = sentence.value + res.result.name.charAt(index)
          index++
          if (res.result.name.length < index) {
            clearInterval(t)
            setTimeout(()=>{
              cursorAnimation()
              
            },2000)
          }
        }, 500)
      }
    }, 300)
  })
}

onMounted(() => {
  cursorAnimation()
  const c1: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('c1')
  const ctx = <CanvasRenderingContext2D>c1.getContext('2d')
  ctx.translate(300, 200)

  ctx.save() // 先进行状态的保存



  function render() {
    ctx.clearRect(-300, -200, 600, 400)
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      ctx.rotate((Math.PI * 2) / 12)
      ctx.lineWidth = 7
      ctx.strokeStyle = 'gray'
      ctx.moveTo(170, 0)
      ctx.lineTo(190, 0)
      ctx.stroke()
      ctx.closePath()
    }

    ctx.restore()
    ctx.save()
    for (let i = 0; i < 60; i++) {
      ctx.beginPath()
      ctx.rotate((Math.PI * 2) / 60)
      ctx.lineWidth = 2
      ctx.strokeStyle = 'gray'
      ctx.moveTo(180, 0)
      ctx.lineTo(190, 0)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()


    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    hours = hours > 12 ? hours - 12 : hours

    ctx.save()
    ctx.beginPath()
    ctx.rotate(seconds * (Math.PI * 2 / 60))
    ctx.lineWidth = 1
    ctx.strokeStyle = '#f00'
    ctx.moveTo(0, 10)
    ctx.lineTo(0, -150)

    ctx.stroke()
    ctx.closePath()

    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.rotate(minutes * (Math.PI * 2 / 60) + (Math.PI * 2 / 60) * (seconds / 60))
    ctx.lineWidth = 3
    ctx.moveTo(0, 10)
    ctx.lineTo(0, -120)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.rotate(hours * (Math.PI * 2 / 12) + (Math.PI * 2 / 12) * (minutes / 60))
    ctx.lineWidth = 5
    ctx.moveTo(0, 10)
    ctx.lineTo(0, -90)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()

    ctx.arc(0, 0, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#ccc'
    ctx.fill()
    requestAnimationFrame(render)
    
  }


  ctx.arc(0, 0, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#ff0000'
  ctx.fill()

  render()

})

</script>

<style scoped lang="less">
  .popNotify{
    width: 300px;
    height: 240px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    left: 150px;
    top: 200px;
    box-shadow: 3px 3px 3px #ccc,-3px 3px 3px #ccc ;
    padding: 20px ;
    div{
      border-bottom: #ccc 1px solid;
      width: 80%; 
      height:30px;
      line-height: 30px;
      margin-top: 10px;
      &:nth-child(4){
        height: 60px;
        line-height: 30px;
      }
    }
    
  }
.box_container {
  @keyframes wink{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1; 
  }
} 
  .sentence{
    font-family: 'Courier New', Courier, monospace;
    margin-bottom: 20px;
  }
  .cursor{
    animation: wink 0.8s infinite;
  }
  .header {
    position: relative;
    height: 200px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      float: left;
    }

    #c1 {
      transform: scale(0.45);
      position: absolute;
      top: -100px;
      right: -100px;
    }

    .username {
      float: left;
      line-height: 50px;
      font-size: 30px;
      margin-left: 20px;

      span {
        font-size: 18px;
        font-family: 'Courier New', Courier, monospace;
        position: relative;
        top: 15px;
        color: mediumturquoise;
        font-style: italic;
      }
    }
  }
}</style>