import request from "@/utils/request";

import type { CategoryResponseData,AttrResponseData,Attr } from "./type";

enum API {
  // 一级分类接口
  C1_URL = '/admin/product/getCategory1',
  // 二级分类接口
  C2_URL = '/admin/product/getCategory2/',// /{category1Id}要携带一级分类的id
  // 三级分类接口
  C3_URL = '/admin/product/getCategory3/',//  /admin/product/getCategory3/{category2Id}
  // 商品属性接口
  ATTR_URL = '/admin/product/attrInfoList/',
  // 新增或修改属性接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除属性接口
  DELETEATTR_URL = '/admin/product/deleteAttr/'
}

// 获取一级分类
export const reqCategory1 = ()=>request.get<any,CategoryResponseData>(API.C1_URL)
// 获取二级分类
export const reqCategory2 = (id:number|string)=>request.get<any,CategoryResponseData>(API.C2_URL+id)
// 获取三级分类
export const reqCategory3 = (id:number|string)=>request.get<any,CategoryResponseData>(API.C3_URL+id)
// 获取对应分类下的属性
export const reqAttr = (category1ID:number|string,category2ID:number|string,category3ID:number|string)=>request.get<any,AttrResponseData>(`${API.ATTR_URL}${category1ID}/${category2ID}/${category3ID}`) 
// 新增或修改属性
export const reqAddOrUpdateAttr = (data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data)
// 删除属性
export const reqDeleteAttr = (attrId:number|string)=>request.delete<any,any>(API.DELETEATTR_URL+attrId)