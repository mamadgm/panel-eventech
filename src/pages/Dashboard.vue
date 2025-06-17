<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <!-- <SidebarProvider class="w-full"> -->
  <div>
    <div class="grid grid-cols-8">
      <div class="flex flex-col items-center justify-start bg-cyan-500 h-dvh">
      
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      
      </div>

      <div class="col-span-7">
        <Header></Header>
        <div class="bg-red-400 p-1">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <!-- </SidebarProvider> -->
</template>
