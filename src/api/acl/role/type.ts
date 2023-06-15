interface ResponseData {
  code:number,
  message:string,
  ok:boolean
}

export interface RoleData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null
}

export interface RoleResponseData extends ResponseData {
  data:{
    records:RoleData[],
    total: number,
    size: number,
    current: number,
    orders?: any[],
    optimizeCountSql?: boolean,
    hitCount?: boolean,
    countId?: null,
    maxLimit?: null,
    searchCount?: boolean,
    pages: number
  }
}

// 菜单权限数据的ts类型
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

export interface MenuListResponseData extends ResponseData {
  data:MenuData[]
}