<template>
  <div>
    <el-card style="height: 80px;">
      <el-form inline>
        <el-form-item label="角色名称">
          <el-input placeholder="请输入角色" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyword == ''" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0px;">
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table border style="margin: 10px 0px;" :data="roleArr">
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建事件" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}吗?`" width="200px" @confirm="deleteRole(row)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[6, 8, 10, 12]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="5"
        @current-change="getRoleList" @size-change="getRoleList(1)" />
    </el-card>
    <el-dialog v-model="dialogShow" :title="roleParams.id ? '修改职位' : '添加职位'">
      <el-form :model="roleParams" :rules="rules" ref="formRef">
        <el-form-item prop="roleName" label="角色名称">
          <el-input placeholder="请您输入角色名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="show">
      <template #header>
        <h3>分配权限</h3>
      </template>
      <template #default>
        <el-tree
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqRole, reqSaveOrUpdateRole,reqGetMenuByRole,reqSetPermission,reqDeleteRole } from '@/api/acl/role/index.ts';
import type { RoleData, RoleResponseData,MenuData,MenuListResponseData } from '@/api/acl/role/type';
// @ts-ignore
import { ElMessage, FormRules } from 'element-plus';

let pageNo = ref<number>(1)
let limit = ref<number>(6)
let total = ref<number>(1)
let keyword = ref<string>('')
let roleArr = ref<RoleData[]>([])

let dialogShow = ref<boolean>(false)
let roleParams = ref<RoleData>({
  id: 0,
  roleName: ''
})
let formRef = ref()
let show = ref<boolean>(false)
let menuArr = ref<MenuData[]>([])// 树形控件中要展示的数据
let selectArr = ref<number[]>([])// 决定在树形控件中哪一个选项会被选择,数组里面存储的是要被选择的那个菜单的id
let tree = ref()

let validatorRoleName = (rule: any, value: any, callback: any) => {
  if (value.length >= 2) {
    callback()
  } else {
    callback(new Error('角色名长度必须大于2位'))
  }
}

let rules: FormRules = {
  roleName: [
    { required: true, trigger: 'blur', validator: validatorRoleName }
  ]
}

let getRoleList = async (pager: number = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqRole(pageNo.value, limit.value, keyword.value)
  if (result.code === 200) {
    roleArr.value = result.data.records
    total.value = result.data.total
  } else {
    ElMessage({
      type: 'error',
      message: '获取角色信息失败'
    })
  }
}

let search = () => {
  getRoleList()
}

let save = async () => {
  await formRef.value.validate()
  dialogShow.value = false
  let result: any = await reqSaveOrUpdateRole(roleParams.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: roleParams.value.id ? '修改角色成功' : '添加角色成功'
    })
    getRoleList(roleParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: roleParams.value.id ? '修改角色失败' : '添加角色失败'
    })
  }
}

let cancel = () => {
  dialogShow.value = false
}

let addRole = () => {
  dialogShow.value = true
  Object.assign(roleParams.value, {
    id: 0,
    roleName: ''
  })
  formRef.value?.clearValidate()
}

let updateRole = (row: RoleData) => {
  dialogShow.value = true
  Object.assign(roleParams.value, row)
  formRef.value?.clearValidate()
}

let setPermission = async (row: RoleData) => {
  show.value = true
  selectArr.value = []
  Object.assign(roleParams.value, row)
  let result:MenuListResponseData = await reqGetMenuByRole(<number>roleParams.value.id)
  console.log(result);
  if(result.code===200){
    menuArr.value = result.data
    selectArr.value = filterSelect(menuArr.value,[])
  }
}

let filterSelect = (allData:MenuData[],initData:number[])=>{
  allData.forEach(item=>{
    if(item.children?.length==0&&item.select){
      initData.push(item.id)
    }else{
      filterSelect(<MenuData[]>item.children,initData)
    }
  })
  return initData
}

let handler = async ()=>{
  let roleId = roleParams.value.id
  let arr1 = tree.value.getCheckedKeys()
  let arr2 = tree.value.getHalfCheckedKeys()
  let premission = [...arr1,...arr2]
  let result:any = await reqSetPermission(<number>roleId,premission)
  if(result.code===200){
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' });
    //页面刷新,之所以要刷新一次页面是因为,当我给自己进行权限分配后,可能已经无权查看一些页面了,所以要刷新
    window.location.reload();
  }else{
    ElMessage({ type: 'error', message: '分配权限失败' });
  }
  show.value=false
}

let deleteRole =async (row:RoleData)=>{
  let result:any = await reqDeleteRole(<number>row.id)
  if(result.code===200){
    //提示信息
    ElMessage({ type: 'success', message: '删除角色成功' });
    getRoleList(roleArr.value.length==1?pageNo.value-1:pageNo.value)
  }else{
    ElMessage({ type: 'error', message: '删除角色失败' });
  }
}

onMounted(() => {
  getRoleList()
})

const defaultProps = {
  children: 'children',
  label: 'name',
}


</script>

<style scoped></style>