import request from '@/utils/request.ts'
import type { UserResponseData,User,AllRoleResponseData,SetRoleData } from './type'
enum API {
  // 获取用户管理分页列表接口
  USERLIST_URL = '/admin/acl/user/',
  // 增加用户的接口
  SAVEUSER_URL = '/admin/acl/user/save',
  // 更新用户的接口
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取当前用户所拥有的职位和全部的职位
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有的用户分配角色接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除单个用户的接口
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 删除多个用户的接口
  DELETEUSERS_URL = '/admin/acl/user/batchRemove'
}

export const reqUserList = (page:number,limit:number,username:string)=>request.get<any,UserResponseData>(API.USERLIST_URL+page+'/'+limit+'?username='+username)

export const reqAddOrUpdate = (data:User)=>{
  if(data.id){// 更新用户
    return request.put<any,any>(API.UPDATEUSER_URL,data)
  }else{// 新增用户
    return request.post<any,any>(API.SAVEUSER_URL,data)
  }
}

export const reqAllRole = (id:number)=>request.get<any,AllRoleResponseData>(API.ALLROLE_URL+id)

export const reqSetUserRole = (data:SetRoleData)=>request.post<any,any>(API.SETROLE_URL,data)

export const reqDeleteUser = (id:number)=>request.delete<any,any>(API.DELETEUSER_URL+id)

export const reqDeleteUsers = (data:number[])=>request.delete<any,any>(API.DELETEUSERS_URL,{data})