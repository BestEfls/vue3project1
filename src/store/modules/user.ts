import { defineStore } from "pinia";
// 引入用户登录接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
// 引入登录函数的参数类型与返回值类型
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type.ts'
// 引入数据state的类型
import type { UserState } from "./types/type";
// 引入路由数组对象
import { routes, asyncRoute, anyRoute } from '@/router/routes'
// 引入路由对象
import router from '@/router'
// 从lodash引入深拷贝函数
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

let useUserStore = defineStore('User', {
  // 数据存储的地方
  state: (): UserState => {
    return {
      token: localStorage.getItem('TOKEN'),
      userMenu: routes,
      username: '',
      avatar: '',
      buttons:[]
    }
  },
  // 函数存储的地方
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = <string>result.data
        // 将得到的token进行本地存储
        localStorage.setItem('TOKEN', <string>result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },

    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        let userAsyncRoute = filterAsyncRoute( cloneDeep(asyncRoute),result.data.routes)
        this.userMenu = [...routes,...userAsyncRoute,anyRoute]
        let a:any[] = [...userAsyncRoute,anyRoute]
        a.forEach(item=>{
          router.addRoute(item)
        })  
        return Promise.resolve()
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录
    async userLogOut() {
      let result = await reqLogout()
      if (result.code === 200) {
        this.username = ''
        this.avatar = ''
        this.token = ''
        localStorage.removeItem('TOKEN')
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }

  },
  // 计算属性
  getters: {

  }
})

// 对外暴露
export default useUserStore