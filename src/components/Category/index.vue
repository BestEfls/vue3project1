<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="一级分类" prop="category1">
          <el-select v-model="categoryStore.c1ID" :disabled="scene?true:false" @change="c1Change">
            <el-option v-for="item in categoryStore.c1Arr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="category2">
          <el-select v-model="categoryStore.c2ID" :disabled="scene?true:false" @change="c2Change">
            <el-option v-for="item in categoryStore.c2Arr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" prop="category3">
          <el-select v-model="categoryStore.c3ID" :disabled="scene?true:false">
            <el-option v-for="item in categoryStore.c3Arr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 引入小仓库
import useCategoryStore from '@/store/modules/category.ts'
import { onMounted,ref } from 'vue';

let categoryStore = useCategoryStore()

defineProps(['scene'])

// 组件挂载后发送请求,获取一级分类
onMounted(()=>{
  getC1()
})

const getC1 = ()=>{
  categoryStore.getC1()
}

const c1Change = ()=>{
  categoryStore.c2ID = ''
  categoryStore.c3ID = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}

const c2Change = ()=>{
  categoryStore.c3ID = ''
  categoryStore.getC3()
}
</script>

<style scoped>

</style>