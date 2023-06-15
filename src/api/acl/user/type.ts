interface ResponseData {
  code:number,
  message:string,
  ok:boolean
}

export interface User {
  id?:number,
  createTime?:string,
  updateTime?:string,
  username:string,
  password:string,
  name?:string,
  phone?:null,
  roleName?:string
}

export type Records = User[] 

export interface UserResponseData extends ResponseData {
  data:{
    records:Records,
    total:number,
    size:number,
    current:number,
    pages:number  
  }
}

export interface RoleData {
    id: 1,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark?: null
}

export interface AllRoleResponseData extends ResponseData {
  data:{
    assignRoles:RoleData[],
    allRolesList:RoleData[]
  }
}

export interface SetRoleData {
  roleIdList:number[],
  userId:number
}