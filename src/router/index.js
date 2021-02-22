import Vue from 'vue'
import VueRouter from 'vue-router'
import Network from '@/views/Network.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Network',
    component: Network
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
