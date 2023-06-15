<template>
  <div>
    <el-card style="height: 80px;">
      <el-form inline>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :disabled="keyword==''?true:false">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
      <el-button type="primary" @click="addUser" v-has="'btn.User.add'">添加用户</el-button>
      <el-button type="primary" :disabled="userIdList.length==0" @click="deleteUsers" v-has="'btn.User.remove'">批量删除</el-button>
      <el-table @selection-change="selectionChange" border style="margin: 10px 0px;" :data="UserArr">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名称" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户昵称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建事件" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}吗?`" width="200px" @confirm="deleteUser(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete">删除</el-button>
                </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[6, 8, 10, 12]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" :pager-count="5"
        @current-change="getUserList" @size-change="getUserList(1)" />
    </el-card>
    <el-drawer v-model="show">
      <template #header>
        <h3>{{ UserInfo.id ? '修改用户' : '添加用户' }}</h3>
      </template>
      <template #default>
        <el-form :model="UserInfo" :rules="rules" ref="userForm">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请输入用户姓名" v-model="UserInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请输入用户昵称" v-model="UserInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="UserInfo.id ? false : true">
            <el-input placeholder="请输入用户密码" v-model="UserInfo.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div>
          <el-button type="primary" @click="save">确认</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="show1">
      <template #header>
        <h3>分配角色(职位)</h3>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="UserInfo.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
              <el-checkbox v-for="item in allRole" :key="item.id" :label="item">{{
                item.roleName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div>
          <el-button type="primary" @click="confirmClick">确认</el-button>
          <el-button type="primary" @click="show1=false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqUserList, reqAddOrUpdate,reqAllRole,reqSetUserRole,reqDeleteUser,reqDeleteUsers } from '@/api/acl/user/index.ts'
import type { UserResponseData, Records, User,RoleData,AllRoleResponseData,SetRoleData } from '@/api/acl/user/type.ts'
import useUserStore from '@/store/modules/user';
// @ts-ignore
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1)
let limit = ref<number>(6)
let total = ref<number>(20)
let UserArr = ref<Records>([])
let show = ref<boolean>(false)
let show1 = ref<boolean>(false)
let UserInfo = ref<User>({
  username: '',
  name: '',
  password: ''
})
let userForm = ref()
let userStore = useUserStore()
let isMe = ref<boolean>(false)

// 下面四个变量用来控制复选框的状态
let checkAll = ref<boolean>(false)// 控制是否全选的状态
let isIndeterminate = ref<boolean>(true)//设置不确定状态，仅负责样式控制
let checkedRole = ref<RoleData[]>([])// 已选中角色的列表
let allRole = ref<RoleData[]>([])// 所有角色的列表

let userIdList = ref<User[]>([])
let keyword = ref<string>('')

const validatorUserName = (rule: any, value: any, callback: any) => {
  // rule:校验规则对象
  // value:表单元素文本内容
  // 函数:如果符合条件callback直接调用,如果不符合条件则向callback中注入错误信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度在5-10位之间'))
  }
}

const validatorName = (rule: any, value: any, callback: any) => {
  // rule:校验规则对象
  // value:表单元素文本内容
  // 函数:如果符合条件callback直接调用,如果不符合条件则向callback中注入错误信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度在5-10位之间'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  let reg = /^\w{6,15}$/
  if (/\W/.test(value)) {
    callback('密码只能包含数字,字母,下划线')
  }
  if (reg.test(value)) {
    callback()
  } else {
    callback('密码长度在6-15位之间')
  }
}

// 表单校验规则
let rules = {
  username: [
    { required: true, trigger: 'blur', validator: validatorUserName },
  ],
  name: [
    { required: true, trigger: 'blur', validator: validatorName }
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatorPassword }
  ]
}

let getUserList = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserList(pageNo.value, limit.value,keyword.value)
  if (result.code === 200) {
    UserArr.value = result.data.records
    total.value = result.data.total
  } else {
    ElMessage({
      type: 'error',
      message: '获取用户信息列表失败'
    })
  }
}

const addUser = () => {
  show.value = true
  Object.assign(UserInfo.value, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })

  // 清除上一次验证的错误信息
  userForm.value?.clearValidate()
}

const updateUser = (row: User) => {
  show.value = true
  if (userStore.username == row.username) {
    isMe.value = true
  }
  Object.assign(UserInfo.value, row)
  // 清除上一次验证的错误信息
  userForm.value?.clearValidate()
}

const save = async () => {

  await userForm.value.validate()

  let result: any = await reqAddOrUpdate(UserInfo.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: UserInfo.value.id ? '修改用户成功' : '添加用户成功'
    })
    if (UserInfo.value.id) {
      getUserList(pageNo.value)
    } else {
      getUserList()
    }
    if (isMe.value) {
      window.location.reload()
    }
  } else {
    ElMessage({
      type: 'error',
      message: UserInfo.value.id ? '修改用户失败' : '添加用户失败'
    })
  }
  show.value = false
}

const cancel = () => {
  isMe.value = false
  show.value = false
}

const setRole =async (row: User) => {
  show1.value = true
  Object.assign(UserInfo.value, row)
  let result:AllRoleResponseData = await reqAllRole(<number>row.id)
  if(result.code===200){
    allRole.value = result.data.allRolesList
    checkedRole.value = result.data.assignRoles
  }
}

// 全选按钮改变时触发的函数
const handleCheckAllChange = (val: boolean) => {
  checkedRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

// checkbox改变时触发的函数
const handleCheckedRoleChange = (value: RoleData[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

// 点击确认按钮触发的函数
const confirmClick =async ()=>{
  let data:SetRoleData = {
    userId:<number>UserInfo.value.id,
    roleIdList:checkedRole.value.map((item)=>{
      return item.id
    })
  }
  let result:any =  await reqSetUserRole(data)
  console.log(data);
  
  if(result.code===200){
      ElMessage({
        type:'success',
        message:'分配角色成功'
      })
      getUserList(pageNo.value)
  }else{
    ElMessage({
      type:'error',
      message:'系统数据,不能被操作'
    })
  }
  show1.value = false
}

// 删除单个角色
const deleteUser =async (row:User)=>{
  let result:any = await reqDeleteUser(<number>row.id)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    if(row.username===userStore.username){
      location.reload()
    }
    getUserList(UserArr.value.length==1?pageNo.value-1:pageNo.value)
  }else{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }  
}

// 删除多个角色
const deleteUsers = async ()=>{
  let data:number[] = userIdList.value.map((item)=>{
    return <number>item.id
  })
  let result:any = await reqDeleteUsers(data)
  if(result.code===200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    for(let i=0;i<userIdList.value.length;i++){
      if(userIdList.value[i].username===userStore.username){
        location.reload()
      }
    }
    getUserList(UserArr.value.length==data.length?pageNo.value-1:pageNo.value)
  }else{
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}

// 多选框删除用户
const selectionChange = (value:User[])=>{
  userIdList.value = value
}

// 搜索按钮触发的函数
const search = ()=>{
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<style scoped></style>