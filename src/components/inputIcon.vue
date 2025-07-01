<script setup lang="ts">
import type { Component } from "vue";

const props = defineProps<{
  title: string;
  hint: string;
  icon?: Component;
  modelValue: string; // Accept v-model value
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="flex flex-col w-full min-h-10 min-w-12 gap-y-1.5">
    <h1 class="text-xl font-[yekanb]">{{ title }}</h1>
    <div class="flex items-center border-2 rounded-xl p-2 min-h-12 bg-white">
      <div v-if="icon" class="flex">
        <icon class="text-gray-500" />
        <div class="w-px h-6 bg-gray-300 mx-2"></div>
      </div>

      <input
        type="text"
        :placeholder="hint"
        :value="modelValue"
        @input="updateValue"
        class="flex-1 outline-none text-gray-700 placeholder:text-gray-400 bg-transparent placeholder:text-xs"
      />
    </div>
  </div>
</template>
