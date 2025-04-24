<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
{
    title: 'ایجاد رویداد',
    url: '/dashboard/create-event',
    icon: Calendar, // You can replace this icon with a different one if needed
  },
  {
    title: 'مدیریت رویداد',
    url: '/dashboard/manage-event', // Updated to match the new screen
    icon: Home,
  },
  {
    title: 'صندوق ورودی',
    url: '/dashboard/inbox',
    icon: Inbox,
  },

  {
    title: 'مشاهده محصولات',
    url: '/dashboard/view-product',
    icon: Search, // Use the icon that best fits the page
  },
  {
    title: 'تنظیمات',
    url: '/dashboard/settings',
    icon: Settings,
  },
]


// Sidebar open/close state
const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
    <!-- Sidebar with conditional visibility -->
    <Sidebar v-if="sidebarOpen" class="rtl:mr-auto ltr:ml-auto"> <!-- Example for RTL class handling -->
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>برنامه</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="item in items"
                :key="item.title"
              >
                <SidebarMenuButton asChild>
                  <router-link :to="item.url" class="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </template>
  
