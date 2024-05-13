<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px;">
      <el-button type="primary" ref="btn" icon="Plus" :disabled="categoryStore.c3ID ? false : true" @focus="btnFocus"
        @click="addAttr">添加平台属性</el-button>
      <div v-show="scene === 0">
        <el-table border style="margin: 20px 0px;" :data="attrArr">
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}属性吗?`" width="200px" @confirm="attrDelete(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-card>
          <el-form inline>
            <el-form-item label="属性名称">
              <el-input placeholder="请输入属性名" v-model="attrParams.attrName"></el-input>
            </el-form-item>
          </el-form>
          <el-button :disabled="attrParams.attrName ? false : true" type="primary" size="default" icon="Plus"
            @click="addAttrValue">添加属性值</el-button>
          <el-button type="primary" size="default" @click="cancel">取消</el-button>
          <el-table style="margin: 10px 0px;" border :data="attrParams.attrValueList">
            <el-table-column label="序号" width="80px" type="index"></el-table-column>
            <el-table-column label="属性值名称">
              <template #="{ row, $index }">
                <el-input :ref="(vc: any) => {console.log(vc);
                ;inputArr[$index] = vc}" v-if="row.flag" placeholder="请输入属性值名称"
                  v-model="row.valueName" @blur="toLook(row, $index)"></el-input>
                <div style="height: 32px;" v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="属性值操作">
              <template #="{ row, $index }">
                <el-button type="primary" size="samll" icon="Delete"
                  @click="attrParams.attrValueList.splice($index, 1)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button :disabled="attrParams.attrValueList.length === 0" type="primary" size="default"
            @click="save">保存</el-button>
          <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { nextTick, reactive, ref, watch,onBeforeUnmount } from 'vue';
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrResponseData, AttrList, AttrValue, Attr } from '@/api/product/attr/type';
// @ts-ignore
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()

let btn = ref()
let attrArr = ref<AttrList>([])
let scene = ref(0) // 当scene等于0时显示属性表格,等于1时显示添加获取修改属性的表格
// 数据添加属性的信息
let attrParams = reactive<Attr>({
  attrName: '',// 新增属性的属性名
  attrValueList: [],// 新增属性的属性值列表
  categoryId: '',// 该属性对应的三级分类的ID
  categoryLevel: 3,// 代表的是三级分类
})
// 
let inputArr = ref<any>([])
let btnFocus = () => {
  btn.value.ref.blur()
}

watch(() => categoryStore.c3ID, () => {
  attrArr.value = []
  if (categoryStore.c3ID) {
    getAttr()
    console.log(1111);
  }
})

const getAttr = async () => {
  let { c1ID, c2ID, c3ID } = categoryStore
  let result: AttrResponseData = await reqAttr(c1ID, c2ID, c3ID)
  console.log(result);
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 增加属性
let addAttr = () => {
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3ID,
    categoryLevel: 3,
  })
  scene.value = 1
}

// 修改属性
let updateAttr = (row: Attr) => {
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  /*
    此处有一个坑:
      Object.assign()方法是浅拷贝的,所以在合并以后,row中的attrValueList与attrParams中的attrValueList指向的是同一个对象.
      这就导致在修改页面中对attrParams中的attrValueList属性的操作会影响到row中的attrValueList属性,导致即使你增加了属性值但是没有发送请求,这个属性的属性值
      还是会增多.(不过刷新一下页面就好了).  我们使用JSON.parse(JSON.stringify(row))就可以实现深拷贝了
  */
  scene.value = 1
}

// 取消添加属性
let cancel = () => {
  scene.value = 0
}

// 添加属性值的方法
let addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => {
    inputArr.value[inputArr.value.length - 1].focus()
  })
}

// 保存的方法
let save = async () => {
  console.log(123);

  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    // 添加属性成功后,重新向服务器发送一次获取属性的请求
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
  scene.value = 0
}

// 输入属性值的输入框失去焦点时进入查看模式
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断1:输入框失去焦点时,如果输入框的内容为空白,则删除这一行内容
  if (row.valueName.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    attrParams.attrValueList.splice($index, 1)
    return
  }
  // 非法情况判断2:输入框中的属性值和其它属性值相同时,删除这一行内容
  let repeat = attrParams.attrValueList.find(item => {
    if (item != row) {
      return item.valueName.trim() === row.valueName.trim()
    }
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    attrParams.attrValueList.splice($index, 1)
    return
  }

  row.flag = false
}

// 点击div进入编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除属性
const attrDelete = async (id: number | string) => {
  let result: any = await reqDeleteAttr(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除属性成功'
    })
    // 删除以后再重新获取一次属性数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除属性失败'
    })
  }
}

// 当组件卸载时,清除小仓库中的所有数据,以防止下次进入时还保留上一次的信息
onBeforeUnmount(()=>{
  categoryStore.$reset()
})
</script>

<style scoped></style>