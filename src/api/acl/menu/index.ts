import request from "@/utils/request";
import type { MenuData,MenuResponseData,MenuParams } from "./type";
enum API  {
  // 获取菜单的接口
  MENU_URL = '/admin/acl/permission',
  // 新增菜单
  SAVEMENU_URL = '/admin/acl/permission/save',
  // 更新菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  //删除已有的菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}

export const reqMenu = ()=>request.get<any,MenuResponseData>(API.MENU_URL)

export const reqSaveOrUpdateMenu = (data:MenuParams)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATEMENU_URL,data)
  }else{
    return request.post<any,any>(API.SAVEMENU_URL,data)
  }
}

export const reqDeleteMenu = (id:number)=>request.delete<any,any>(API.DELETEMENU_URL+id)