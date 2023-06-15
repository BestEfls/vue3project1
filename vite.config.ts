import { defineConfig,UserConfigExport,ConfigEnv,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入mock插件
import { viteMockServe } from 'vite-plugin-mock'
// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default ({command,mode}:ConfigEnv):UserConfigExport=>{
  // 获取各个环境下的环境变量
  let env = loadEnv(mode,process.cwd())// mode参数指明当前环境,process.cwd()获取根目录,也就是环境变量文件的位置
  return {
    base:'./',
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve',
      }),
    ],
    resolve: {
      alias: {
          "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      // 预处理器配置项
      preprocessorOptions: {
        less: {
          math: "always",// 使用math语法
          globalVars:{// 定义less全局变量
            base_menu_background:'#001529',// 主页左侧菜单的背景颜色
            base_menu_width:'260px',// 主页左侧菜单的宽度
            base_tabbar_height:'50px',// tabbar的高度
            base_menu_folded_width:'70px',// menu折叠过后的宽度
          }
        },
      },
    },
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          target: env.VITE_SERVE,// 服务器地址设置
          changeOrigin: true,// 是否需要代理跨域
          rewrite: (path) => path.replace(/^\/api/, ''),// 路径重写,将路径中的/api去掉
        }
      }
    }
  }
}
