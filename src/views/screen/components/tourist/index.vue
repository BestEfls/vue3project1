<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>9999</span>人</p>
    </div>
    <div class="number">
      <span v-for="item in people">{{ item }}</span>
    </div>
    <div ref="charts" class="charts">

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import * as Echarts from 'echarts'
// 引入水球图拓展插件
import 'echarts-liquidfill'

let people = ref('215908人')

let charts = ref<HTMLDivElement>()

onMounted(()=>{
  // 创建echarts实例
  let myEcharts = Echarts.init(<HTMLDivElement>charts.value)
  // 设置创建好的实例的配置项
  myEcharts.setOption({
    //标题组件
    title: {
            text: '水球图',
            textStyle:{
              color:'#fff'
            }
        },
        //x|y轴组件
        xAxis: {},
        yAxis: {},
        //系列:决定你展示什么样的图形图标
        series: {
            type: 'liquidFill',//系列
            data: [0.8, 0.4, 0.2],//展示的数据
            waveAnimation: true,//动画
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '80%',//半径
            outline: {//外层边框颜色设置
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'skyblue',
                    borderColor: '#294D99',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
  })
})
</script>

<style scoped lang="less">
.box{
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 15px;
  .top{
    .title{
      color: #fff;
      font-size: 20px;
      margin-top: 20px;
    }
    .bg{
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      margin-top: 10px;
    }

    .right{
      color: #fff;
      float: right;
      font-size: 20px;
      span{
        color:darkorange
      }
      margin-right: 20px;
    }

  }
  .number{
    margin-top: 30px;
    display: flex;
    padding: 10px;
    span{
      flex: 1;
      height: 40px;
      width: 45px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 24px;
      margin: 0 3px;
    }
  }
  .charts{
    width: 100%;
    height: 270px;
  }
}
</style>