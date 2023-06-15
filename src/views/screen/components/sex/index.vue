<template>
  <div class="box">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="bar">
      <div class="man_bar"></div>
      <div class="woman_bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.box{
  position: relative;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin:0px 15px;
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
  .sex {
    display: flex;
    justify-content: center;
    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

  }

  .rate {
    display: flex;
    justify-content: space-around;
    color: white;
    margin-top: -10px;
  }

  .bar{
    width: 80%;
    height: 30px;
    position: absolute;
    left: 10%;
    margin-top:10px ;
    .man_bar{
      float: left;
      width: 58%;
      height: 100%;
      background-color: #007AFE;
    }
    .woman_bar{
      width: 42%;
      height: 100%;
      background-color: #FF4B7A;
      float: left;
      margin-top: 1px;
    }
  }
}
</style>