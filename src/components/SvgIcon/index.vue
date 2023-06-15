<template>
  <div>
    <svg :style="{width,height}">
      <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  prefix:{
    type:String,
    default:'#icon-'
  },
  name:{
    type:String,
    default:'home'
  },
  color:{
    type:String,
    default:'black'
  },
  width:{
    type:String,
    default:'16px'
  },
  height:{
    type:String,
    default:'16px'
  }
})
</script>

<style scoped>

</style>