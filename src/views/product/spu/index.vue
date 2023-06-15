<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px;">
      <div v-show="scene==0">
        <el-button type="primary" icon="Plus" size="default" :disabled="categoryStore.c3ID ? false : true" @click="addSpu">添加SPU</el-button>
        <el-table border style="margin: 10px 0px;" :data="records">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column show-overflow-tooltip label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <el-button type="primary" icon="Plus" size="small" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" icon="Edit" size="small" title="修改SPU" @click="updateSpu(row)" ></el-button>
              <el-button type="primary" icon="View" size="small" title="查看SKU列表" @click="checkSku(row)"></el-button>
              <el-button type="primary" icon="Delete" size="small" title="删除" @click="deleteSpu(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 4, 5, 6]"
          :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="5"
          @current-change="getHasSpu" @size-change="sizeChange" />
      </div>
      <spuForm ref="spu" v-show="scene==1" @change-scene="changeScene1"></spuForm>
      <skuForm ref="sku" v-show="scene==2" @change-scene="changeScene2"></skuForm>

      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column labe="SKU图片">
            <template #="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="width: 120px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { reqHasSpu,reqSkuInfo,reqDeleteSpu } from '@/api/product/spu/index.ts'
import type { HasSpuResponseData, Records, SpuData,SkuData,SkuInfoResponseData } from '@/api/product/spu/type.ts'
import useCategoryStore from '@/store/modules/category';
// @ts-ignore
import { ElMessage } from 'element-plus';
import skuForm from './skuForm.vue'
import spuForm from './spuForm.vue'

let categoryStore = useCategoryStore()

let scene = ref<number>(0)// 0展示SPU页面,1展示添加和修改spu页面,2添加sku页面
let pageNo = ref<number>(1)
let limit = ref<number>(3)
let records = ref<Records>([])// spu数据列表
let total = ref<number>(0)
let spu = ref<InstanceType<typeof spuForm>>()// spuForm组件实例
let sku = ref<InstanceType<typeof skuForm>>()// skuForm组件实例
let skuArr = ref<SkuData[]>([])// sku列表数据
let show = ref<boolean>(false)


watch(() => categoryStore.c3ID, () => {
  if (categoryStore.c3ID) {
    getHasSpu()
  }
})

const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, limit.value, categoryStore.c3ID)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  } else {
    ElMessage({
      type: 'error',
      message: '获取SPU信息失败'
    })
  }
}

// 分页器 展示条数的下拉菜单发生改变时触发的函数
const sizeChange = () => {
  getHasSpu()
}

// 点击添加spu按钮触发的函数 
const addSpu = ()=>{
  scene.value=1
  spu.value?.initAddSpuData(categoryStore.c3ID)
}

// 点击修改spu按钮触发的函数
const updateSpu = (row:SpuData)=>{
  scene.value=1
  spu.value?.initHasSpuData(row)
}

// 点击添加sku按钮触发的函数
const addSku = (row:SpuData)=>{
  scene.value=2
  sku.value?.initAddSku(categoryStore.c1ID,categoryStore.c2ID,row)
}

// 子组件spuForm自定义事件触发的函数
const changeScene1 = (page:boolean)=>{
  scene.value = 0
  if(page){
    getHasSpu(pageNo.value)
  }else{
    getHasSpu()
  }
 
}

// 子组件skuForm自定义事件触发的函数
const changeScene2 = (page:boolean)=>{
  scene.value = 0
}

// 点击查看sku列表时触发的函数
const checkSku =async (row:SpuData)=>{
  show.value = true
  let result:SkuInfoResponseData = await reqSkuInfo(<number>row.id)
  if(result.code===200){
    skuArr.value = result.data
  }
} 

// 删除已有的SPU
const deleteSpu =async (row:SpuData)=>{
  let result:any = await reqDeleteSpu(<number>row.id)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:'删除SPU成功'
    })
    if(records.value.length==1){
      getHasSpu(pageNo.value-1)
    }else{
      getHasSpu(pageNo.value)
    }
    
  }else{
    ElMessage({
      type:'error',
      message:'删除SPU失败'
    })
  }
}


onBeforeUnmount(()=>{
  categoryStore.$reset()
})



</script>

<style scoped></style>