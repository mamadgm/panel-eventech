<script setup lang="ts">
import { HeartHandshake } from "lucide-vue-next";
</script>

<template>
  <div class="grid grid-cols-4">
    <HeartHandshake
      class="h-16 w-16 flex justify-start items-start col-span-1 text-blue-600 drop-shadow-blue-400 drop-shadow-xl"
    >
    </HeartHandshake>
    <div
      class="min-h-[50px] flex flex-col justify-start items-start col-span-3 mr-4"
    >
      <h2>خوش آمدید به</h2>

      <h1 class="text-2xl font-black">تیکت هوشمند</h1>
    </div>
  </div>
</template>
