<script setup lang="ts">
import { ref } from 'vue';

const messages = ref([
  { sender: 'admin@example.com', subject: 'Welcome to the platform', date: '2025-04-18' },
  { sender: 'support@example.com', subject: 'Issue with your account', date: '2025-04-17' },
  { sender: 'sales@example.com', subject: 'New product release', date: '2025-04-16' },
]);
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-semibold">Inbox</h2>
    <div v-for="message in messages" :key="message.subject" class="border p-4 rounded-md space-y-2">
      <h3 class="font-medium">{{ message.subject }}</h3>
      <p class="text-sm">From: {{ message.sender }}</p>
      <p class="text-xs text-gray-500">Date: {{ message.date }}</p>
      <button class="text-blue-600">Read</button>
    </div>
  </div>
</template>
