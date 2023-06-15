<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select v-model="SpuParams.tmId">
          <el-option v-for="item in AllTrademark" :key="item.id" :value="item.id" :label="item.tmName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU照片">
        <!-- el-upload组件属性解析:
          v-model:file-list  :默认上传的文件,属性值类型为数组,数组中存放着要上传的对象信息({name:string,url:string}). 放在数组中的图片文件会被直接展示
          action:上传图片地址
          list-type:文件列表类型
         -->
        <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeUpload">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length==0?'无':`还有${unSelectSaleAttr.length}条未选`">
          <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
        </el-select>
        <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName?false:true" style="margin-left: 10px;" type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-table border style="margin: 10px 0px;" :data="saleAttr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名" width="120px" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-tag v-for="(item,$index) in row.spuSaleAttrValueList" :key="item.id" class="mx-1" closable :disable-transitions="false"
              style="margin: 0px 5px;"
                @close="handleClose(row,$index)">
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input v-show="row.flag" :ref="(vc:any)=>inputArr[$index]=vc" v-model="newSaleAttrValue.saleAttrValueName" class="ml-1 w-20" size="small"
                @blur="handleInputConfirm(row,$index)"  @keyup.enter="inputBlur($index)"/>
              <el-button v-show="!row.flag" class="button-new-tag ml-1" size="small" @click="showInput(row,$index)">
                + New Tag
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{row,$index}">
              <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="save" :disabled="saleAttr.length==0">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reqAllTrademark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr,reqAddOrUpdateSpu } from '@/api/product/spu'
import type
{
  SpuData, SpuHasImgResponseData, SaleAttrResponseData, HasSaleAttrResponseData, AllTrademarkResponseData,
  Trademark, SpuImg, SaleAttr, HasSaleAttr,SaleAttrValue
} from '@/api/product/spu/type.ts'
// @ts-ignore
import { ElMessage,ElInput } from 'element-plus'
import { computed, nextTick, ref, toRaw } from 'vue'
let emit = defineEmits(['changeScene'])

// 存储已有的SPU数据
let AllTrademark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])

// 存储要保存的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',// 三级分类的Id
  spuName: '',// SPU的名字
  description: '',// SPU的描述
  tmId: '',// 品牌的Id
  spuImageList: [],// 照片墙的数组
  spuSaleAttrList: []// 销售属性的数组
})
// 收集还未被选择的属性
let saleAttrIdAndValueName = ref<string>('')
// 绑定新建的属性值
let newSaleAttrValue = ref<SaleAttrValue>({
  baseSaleAttrId:0,
  saleAttrValueName:'',
})

// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 对话框展示图片的url
let dialogImageUrl = ref<string>('')
// 获取输入框的实例数组
let inputArr = ref<InstanceType<typeof ElInput>[]>([])



const cancel = () => {
  emit('changeScene', 0)
}

// 子组件书写一个方法 
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  console.log(SpuParams);

  let result1: AllTrademarkResponseData = await reqAllTrademark()
  let result2: SpuHasImgResponseData = await reqSpuImageList(<number>spu.id)
  let result3: SaleAttrResponseData = await reqSpuHasSaleAttr(<number>spu.id)
  let result4: HasSaleAttrResponseData = await reqAllSaleAttr()

  AllTrademark.value = result1.data
  imgList.value = result2.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  
  saleAttr.value = result3.data
  saleAttr.value.forEach(item=>{
    item.flag=false
  })
  allSaleAttr.value = result4.data

}

// 图片预览前触发的钩子
let handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 图片移除前触发的钩子
let handleRemove = () => {

}



// 图片上传前触发的钩子
let beforeUpload = (file: any) => {
  console.log(123);

  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    console.log(file.type);

    if (file.size <= 4 * 1024 * 1024) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '图片大小不能超过4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传图片的格式必须为png,jpg,gif'
    })
    return false
  }
}

// 计算属性,计算出有多少销售属性是没有被当前SPU使用的,然后展示到可选框中
let unSelectSaleAttr = computed(()=>{
  // 全部销售属性:[颜色,尺码,版本]
  let unSelectArr = allSaleAttr.value.filter(item=>{
    return saleAttr.value.every(it=>{
      return item.name!=it.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性的方法
let addSaleAttr = ()=>{
  /*
    baseSaleAttrId:number,
    saleAttrName:string,
    spuSaleAttrValueList:SpuSaleAttrValueList
  */
  let [baseSaleAttrId,saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr:SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList:[],
    spuId:SpuParams.value.id
  }
  newSaleAttr.baseSaleAttrId = parseInt(<string>newSaleAttr.baseSaleAttrId)
  saleAttr.value.push(newSaleAttr)
  // 情空收集的数据
  saleAttrIdAndValueName.value = ''
}


// 点击删除属性值标签时触发的函数
const handleClose = (tag:SaleAttr,$index:number)=>{
  tag.spuSaleAttrValueList.splice($index,1)
}

// 按下回车键触发的函数
const inputBlur = ($index:number)=>{
  inputArr.value[$index].blur()
}

// 输入属性值的文本框失去焦点时触发的函数
const handleInputConfirm = (row:SaleAttr,$index:number)=>{
  saleAttr.value[$index].flag=false
  let b:SaleAttrValue = {
    baseSaleAttrId:0,
    saleAttrValueName:''
  }
  // 非法情况1:属性值为空
  if(newSaleAttrValue.value.saleAttrValueName.trim()==""){
    ElMessage({
      type:'error',
      message:'属性值不能为空'
    })
    return
  }
  // 非法情况2:属性值重复
  let a =row.spuSaleAttrValueList.find(item=>{
    return item.saleAttrValueName == newSaleAttrValue.value.saleAttrValueName
  })
  if(a){
    ElMessage({
      type:'error',
      message:'属性值不能重复'
    })
    newSaleAttrValue.value.saleAttrValueName = ''
    return
  }

  Object.assign(b,newSaleAttrValue.value);
  row.spuSaleAttrValueList.push(b)
  newSaleAttrValue.value.baseSaleAttrId = 0
  newSaleAttrValue.value.saleAttrValueName = ''
  newSaleAttrValue.value.spuId = 0
  newSaleAttrValue.value.saleAttrName = ''
}

// 点击新建标签时触发的函数
const showInput = (row:SaleAttr,$index:number)=>{
  newSaleAttrValue.value.baseSaleAttrId = <number>row.baseSaleAttrId
  newSaleAttrValue.value.saleAttrName = row.saleAttrName
  newSaleAttrValue.value.spuId = row.spuId
  nextTick(()=>{
    console.log(inputArr.value[$index]);
    saleAttr.value[$index].flag=true
    inputArr.value[$index].focus()
  })
  
}

// 点击保存按钮触发的函数
const save = async ()=>{
  SpuParams.value.spuImageList = imgList.value.map((item:any)=>{    
    return {
      imgName:item.name,
      imgUrl:(item.response?item.response.data:item.url)
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:SpuParams.value.id?'修改SPU成功':'添加SPU成功'
    })
    // 修改或添加完成后返回spu页面
    emit('changeScene',SpuParams.value.id?true:false)
  }else{
    ElMessage({
      type:'error',
      message:SpuParams.value.id?'修改SPU失败':'添加SPU失败'
    })
    emit('changeScene',SpuParams.value.id?true:false)
  }
}

const initAddSpuData =async (category3Id:number|string)=>{
  // 情空上一次的数据
  Object.assign(SpuParams.value,{
    category3Id: '',// 三级分类的Id
    spuName: '',// SPU的名字
    description: '',// SPU的描述
    tmId: '',// 品牌的Id
    spuImageList: [],// 照片墙的数组
    spuSaleAttrList: []// 销售属性的数组
  })
  imgList.value = []
  saleAttr.value =[]
  SpuParams.value.id = 0

  SpuParams.value.category3Id = category3Id
  let result1: AllTrademarkResponseData = await reqAllTrademark()
  let result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTrademark.value = result1.data
  allSaleAttr.value = result2.data
}

defineExpose({
  initHasSpuData,initAddSpuData
})
</script>

<style scoped lang="less">
.w-20{
  width: 81px;
}
</style>