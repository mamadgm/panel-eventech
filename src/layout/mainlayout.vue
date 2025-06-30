<script setup lang="ts">
import Header from "@/components/Header.vue";
import ModelWizard from "@/components/modelWizard.vue";
import sidebarButton from "@/components/sidebarButton.vue";
import sidebarHead from "@/components/sidebarHead.vue";
</script>

<template>
  <ModelWizard></ModelWizard>
  <div class="grid grid-cols-5 bg-white h-screen overflow-hidden">
    <div class="flex flex-col items-center justify-start h-full">
      <div class="h-[12dvh] w-[90%] pt-4 pr-4">
        <sidebarHead />
      </div>

      <div
        class="bg-gray-100 h-[50dvh] w-[90%] flex flex-col items-start px-4 justify-evenly rounded-2xl"
      >
        <sidebarButton title="سامانه پیامکی" :icon="0" :enabled="true" />
        <sidebarButton title="سامانه پیامکی" :icon="1" />
        <sidebarButton title="سامانه پیامکی" :icon="2" />
        <sidebarButton title="سامانه پیامکی" :icon="3" />
        <sidebarButton title="سامانه پیامکی" :icon="4" />
        <sidebarButton title="سامانه پیامکی" :icon="5" />
        <sidebarButton title="سامانه پیامکی" :icon="6" />
      </div>

      <div
        class="bg-gray-100 h-[20dvh] w-[90%] flex flex-col items-start px-4 justify-evenly rounded-2xl mt-4"
      >
        <sidebarButton title="سامانه پیامکی" :icon="0" />
        <sidebarButton title="سامانه پیامکی" :icon="1" />
        <sidebarButton title="سامانه پیامکی" :icon="2" />
      </div>
    </div>

    <div class="col-span-4 flex flex-col h-full w-full overflow-y-hidden">
      <div class="h-[12dvh]">
        <Header />
      </div>
      <div
        class="flex-1 scroll-styled overflow-y-auto border-amber-300"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* scoped or global CSS */
.scroll-styled::-webkit-scrollbar {
  width: 4px;
}

.scroll-styled::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-styled::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 128, 0.6); /* semi-transparent thumb */
  border-radius: 16px;
}
</style>
