<script setup lang="ts">
import { ref } from 'vue';

const products = ref([
  { name: 'Product 1', price: 100, description: 'Description for product 1' },
  { name: 'Product 2', price: 150, description: 'Description for product 2' },
  { name: 'Product 3', price: 200, description: 'Description for product 3' },
]);
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-semibold">View Products</h2>
    <div v-for="product in products" :key="product.name" class="border p-4 rounded-md space-y-2">
      <h3 class="font-medium">{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <p class="font-semibold">Price: ${{ product.price }}</p>
    </div>
  </div>
</template>
