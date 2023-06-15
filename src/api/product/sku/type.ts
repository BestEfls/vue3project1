interface ResponseData {
  code:number,
  ok:boolean,
  message:string
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
  skuDefaultImg:string,
  isSale?:number,
  id?:number
}

export interface SkuResponseData extends ResponseData{
  data:{
    records : SkuData[],
    total:number,
    size:number,
    current: number,
    orders: any[],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages:number
  }
}

export interface SkuInfoResponseData extends ResponseData {
  data:SkuData
}