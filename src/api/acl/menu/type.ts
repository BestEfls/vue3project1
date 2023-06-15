interface ResponseData {
  code:number,
  message:string,
  ok:boolean
}

export interface MenuData {
  id: number,
  createTime: string,
  updateTime: string,
  pid: number,
  name: string,
  code: string,
  toCode?: string,
  type: number,
  status: null,
  level: number,
  children?: MenuData[],
  select: boolean
}

export interface MenuResponseData extends ResponseData {
  data:MenuData[]
}

export interface MenuParams {
  id?:number,
  code:string,// 权限值
  level:number,
  name:string,// 菜单的名字
  pid:number,// 父菜单的id
}