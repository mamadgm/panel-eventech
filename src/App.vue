<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner' // Make sure the path is correct
</script>

<template>
  <div class="font-sans bg-gray-50 text-gray-900 min-h-screen">
    <Toaster />
    <router-view />
  </div>
</template>
