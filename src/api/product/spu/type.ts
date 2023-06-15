// 服务器全部接口返回的数据类型
interface ResponseData {
  code:number,
  message:string,
  ok:boolean
}

// SPU数据类型
export interface SpuData {
  id?: number,
  spuName: string,
  description: string,
  category3Id: number|string,
  tmId: number|string,
  spuSaleAttrList: null|SaleAttr[],
  spuImageList: null|SpuImg[],
}

// SPU列表数据类型
export type Records = SpuData[]

// 获取已有Spu数据接口的返回值类型
export interface HasSpuResponseData extends ResponseData {
  data:{
    records:Records,
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number 
  }
}

// 品牌数据的类型
export interface Trademark{
  id:number,
  tmName:string,
  logoUrl:string,
  createTime?: string,
  updateTime?: string,
}

// 品牌数据接口返回的数据类型
export interface AllTrademarkResponseData extends ResponseData {
  data:Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?:number,
  createTime?:string,
  updateTime?:string,
  spuId?:number,
  imgName?:string,
  imgUrl?:string,
  name?:string,
  url?:string
}

// 已有的SPU商品照片墙接口返回的数据类型
export interface SpuHasImgResponseData extends ResponseData{
  data:SpuImg[]
}

// 已有的销售属性值的ts类型saleAttr
export interface SaleAttrValue {
  id?:number,
  createTime?:null,
  updateTime?:null,
  spuId?:number,
  baseSaleAttrId:number,
  saleAttrValueName:string,
  saleAttrName?:string,
  isChecked?:null
}

// 存储已有的销售属性值的列表类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性类型
export interface SaleAttr {
  id?:number,
  createTime?:null,
  updateTime?:null,
  spuId?:number,
  baseSaleAttrId:number|string,
  saleAttrName:string,
  flag?:boolean,
  spuSaleAttrValueList:SpuSaleAttrValueList,
  saleIdAndValueId?:string
}

// SPU已有的销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
  data:SaleAttr[]
}

// 已有的全部SPU销售属性的ts类型
export interface HasSaleAttr {
  id:number,
  name:string
}

// 
export interface HasSaleAttrResponseData extends ResponseData{
  data:HasSaleAttr[]
}

// sku数据类型
export interface SkuData {
  category3Id:string|number,
  spuId:string|number,
  tmId:string|number,
  skuName:string,
  price:string|number,
  weight:string|number,
  skuDesc:string,
  skuAttrValueList:{
    attrId:number|string,
    valueId:number|string
  }[],
  skuSaleAttrValueList:{
    saleAttrId:number|string,
    saleAttrValueId:number|string
  }[],
  skuDefaultImg:string
}

// 获取SKU数据接口的ts类型
export interface SkuInfoResponseData extends ResponseData {
  data:SkuData[]
}