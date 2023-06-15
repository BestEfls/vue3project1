<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0px;" :data="skuArr">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="名称" width="200px" show-overflow-tooltip prop="skuName"></el-table-column>
        <el-table-column label="描述" width="200px" show-overflow-tooltip prop="skuDesc"></el-table-column>
        <el-table-column label="图片" width="200px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" style="width: 120px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="重量(克)" width="200px" prop="weight"></el-table-column>
        <el-table-column label="价格(元)" width="200px" prop="price"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" :icon="row.isSale == 0 ? 'Top' : 'Bottom'"
              @click="updateSale(row)"></el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateEdit"></el-button>
            <el-button type="primary" size="small" icon="InfoFilled" @click="openDrawer(row)"></el-button>
            <el-popconfirm :title="`你确定要删除这个商品吗?`" width="200px" @confirm="deleteSku(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 15, 20, 25]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="5"
        @current-change="getSkuList" @size-change="getSkuList(1)" />
    </el-card>
    <el-drawer v-model="drawer" title="查看SKU详细信息">
      <template #header>
        <h3>查看SKU详细信息</h3>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 5px 2px;">{{ item.attrName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin: 5px 2px;">{{ item.saleAttrName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px;">
          <el-col :span="6">商品照片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;"> 
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>

    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqSkuList, reqCancelSale, reqOnSale,reqSkuInfo,reqDeleteSku } from '@/api/product/sku/index.ts'
import type { SkuData, SkuResponseData,SkuInfoResponseData } from '@/api/product/sku/type.ts'
// @ts-ignore
import { ElMessage } from 'element-plus';
let pageNo = ref<number>(1)
let limit = ref<number>(10)
let total = ref<number>(20)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false)
let skuInfo = ref<any>({})

const getSkuList = async (page: number = 1) => {
  pageNo.value = page
  let result: SkuResponseData = await reqSkuList(pageNo.value, limit.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    await reqCancelSale(<number>row.id)
    ElMessage({
      type: 'success',
      message: '商品下架'
    })
    getSkuList(pageNo.value)
  } else {
    await reqOnSale(<number>row.id)
    ElMessage({
      type: 'success',
      message: '商品上架'
    })
    getSkuList(pageNo.value)
  }
}

const updateEdit = () => {
  ElMessage({
    type: 'success',
    message: '此功能开发中...'
  })
}

const openDrawer =async (row:SkuData) => {
  drawer.value = true
  let result:SkuInfoResponseData = await reqSkuInfo(<number>row.id)
  if(result.code===200){
    skuInfo.value = result.data
  }else{
    ElMessage({
      type:'error',
      message:'获取信息失败'
    })
  }
}

const deleteSku = async (row:SkuData)=>{
  console.log(row);
  
  let result:any = await reqDeleteSku(<number>row.id)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    if(skuArr.value.length==1){
      getSkuList(pageNo.value-1)
    }else{
      getSkuList(pageNo.value)
    }
  }else{
    ElMessage({
      type:'error',
      message:'系统数据,删除失败'
    })
  }
}

onMounted(() => {
  getSkuList()
})
</script>

<style scoped lang="less">
:global(.el-carousel__indicators--horizontal) {
  position: static;
  transform: none;
  text-align: center;
}

:global(.el-carousel__button){
    background-color: #475669;
  }

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>