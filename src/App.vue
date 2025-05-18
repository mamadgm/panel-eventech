<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<template>
  <div class="font-sans bg-gray-50 text-gray-900 min-h-screen">
    <Toaster
      :icons="{}"
      position="top-center"
      richColors
      :toastOptions="{
        style: { fontSize: '1.1rem' },
        duration: 2000,
      }"
    />
    <router-view />
  </div>
</template>
