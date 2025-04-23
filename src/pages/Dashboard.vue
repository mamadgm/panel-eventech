<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="p-6">
      <SidebarTrigger />
      <!-- This is where the child routes will be rendered -->
      <router-view />
    </main>
  </SidebarProvider>
</template>
