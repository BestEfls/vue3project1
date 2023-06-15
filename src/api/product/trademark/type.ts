interface ResponseData {
  code:number,
  message:string,
  ok:boolean
}

// 品牌信息的类型
export interface Trademark {
  id?:number,// 品牌id
  tmName:string,// 品牌名称
  logoUrl:string,// 品牌logo图片url
  createTime?:string,// 品牌创建时间
  updateTime?:string// 品牌更新时间
}

export type Records = Trademark[]

// 获取品牌信息接口返回值的类型
export interface TrademarkResponseData extends ResponseData{
  data:{
    records:Records,
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number
  }
}

