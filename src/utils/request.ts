// 进行axios二次封装是为了更好的使用请求拦截器和响应拦截器
import axios from 'axios'
// @ts-ignore
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user.ts'


// 第一步:利用axios的create方法创建axios实例
let request = axios.create({
  baseURL:import.meta.env.VITE_APP_BASE_API,// 设置基础路径
  timeout:5000,// 设置超时时间,
})

request.interceptors.request.use((config)=>{
  // config配置对象,headers属性包含请求头信息,经常给服务器端携带公共参数
  let userStore = useUserStore()
  config.headers.token = userStore?.token
  // 注意:这里一定要返回这个config
  return config
})

request.interceptors.response.use((response)=>{
  // 请求成功时的回调
  return response.data
},(error)=>{
  // 请求失败时的回调
  let message = ''
  let status = error.response?.status
  switch(status){
    case 401:
      message = 'TOKEN过期'
      break
    case 403:
      message = '无权访问'
      break
    case 404:
      message = '地址错误'
      break
    case 500:
      message = '服务器异常'
      break
    default:
      message = '网络异常'
      break
  }
  // 利用element-plus的组件进行错误信息的提示
  ElMessage({
    type:'error',
    message,
  })

  return  Promise.reject(error)
})

export default request