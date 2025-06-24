<script setup lang="ts">
import { computed } from "vue";

//icons
import { House } from "lucide-vue-next";
import { Ticket } from "lucide-vue-next";
import { Users } from "lucide-vue-next";
import { LetterText } from "lucide-vue-next";
import { MessageCircle } from "lucide-vue-next";
import { Tv } from "lucide-vue-next";
import { Newspaper } from "lucide-vue-next";
//icons

const iconComponents = [
  House,
  Ticket,
  Users,
  LetterText,
  MessageCircle,
  Tv,
  Newspaper,
];

const props = defineProps<{
  title: string;
  icon: number;
  enabled?: boolean;
}>();

const currentIconComponent = computed(() => {
  // Check if the provided icon number is within the valid range of our mapping
  if (props.icon >= 0 && props.icon < iconComponents.length) {
    return iconComponents[props.icon];
  }
  // If the number is out of range, return null or a default icon component
  // Returning null means no icon will be rendered if the number is invalid.
  return null;
});

const dynamicClass = computed(() => {
  if (!props.enabled) return 'text-gray-600';
  return props.icon % 2 === 0 ? 'text-green-600' : 'text-blue-600';
});

</script>

<template>
  <div
    class="py-2 px-4 rounded-2xl flex w-full gap-3"
    :class="
      enabled
        ? 'bg-white hover:scale-[102%] transition-all duration-100'
        : 'hover:bg-gray-50 hover:scale-[102%] transition-all duration-100'
    "
  >
    <component
      :is="currentIconComponent"
      v-if="currentIconComponent"
      class="w-7 h-7"
      :class="dynamicClass"
    />
    <h class="text-gray-800 font-medium">{{ props.title }}</h>
  </div>
</template>
