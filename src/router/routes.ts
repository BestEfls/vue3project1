import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      show: true,
      icon: 'CirclePlus',
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          show: true,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      show: false,
      icon: 'Compass',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      show: false,
      icon: 'StarFilled',
    },
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      show: true,
      title: '数据大屏',
      icon: 'Platform',
    },
  },
]

const asyncRoute: Array<RouteRecordRaw> = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      show: true,
    },
    children: [
      {
        path: '/acl/user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),

        meta: {
          show: true,
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: {
          show: true,
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          show: true,
          title: '菜单管理',
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理',
      icon: 'Goods',
      show: true,
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',
          icon: 'ShoppingCartFull',
          show: true,
        },
      },
      {
        path: '/product/attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '属性管理',
          icon: 'ChromeFilled',
          show: true,
        },
      },
      {
        path: '/product/spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'SPU管理',
          icon: 'Calendar',
          show: true,
        },
      },
      {
        path: '/product/sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'SKU管理',
          icon: 'Orange',
          show: true,
        },
      },
    ],
  },
]

//任意路由
const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  /*
      使用了路由的匹配语法,/:vv(.*)代表匹配任意字符的路由 比如/123,/user/1321,/u1sd1/123/www都可以被匹配到
      最后的*可以讲路由中的参数分成一个数组.比如 路径/u1sd1/123/www,如果不使用*则route.params.vv就等于'/u1sd1/123/www'.
      如果使用* 则route.params.vv就等于['u1sd1','123','www']每一段都会被分开
  */
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
    icon: 'DataLine',
  },
}

export { routes, asyncRoute, anyRoute }
