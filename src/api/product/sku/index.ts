import request from '@/utils/request.ts'
import { SkuResponseData,SkuInfoResponseData } from './type'
enum API {
  // 获取已有的SKU商品数据接口
  SKU_URL = '/admin/product/list/',
  // 商品下架接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 商品上架接口
  ONSALE_URL = '/admin/product/onSale/',
  // 获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除sku接口
  DELETESKU_URL = '/admin/product/deleteSku/'
}

export const reqSkuList =(page:number,limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+page+'/'+limit)

export const reqCancelSale = (id:number)=>request.get<any,any>(API.CANCELSALE_URL+id);

export const reqOnSale = (id:number)=>request.get<any,any>(API.ONSALE_URL+id);

export const reqSkuInfo = (id:number)=>request.get<any,SkuInfoResponseData>(API.SKUINFO_URL+id)

export const reqDeleteSku = (id:number)=>request.delete<any,any>(API.DELETESKU_URL+id)