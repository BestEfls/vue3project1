// 路由鉴权:设置项目中的路由是否能被访问
// 引入路由对象
import router from '@/router'
// 引入进度条库,nprogress
// @ts-ignore
import nprogress from 'nprogress'
// 引入进度条库的css
import 'nprogress/nprogress.css'
// 引入类型
import type { RouteLocationNormalized,NavigationGuardNext } from 'vue-router'
// 引入小仓库
import useUserStore from './store/modules/user'
// 引入大仓库
import pinia from './store'
// 注意:当我们在组件的外部想要使用小仓库时,必须要将大仓库也导入,并将大仓库作为小仓库函数的参数传入才可以正常使用.这是因为我们在组件外部使用小仓库时,大仓库还没有在main文件中被install.所以无法使用
// @ts-ignore
import { ElMessage } from 'element-plus'

nprogress.configure({showSpinner:false})// 取消掉nprogress进度条旁边的小圆圈
let userStore = useUserStore(pinia)

router.beforeEach(async (to:RouteLocationNormalized,from:RouteLocationNormalized,next:NavigationGuardNext)=>{
  nprogress.start()
  let token = userStore.token
  let username = userStore.username
  if(token){// 判断token是否存在,如果存在则说明已经登录了
    // 登录成功后如果想要访问login路由,则我们不允许.
    if(to.path=='/login'){
      nprogress.done()
      ElMessage({
        type:'info',
        message:'您已登录成功'
      })
      next({path:'/'})
      // return false// return false取消这次导航
    }else{
      // 如果用户要访问除了登录页面以外的路由,我们就先去查看是否有用户信息,如果有则放行,如果没有则发送请求获取用户信息.
      // 这样做的意义在于不论你在哪个路由处刷新页面都可以再次获取到用户信息
      if(username){// 如果有用户信息则直接放行
        next()
      }else{
        await userStore.userInfo().then(res=>{
          next(to)
        },async err=>{
          // 当token过期,或者用户手动修改了我们的token,就会进入这个分支
          ElMessage({
            type:'error',
            message:'token已过期,请重新登录'
          })
          await userStore.userLogOut() // 加await是为了保证退出登录成功后才导航到login路由
          next({path:'/login',query:{redirect:to.path}})
        })
      }
    }

  }else{// 还没登录
    if(to.path=='/login'){// 如果用户想要访问的是login路由,我们就直接放行
      next()
    }else{// 如果用户想访问的不是login路由,则我们将其重定向到login路由,并将其原本想要访问的路由作为query加到url中,这样就可以在登陆后直接跳转到用户原本想要访问到路由
      next({path:'/login',query:{redirect:to.path}})
    }
  }
})

router.afterEach((to:RouteLocationNormalized,from:RouteLocationNormalized)=>{
  document.title = '东理甄选平台-'+to.meta.title
  nprogress.done()
})

// 当用户未登录时,只能访问login路由
// 当用户登录后,login路由就不能被访问,其它路由可以被访问