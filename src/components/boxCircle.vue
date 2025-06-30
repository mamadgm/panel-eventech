<script setup lang="ts">
import type { Component } from "vue";
import { BadgeCheck } from "lucide-vue-next";

const props = defineProps<{
  number: string;
  title: string;
  desc: string;
  icon: Component;
  badge?: boolean;
}>();
</script>

<template>
  <div class="relative">
    <!-- Circle -->
    <div
      class="absolute -top-9 left-1/2 -translate-x-1/2 w-18 h-18 bg-white rounded-full border-2 border-green-500 z-10 flex justify-center items-center"
    >
      <icon class="h-8 w-8 text-gray-400"></icon>
    </div>

    <!-- Box -->
    <div
      class="bg-white border h-full border-gray-150 rounded-[40px] shadow p-6 pt-10"
    >
      <div class="grid grid-cols-7 h-full">
        <!-- Left Side -->
        <div
          class="col-span-3 flex items-center justify-center font-[yekanb] text-5xl border-l-3 mt-8 mb-8 border-gray-100"
        >
          {{ number }}
        </div>

        <!-- Right Side -->
        <div class="col-span-4 flex justify-center flex-col items-start p-8">
          <h1 class="font-[yekanb] text-2xl">{{ title }}</h1>
          <div class="flex items-center gap-2 mt-2">
            <BadgeCheck v-if="badge" class="text-green-500" />
            <h2 class="font-[yekan]">{{ desc }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
