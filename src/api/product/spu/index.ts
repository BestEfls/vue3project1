import request from '@/utils/request.ts'
import type { HasSpuResponseData,AllTrademarkResponseData,SpuHasImgResponseData,SaleAttrResponseData,HasSaleAttrResponseData,SpuData,SkuData,SkuInfoResponseData } from './type'


enum API {
  // 获取已有的SPU数据接口
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌数据接口
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',// 修改SPU界面中的品牌选择框中的数据
  // 获取对应spu下的sku图片
  IMAGE_URL = '/admin/product/spuImageList/',// 修改SPU界面中的照片墙中的数据
  // 获取某个SPU下的全部已有的销售属性接口
  SPUHASSALEATTR = '/admin/product/spuSaleAttrList/',// 修改SPU界面中的表格中的数据
  // 获取整个项目全部销售属性接口[颜色,版本,尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',// 修改SPU界面中的销售属性的选择框中的数据
  // 添加一个SPU
  SAVESPU_URL = '/admin/product/saveSpuInfo',
  // 修改一个已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 添加一个SKU
  SAVESKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有SPU下的全部SKU
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除一个已有的spu
  DELETESPU_URL = '/admin/product/deleteSpu/'
}

// 获取已有的SPU数据
export const reqHasSpu = (pageNo:number,limit:number,category3ID:number|string)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${pageNo}/${limit}?category3Id=${category3ID}`)

// 获取所有品牌的数据
export const reqAllTrademark = ()=>request.get<any,AllTrademarkResponseData>(API.ALLTRADEMARK_URL)

// 获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId:number)=>request.get<any,SpuHasImgResponseData>(API.IMAGE_URL+spuId)

// 获取某个SPU下的全部已有的销售属性
export const reqSpuHasSaleAttr = (spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR+spuId)

// 获取整个项目全部销售属性
export const reqAllSaleAttr = ()=>request.get<any,HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加或修改一个Spu
export const reqAddOrUpdateSpu = (data:SpuData)=>{
  if(data.id){
    return request.post<any,any>(API.UPDATESPU_URL,data)
  }else{
    return request.post<any,any>(API.SAVESPU_URL,data)
  }
}

// 添加一个SKU
export const reqAddSku = (data:SkuData)=>request.post<any,any>(API.SAVESKU_URL,data)

// 查看某一个已有SPU下的全部SKU
export const reqSkuInfo = (spuId:number|string)=>request.get<any,SkuInfoResponseData>(API.SKUINFO_URL+spuId)

// 删除一个已有的spu
export const reqDeleteSpu = (spuId:number|string)=>request.delete<any,any>(API.DELETESPU_URL+spuId)