import { App } from "vue";
// 自定义插件实现全局组件的批量注册
import SvgIcon from '@/components/SvgIcon/index.vue'
import Category from '@/components/Category/index.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
type allGlobalComponent = {
  [name:string]:any
}

let allGlobalComponents:allGlobalComponent = {
  SvgIcon,
  Category,
}

export default {
  install(app:App<Element>){    
    Object.keys(allGlobalComponents).forEach(item=>{
      app.component(item,allGlobalComponents[item])
    })
    // 将element-plus中的所有icon图标组件注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      if(key=="Menu")continue
      app.component(key, component)
    }
  }
}