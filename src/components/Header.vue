<script setup lang="ts">
import { useModalStore } from "@/stores/model";
import { LucideBell } from "lucide-vue-next";
import { Search } from "lucide-vue-next";
import { Plus } from "lucide-vue-next";
const modal = useModalStore()

</script>

<template>
  <div class="grid grid-cols-12 gap-2 mt-1 p-4">
    <div class="min-h-[50px] flex justify-center items-center col-span-2">
      <img
        class="h-18 w-18 bg-blue-100 rounded-full"
        alt="user"
       src="/pics/person.png"
        
      ></img>
      <div class="mr-4">
        <h1 class="text-sm font-bold">علیرضا منصوریان</h1>
        <h2 class="text-xs text-gray-500">مدیر پروژه</h2>
      </div>
    </div>
    <div class="min-h-[50px] flex justify-center items-center col-span-2"></div>
    <div
      class="h-18 w-18 border-2 rounded-2xl flex justify-center items-center hover:bg-gray-100"
    >
      <LucideBell />
    </div>

    <div
      class="bg-white rounded-2xl border-2 p-4 border-gray-200 min-h-[50px] flex justify-between items-center col-span-5"
    >
      <h1 class="text-gray-400">جستجو...</h1>
      <Search></Search>
    </div>
    <button
      class="bg-blue-500 hover:bg-blue-400 min-h-[50px] rounded-2xl flex justify-center items-center col-span-2"
    @click="modal.open()"
    >
      <Plus class="text-white font-bold"></Plus>
      <div class="text-white font-bold">رویداد جدید</div>
    </button>
  </div>
</template>
