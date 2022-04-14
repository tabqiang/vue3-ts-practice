import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

const autoRequireRoutes = require.context('../router', true, /\.ts$/)
autoRequireRoutes.keys().forEach((i) => {
  if (i !== './index.ts') {
    routes.push(...autoRequireRoutes(i).default)
  }
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
