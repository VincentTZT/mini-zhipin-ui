import { createRouter, createWebHistory } from 'vue-router'
import Routers from './routers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...Routers]
})

router.beforeEach((to, from, next) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'MINI-ZHIPIN'
  next()
})

export default router
