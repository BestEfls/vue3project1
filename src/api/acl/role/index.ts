import request from '@/utils/request.ts'
import { RoleData, RoleResponseData,MenuListResponseData } from './type'
enum API {
  // 分页获取职位的接口
  ROLE_URL = '/admin/acl/role/',
  // 添加角色接口
  SAVEROLE_URL = '/admin/acl/role/save',
  // 修改角色接口
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 根据角色获取菜单接口
  GETMENUBYROLE_URL = '/admin/acl/permission/toAssign/',
  //给相应的职位分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除指定的角色接口
  DELETEROLE_URL = '/admin/acl/role/remove/',
}

export const reqRole = (page:number,limit:number,roleName:string)=>request.get<any,RoleResponseData>(API.ROLE_URL+`${page}/${limit}?roleName=${roleName}`)

export const reqSaveOrUpdateRole = (data:RoleData)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATEROLE_URL,data)
  }else{
    return request.post<any,any>(API.SAVEROLE_URL,data)
  }
}

export const reqGetMenuByRole = (id:number)=>request.get<any,MenuListResponseData>(API.GETMENUBYROLE_URL+id)

export const reqSetPermission = (id:number,permissionId:number[])=>request.post(API.SETPERMISSION_URL+`roleId=${id}&permissionId=${permissionId}`)

export const reqDeleteRole = (id:number)=>request.delete<any,any>(API.DELETEROLE_URL+id)