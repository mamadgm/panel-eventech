<script setup lang="ts">
defineProps<{
  message?: string;
  error?: string;
  loading?: boolean;
}>();
</script>

<template>
  <div v-if="loading" class="text-blue-600 text-center mt-4 bg-blue-100 p-2 rounded">
    لطفاً صبر کنید...
  </div>
  <div v-else-if="message" class="text-green-600 text-center mt-4 bg-green-100 p-2 rounded">
    {{ message }}
  </div>
  <div v-else-if="error" class="text-red-600 text-center mt-4 bg-red-100 p-2 rounded">
    {{ error }}
  </div>
</template>
