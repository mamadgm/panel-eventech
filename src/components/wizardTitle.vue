<script setup lang="ts">
const props = defineProps<{
  big: string;
  small: string;
}>();
</script>
<template>
  <div class="h-24">
    <h2 class="text-3xl font-semibold mb-2 font-[yekanb]">
      {{ big }}
    </h2>
    <p class="text-gray-600 mb-4 font-[yekan]">
      {{ small }}
    </p>
  </div>
</template>
