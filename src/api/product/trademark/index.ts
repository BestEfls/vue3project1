// 品牌管理模块的的接口
import request from "@/utils/request";
import type { TrademarkResponseData,Trademark } from "./type";
// 品牌管理模块的接口地址
enum API {
  // 获取已有商品的接口地址
  TRADEMARK_URL = "/admin/product/baseTrademark/",
  // 添加品牌接口
  UPLOADTRADEMARK_URL = "/admin/product/baseTrademark/save",
  // 修改品牌接口
  UPDATETRADEMARK_URL = "/admin/product/baseTrademark/update",
  // 删除品牌接口
  DELETETRADEMARK_URL = "/admin/product/baseTrademark/remove/",
}

export const reqHasTrademark = (page:number,limit:number)=>request<any,TrademarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)

export const uploadOrUpdateTrademark = (data:Trademark)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATETRADEMARK_URL,data)
  }else{
    return request.post<any>(API.UPLOADTRADEMARK_URL,data)
  }
}

export const reqDeleteTrademark = (id:number)=>request.delete<any,any>(API.DELETETRADEMARK_URL+id)