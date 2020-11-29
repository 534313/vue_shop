import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import '../assets/css/global.css'
import '../icon/iconfont.css'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import axios from 'axios'
import Users from '../components/user/Users.vue'
import Goods from '../components/good/Goods.vue'
//  axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8080/ssm_all_war/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
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
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome', component: Welcome
      },
      {
        path: '/users', component: Users
      },
      {
        path: '/goods', component: Goods
      }
    ]
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
