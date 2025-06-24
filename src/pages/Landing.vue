<script setup lang="ts">
import Header from "@/components/Header.vue";
import sidebarButton from "@/components/sidebarButton.vue";
import sidebarHead from "@/components/sidebarHead.vue";
</script>

<template>
  <div>
    <div class="grid grid-cols-5">
      <div class="flex flex-col items-center justify-start h-dvh ">
        <div class="h-[12dvh] w-[90%] pt-4 pr-4">
          <sidebarHead></sidebarHead>
        </div>
        <div
          class="bg-gray-100 h-[50dvh] w-[90%] flex flex-col items-start px-4 justify-evenly rounded-2xl"
        >
          <sidebarButton title="سامانه پیامکی" :icon="0" :enabled="true">
          </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="1"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="2"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="3"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="4"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="5"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="6"> </sidebarButton>
        </div>

        <div
          class="bg-gray-100 h-[20dvh] w-[90%] flex flex-col items-start px-4 justify-evenly rounded-2xl mt-4"
        >
          <sidebarButton title="سامانه پیامکی" :icon="0"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="1"> </sidebarButton>
          <sidebarButton title="سامانه پیامکی" :icon="2"> </sidebarButton>
        </div>
      </div>

      <div class="col-span-4">
        <Header></Header>
        <div class="bg-red-400 p-Title Test">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
