<script setup lang="ts">
import { ref } from 'vue';

const profile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://via.placeholder.com/150',
});
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center space-x-4">
      <img :src="profile.avatar" alt="Avatar" class="w-16 h-16 rounded-full">
      <div>
        <h2 class="text-xl font-semibold">{{ profile.name }}</h2>
        <p class="text-sm text-gray-500">{{ profile.email }}</p>
      </div>
    </div>
    <div class="mt-4">
      <h3 class="text-lg font-medium">Account Information</h3>
      <p>Email: {{ profile.email }}</p>
      <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Edit Profile</button>
    </div>
  </div>
</template>
