<template>
  <div>
    <!-- 卡片组件 -->
    <el-card class="box-card">
      <!-- 卡片顶部的按钮组件 -->
      <el-button type="primary" icon="Plus" @click="addTrademark">添加商品</el-button>
      <!-- 用于展示商品信息的表格组件 -->
      <el-table style="margin: 20px 0px;" border :data="trademarkArr">
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="品牌名称" align="center">
          <!-- row是当前这一行的对象 -->
          <template #="{ row }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO" align="center">
          <template #="{ row }">
            <img :src="row.logoUrl.charAt(0) == 'h' ? row.logoUrl : 'http://' + row.logoUrl" alt=""
              style="width: 120px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row }">
            <el-button type="primary" icon="Edit" size="small" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}吗?`" width="250px" @confirm="deleteTrademark(row.id)">
              <template #reference>
                <el-button type="primary" icon="Delete" size="small"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器组件 -->
      <!-- 
        pagination:
          v-model:current-page :设置分页器当前页码
          v-model:page-size :每页显示的条目个数
          page-sizes :每页显示个数选择器的选项设置
          background :是否为分页按钮添加背景色
          layout :组件布局，子组件名用逗号分隔,->可以将组件顶到右边 

          事件:
          current-change : current-page改变时触发的事件,这个自定义事件会向回调函数中注入一个参数,这个参数是当前的页码
          size-change : page-size 改变时触发
       -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 4, 5, 6]" :background="true"
        layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="5"
        @current-change="getHasTrademark" @size-change="sizeChange" />
    </el-card>


    <!-- dialog部分 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%;" :rules="rules" :model="trademarkParams" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            el-upload组件属性:
              action:请求 URL,也就是文件上传的url,由于vite.config.ts中代理跨域的设置,要在接口前添加/api才能向正确的url发送请求
              before-upload: 上传文件之前的钩子,参数是上传到文件对象,如果返回false或者失败的Promise则停止上传
              on-success: 	文件上传成功时的钩子
           -->
          <el-upload class="avatar-uploader" action="http://sph-api.atguigu.cn/admin/product/fileUpload" :show-file-list="false"
            :on-success="onSuccess" :before-upload="beforeUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- dialog组件提供的具名插槽footer -->
      <template #footer>
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="primary" plain @click="cancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue';
import { reqHasTrademark, uploadOrUpdateTrademark,reqDeleteTrademark } from '@/api/product/trademark/index.ts'
import type { Records, TrademarkResponseData, Trademark } from '@/api/product/trademark/type.ts'
// @ts-ignore
import type { UploadProps } from 'element-plus'
// @ts-ignore
import { ElMessage } from 'element-plus';
// 当前页码
let pageNo = ref(1)
// 每一页展示的数据条数
let limit = ref(3)
// 存储已有品牌的总数
let total = ref(0)
// 存储已有品牌的数组
let trademarkArr = ref<Records>([])
// 控制对话框的显示和隐藏
let dialogFormVisible = ref(false)
// 新增品牌数据 
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})
// 获取el-form组件实例
let formRef = ref()

const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称长度至少两位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (trademarkParams.logoUrl) {
    callback()
  } else {
    callback(new Error('必须上传品牌logo'))
  }
}

// 制订表单验证规则
let rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}


const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  /* 
    注意:
      上一行代码pageNo.value=pager
      element-plus已经实现了pageNo与当前页码的双向绑定,那我们为什么还要去手动给pageNo赋值呢?
      这是因为当size-change自定义事件触发时,我们要先回到第一页再发请求,而我们的sizeChange函数中并没有
      给getHasTrademark()传参,也就是说pager会使用默认值1,这就实现了size-change触发,页码自动回到1的效果.
      而在current-change事件,却不会回到1,是因为current-change事件回向回调函数中注入当前页码,也就是说pager不再为1
      这样就不会影响到current-change事件的正常运作了
  */
  let result: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
    console.log(trademarkArr.value);
  }
}

onMounted(() => {
  getHasTrademark()
})

const sizeChange = () => {
  getHasTrademark()
}

const addTrademark = () => {
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  dialogFormVisible.value = true

  /* 点击添加按钮后要清除上一次字段验证的信息
    注意:当我们第一次点击添加按钮时,el-form组件还没有挂载到页面上,所以第一次点击添加按钮我们获取不到el-form的实例.
    此时如果我们想要对formRef进行操作会报错.我们有两个方法解决这个问题
  */
  // 方法1: ?.可选链操作符
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // 方法2: nextTick在dom更新后再进行操作
  // nextTick(()=>{
  //   formRef.value.clearValidate('tmName')
  //   formRef.value.clearValidate('logoUrl')
  // })
}

const updateTrademark = (row:any) => {
  trademarkParams.id = row.id
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl.charAt(0) == 'h' ? row.logoUrl : 'http://' + row.logoUrl
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  dialogFormVisible.value = true
}

const confirm = async () => {
  // 在发送上传请求前先验证表单中的内容是否合法,如果不合法则拒绝发送请求
  await formRef.value.validate()

  uploadOrUpdateTrademark(trademarkParams).then(res => {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '品牌修改成功' : '品牌添加成功'
    })
    // 品牌添加成功后再向服务器发送一次获取品牌信息的请求
    getHasTrademark(pageNo.value)

  }, err => {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '品牌修改失败' : '品牌添加失败'
    })
  })
  dialogFormVisible.value = false
}

const cancel = () => {
  dialogFormVisible.value = false
}

// 文件上传前的钩子
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: any) => {// rawFile为要上传的那个文件对象
  // 我们可以在这个钩子中指定可以上传的文件
  let type = rawFile.type
  if (type == "image/jpeg" || type == "image/png" || type == "image/gif") {
    if (rawFile.size <= 4 * 1024 * 1024) {
      // 如果上传的文件格式是jpg,png,gif并且文件大小小于4m我们就允许上传
      return true
    } else {
      ElMessage({
        message: '上传的文件要小于4M',
        type: 'error'
      })
      return false// 上传文件不满足条件,我们拒绝上传
    }
  } else {
    ElMessage({
      message: '文件格式只能是jpg,png,gif',
      type: 'error'
    })
  }
}

// 文件上传成功后的钩子
const onSuccess: UploadProps['Success'] = (response: any, uploadFile: any) => {// response为文件上传成功后的响应,uploadFile为上传成功后的一些信息,具体可以自己查看
  trademarkParams.logoUrl = response.data
  // 在上传图片成功后清理某个字段的表单验证信息
  formRef.value.clearValidate('logoUrl')
  // console.log(uploadFile);
  // console.log(response);
}

// 删除品牌
const deleteTrademark = (id:number)=>{
  reqDeleteTrademark(id).then(res=>{
    if(res.code===200){
      ElMessage({
        type:'success',
        message:'删除成功'
      })
      getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
    }else{
      ElMessage({
        type:'error',
        message:res.data
      })
    }
  },err=>{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  })
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>