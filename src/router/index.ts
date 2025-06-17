import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const router = createRouter({
  linkActiveClass: 'bg-gray-50 text-indigo-600',
  linkExactActiveClass: 'text-gray-700',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/weather',
      name: 'weather',
      component: () => import('../views/WeatherView.vue'),
    },
  ],
})

export default router
