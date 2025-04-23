<script setup lang="ts">
import { ref } from 'vue';

const notificationsEnabled = ref(true);
const darkModeEnabled = ref(false);
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-semibold">Settings</h2>
    <div>
      <label for="notifications" class="block text-sm font-medium">Enable Notifications</label>
      <input id="notifications" v-model="notificationsEnabled" type="checkbox" class="w-4 h-4">
    </div>
    <div>
      <label for="darkMode" class="block text-sm font-medium">Enable Dark Mode</label>
      <input id="darkMode" v-model="darkModeEnabled" type="checkbox" class="w-4 h-4">
    </div>
    <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save Settings</button>
  </div>
</template>
