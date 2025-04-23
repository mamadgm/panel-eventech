import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Profile from '@/pages/dashboard/ProfileScreen.vue'
import CreateProduct from '@/pages/dashboard/CreateProductScreen.vue'
import ViewProduct from '@/pages/dashboard/ViewProductScreen.vue'
import Inbox from '@/pages/dashboard/InboxScreen.vue'
import Settings from '@/pages/dashboard/SettingsScreen.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: 'profile', component: Profile },
      { path: 'create-product', component: CreateProduct },
      { path: 'view-product', component: ViewProduct },
      { path: 'inbox', component: Inbox },
      { path: 'settings', component: Settings },
    ],
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
