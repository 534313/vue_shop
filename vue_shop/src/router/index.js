import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import '../assets/css/global.css'
import '../icon/iconfont.css'
import Home from '../components/Home.vue'

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios
Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home', component: Home
  }
]

const router = new VueRouter({
  routes
})
//  路由导航守卫
router.beforeEach((to, from, next) => {
  //  to:将要跳转的界面
  //  from:从哪个界面跳转
  //  next:下一个要跳转的界面（真正跳转的界面）
  if (to.path === '/login') return next()
  //  tokensrc在取到token时取true
  const tokensrc = window.sessionStorage.getItem('token')
  if (!tokensrc) return next('/login')
  next()
})
export default router
