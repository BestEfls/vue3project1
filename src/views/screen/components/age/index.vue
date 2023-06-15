<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import * as Echarts from 'echarts'
let charts = ref<HTMLDivElement>()

onMounted(()=>{
  let myEcharts = Echarts.init(<HTMLDivElement>charts.value)
  myEcharts.setOption({
    tooltip:{
      trigger:'item',
      show:true,
      formatter: "{a} <br/>{b} :{d}%",
      backgroundColor: "rgba(1, 13, 19, 0.5)",
      borderWidth: 1,
      textStyle: {
        color: "rgba(212, 232, 254, 1)",
      },
    },
    series:[
      {
        name:'年龄分布表',
        type:'pie',
        radius:'70%',
        center:['50%','50%'],
        data:[
          {value:12,name:'10岁以下'},
          {value:14,name:'10~18岁'},
          {value:33,name:'18~35岁'},
          {value:31,name:'35~65岁'},
          {value:10,name:'65岁以上'}
        ],

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
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
    }
    .bg{
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      margin-top: 10px;
    }

  }
  .charts{
    width: 100%;
    height: 270px;
    margin-top:10px;
  }
}
</style>