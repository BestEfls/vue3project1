import { RouteRecordRaw } from "vue-router";
import { CategoryObj } from "@/api/product/attr/type";
// 定义小仓库数据state类型
export interface UserState{
  token:null|string,
  userMenu:RouteRecordRaw[],
  username:string,
  avatar:string,
  buttons:string[]
}

export interface CategoryState{
  c1ID:number|string,
  c1Arr:CategoryObj[],
  c2ID:number|string,
  c2Arr:CategoryObj[],
  c3ID:number|string,
  c3Arr:CategoryObj[]
}