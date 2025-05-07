import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import ManageEvent from '@/pages/dashboard/ManageEvent.vue'
import CreateProduct from '@/pages/dashboard/CreateEvent.vue'
import ViewProduct from '@/pages/dashboard/ViewProductScreen.vue'
import Inbox from '@/pages/dashboard/InboxScreen.vue'
import Settings from '@/pages/dashboard/SettingsScreen.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    meta: { requiresAuth: true },
    component: Dashboard,
    children: [
      { path: 'create-event', component: CreateProduct },
      { path: 'manage-event', component: ManageEvent },
      
      // 🔥 THIS is the correct nested route for event-specific tabs
      {
        path: 'manage-event/:id',
        component: () => import('@/pages/dashboard/ManageEventLayout.vue'),
        props: true,
        children: [
          { path: '', redirect: 'settings' },
          {
            path: 'operators',
            component: () => import('@/pages/dashboard/manage-event/OperatorsTab.vue'),
          },
          {
            path: 'chairs',
            component: () => import('@/pages/dashboard/manage-event/ChairsTab.vue'),
          },
          {
            path: 'guests',
            component: () => import('@/pages/dashboard/manage-event/GuestsTab.vue'),
          },
          {
            path: 'settings',
            component: () => import('@/pages/dashboard/manage-event/SettingsTab.vue'),
          },
          {
            path: 'scenes',
            component: () => import('@/pages/dashboard/manage-event/Scenes.vue'),
          },
          {
            path: 'sms',
            component: () => import('@/pages/dashboard/manage-event/Smshandle.vue'),
          },
        ],
      },
      
      { path: 'view-product', component: ViewProduct },
      { path: 'inbox', component: Inbox },
      { path: 'settings', component: Settings },
    ],
  }  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('auth_token') // or your custom logic

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
