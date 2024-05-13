import { createRouter,createWebHashHistory,createWebHistory } from "vue-router";
import { routes } from "./routes";


let router = createRouter({
  history:createWebHashHistory(),
  routes,
  scrollBehavior(to,from,savePosition){
    return {
      top:0,
      left:0,
    }
  }
})
/*
  一个坑:
    在vue3中,我们无法在setup中使用组件内守卫beforeRouteEnter,
    如果想要使用可以查看这篇文章:https://blog.csdn.net/qq_17335549/article/details/127942181
*/


export default router