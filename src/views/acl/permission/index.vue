<template>
  <div>
    <el-table border :data="menuArr" row-key="id">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{row,$index}">
          <el-button type="primary" size="small" v-if="!(row.level==4)" @click="addMenu(row)">{{ row.level==3?'添加功能':'添加菜单' }}</el-button>
          <el-button type="primary" size="small" v-if="!(row.level==1)" @click="updateMenu(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}吗?`" width="200px" @confirm="deleteMenu(row)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogShow" :title="menuParam.id?'修改菜单':'添加菜单'">
      <el-form  ref="formRef">
        <el-form-item label="名称" label-width="100px">
          <el-input placeholder="请您输入菜单名称" v-model="menuParam.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值" label-width="100px">
          <el-input placeholder="请您输入权限值" v-model="menuParam.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button type="primary" @click="dialogShow=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reqMenu,reqSaveOrUpdateMenu,reqDeleteMenu } from '@/api/acl/menu';
import type { MenuData,MenuResponseData,MenuParams } from '@/api/acl/menu/type';
// @ts-ignore
import {ElMessage} from 'element-plus';
import { ref,onMounted } from 'vue';

let menuArr = ref<MenuData[]>([])
let dialogShow = ref<boolean>(false)
let menuParam = ref<MenuParams>({
  id:0,
  pid:0,
  name:'',
  code:'',
  level:0
})

let getMenu =async ()=>{
  let result:MenuResponseData = await reqMenu()
  if(result.code===200){
    menuArr.value = result.data
  }
}

let addMenu = (row:MenuData)=>{
  dialogShow.value = true
  Object.assign(menuParam.value,{
    id:0,
    pid:0,
    name:'',
    code:'',
    level:0
  })
  menuParam.value.pid = row.id
  menuParam.value.level = row.level+1
}

let updateMenu = (row:MenuData)=>{
  dialogShow.value = true
  Object.assign(menuParam.value,{
    id:row.id,
    pid:row.pid,
    name:row.name,
    code:row.code,
    level:row.level
  })
}

let save =async ()=>{
  let result:any = await reqSaveOrUpdateMenu(menuParam.value)
  if(result.code===200){
    dialogShow.value = false
    ElMessage({ type: 'success', message: menuParam.value.id ? '更新成功' : '添加成功' })
    getMenu()
  }
}

let deleteMenu =async (row:MenuData)=>{
  let result = await reqDeleteMenu(row.id);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' });
        getMenu()

    }else{
      ElMessage({ type: 'error', message: '删除失败' });
    }
}

onMounted(()=>{
  getMenu()
})
</script>

<style scoped>

</style>