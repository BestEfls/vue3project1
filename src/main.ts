import { createApp } from 'vue'
// 引入resetcss
import '@/styles/reset.css'
// 引入全局样式
import '@/styles/style.css'
import App from '@/App.vue'
// 引入svg插件
import 'virtual:svg-icons-register'
// 引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
// Element-plus国际化配置
/* Element-plus组件默认使用英语,如果需要使用其它语言就需要自己进行配置 */
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 此处保存,因为没有ts声明文件.我们有两种方法解决.第一是直接使用//@ts-ignore去忽略这个错误,二是自己写一个声明文件
// 引入自定义全局组件注册插件
import globalComponents from '@/components/index.ts'
// 引入路由
import router from './router';
// 引入pinia仓库
import pinia from '@/store/index.ts'
// 引入鉴权文件
import './permission.ts'
// 引入暗黑模式所需要的css文件
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入全局指令函数
import { isHasButton } from './directive/has.ts'
const app = createApp(App)
isHasButton(app)
app.use(globalComponents)
app.use(ElementPlus,{
  locale:zhCn // Element-plus国际化配置
})
app.use(router)
app.use(pinia)
app.config.globalProperties.$a = '123'
app.mount('#app')


