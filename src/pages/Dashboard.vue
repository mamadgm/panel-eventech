<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <SidebarProvider class="w-full">
    <AppSidebar />
    <main class="p-6">
      <SidebarTrigger />
      <router-view />
    </main>
  </SidebarProvider>
</template>


