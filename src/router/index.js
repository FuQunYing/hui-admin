import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout.vue'



const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/index', component: Layout, redirect: '/usr',
      children: [
        { path: '/usr', name: 'usr', component: () => import('../components/system/User.vue') },
        { path: '/frontUsr', name: 'frontUsr', component: () => import('../components/system/FrontUser.vue') },
        { path: '/menu', name: 'menu', component: () => import('../components/system/Menu.vue') },
        { path: '/notice', name: 'notice', component: () => import('../components/notice/Notice.vue') },
        { path: '/clock', name: 'clock', component: () => import('../components/clock/Clock.vue') },
        { path: '/circle', name: 'circle', component: () => import('../components/circle/Circle.vue') },
        { path: '/task', name: 'task', component: () => import('../components/task/Task.vue') },
        { path: '/area', name: 'area', component: () => import('../components/active/Area.vue') },
        { path: '/train', name: 'train', component: () => import('../components/active/Train.vue') },
        { path: '/merchant', name: 'merchant', component: () => import('../components/mall/Merchant.vue') },
        { path: '/product', name: 'product', component: () => import('../components/mall/Product.vue') },
        { path: '/pointRule', name: 'pointRule', component: () => import('../components/point/Rules.vue') },
        { path: '/helpNotice', name: 'helpNotice', component: () => import('../components/help/HelpNotice.vue') },
      ]
    },
  ]
})

export default router
