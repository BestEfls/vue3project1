<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="sku名称">
        <el-input placeholder="请输入sku名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="sku描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline label-width="100px">
          <el-form-item v-for="item in attr" :key="item.id" :label="item.attrName" style="margin: 4px 0px;">
            <el-select v-model="item.attrIdAndValueId">
              <el-option :value="`${item.id}:${it.id}`" v-for="it in item.attrValueList" :key="it.id" :label="it.valueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline label-width="100px">
          <el-form-item v-for="item in saleAttr" :key="item.id" :label="item.saleAttrName">
            <el-select v-model="item.saleIdAndValueId">
              <el-option :value="`${item.id}:${it.id}`" v-for="it in item.spuSaleAttrValueList" :key="it.id" :label="it.saleAttrValueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item lable="图片名称">
        <el-table border :data="imgList">
          <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
          <el-table-column label="图片">
            <template #="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width: 120px;height:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #="{row,$index}">
              <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { AttrResponseData,AttrList } from '@/api/product/attr/type.ts'
import type { SpuHasImgResponseData,SpuData, SaleAttrResponseData,SaleAttr,SpuImg,SkuData } from '@/api/product/spu/type.ts'
import { reqAttr } from '@/api/product/attr'
import { reqSpuHasSaleAttr,reqSpuImageList,reqAddSku } from '@/api/product/spu'
import { ref,reactive, toRaw } from 'vue'
// @ts-ignore
import { ElMessage } from 'element-plus'

let emit = defineEmits(['changeScene'])

const cancel = ()=>{
  emit('changeScene',2)
}

let attr = ref<AttrList>([])
let saleAttr = ref<SaleAttr[]>([]) 
let imgList = ref<SpuImg[]>([])

// 收集sku数据
let skuParams = reactive<SkuData>({
  category3Id:'',
  spuId:'',
  tmId:'',
  skuName:'',
  price:'',
  weight:'',
  skuDesc:'',
  skuDefaultImg:'',
  skuAttrValueList:[],
  skuSaleAttrValueList:[]
})

const initAddSku =async (c1Id:number|string,c2Id:number|string,spu:SpuData)=>{
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = <number>spu.id
  skuParams.tmId = spu.tmId
  // 平台属性
  let result1:AttrResponseData = await reqAttr(c1Id,c2Id,spu.category3Id)
  // 销售属性
  let result2:SaleAttrResponseData = await reqSpuHasSaleAttr(<number>spu.id)
  // 图片 
  let result3:SpuHasImgResponseData = await reqSpuImageList(<number>spu.id)
  
  attr.value = result1.data
  saleAttr.value = result2.data
  imgList.value = result3.data
  console.log(attr.value);
  
}

// 点击设置默认按钮触发的事件
const handler = (row:any)=>{
  skuParams.skuDefaultImg = row.imgUrl
}

// 点击保存按钮触发的事件
const save =async ()=>{
  let attrArrs:any = attr.value.filter((item)=>{
    return item.attrIdAndValueId?true:false
  })

  attrArrs = attrArrs.map((item:any)=>{
    let a:string[] = <string[]>item.attrIdAndValueId?.split(':')
    return reactive({
      attrId:<string>a[0],
      valueId:<string>a[1]
    })
  })
  skuParams.skuAttrValueList = attrArrs

  attrArrs = saleAttr.value.filter((item)=>{
    return item.saleIdAndValueId?true:false
  })
  attrArrs = attrArrs.map((item:any)=>{
    let a:string[] = <string[]>item.saleIdAndValueId?.split(':')
    return reactive({
      saleAttrId:<string>a[0],
      saleAttrValueId:<string>a[1]
    })
  })
  skuParams.skuSaleAttrValueList = attrArrs
  
  let result = await reqAddSku(skuParams)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:'添加SKU成功'
    })
    emit('changeScene',2)
  }else{
    ElMessage({
      type:'serror',
      message:'添加SKU失败'
    })
  }
}

defineExpose({
  initAddSku,
})
</script>

<style scoped>

</style>