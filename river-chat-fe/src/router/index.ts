import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Chat',
    component: () => import('@/view/RiverChat.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes: routes
})

export default router
