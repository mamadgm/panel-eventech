<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  type SidebarProps,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { toast } from 'vue-sonner'


const props = defineProps<SidebarProps>();
const route = useRoute();
const activePath = computed(() => route.path);


const data = {
  navMain: [
    {
      title: "ایجاد رویداد",
      icon: Calendar,
      url: "/dashboard/create-event", 
      items: [],
    },
    {
      title: "مدیریت رویداد",
      icon: Home,
      url: "/dashboard/manage-event", 
      items: [
        {
          title: "تنظیمات کلی",
          url: "settings",
        },
        {
          title: "اپراتورها",
          url: "operators",
        },
        {
          title: "سالن رویداد",
          url: "chairs",
        },
        {
          title: "لیست شرکت‌کنندگان",
          url: "guests",
        },
      ],
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <router-link to="/dashboard">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Home class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">EvenTech</span>
                <span>V1.0.0 (beta) </span>
              </div>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
            <SidebarMenuButton as-child>
              <a :href="item.url" class="font-medium">
                {{ item.title }}
              </a>
            </SidebarMenuButton>
            <SidebarMenuSub v-if="item.items.length">
              <SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                <SidebarMenuSubButton as-child :is-active="activePath.includes(`/dashboard/manage-event/${route.params.id}/${childItem.url}`)">
                  <router-link :to="`/dashboard/manage-event/${route.params.id}/${childItem.url}`">
                    {{ childItem.title }}
                  </router-link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>
