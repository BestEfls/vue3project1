<template>
  <div class="logo_container">
    <img :src="getImage(path)" alt="">
    <p>{{ props.title }}</p>
  </div>
</template>

<script setup lang="ts">
const getImage = (name: string): string => {
    return new URL(`../assets/${name}`, import.meta.url).href
}
let props = defineProps({
  path:{
    type:String,
    default:''
  },
  title:{
    type:String,
    default:''
  }
})
</script>

<style scoped lang="less">
  .logo_container{
    display: flex;
    align-items: center;

    width: @base_menu_width;
    height: 70px;
    justify-content:space-evenly;
    img{
      width: 60px;
      height: 60px;
      position: relative;
      left: -10px;
    }
    p{
      font-size:20px;
      font-family:'宋体';
      font-weight: bolder;
      color:#ccc;
      position: relative;
      left: -10px;
    }
  }
</style>