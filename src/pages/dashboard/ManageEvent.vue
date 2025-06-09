<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, CalendarCheck, CalendarX } from "lucide-vue-next";
import { useEventStore } from "@/stores/event";
import { toast } from "vue-sonner";

const eventStore = useEventStore();

onMounted(async () => {
  try {
    await eventStore.getEvents();
  } catch (error: any) {
    toast.error("خطا در گرفتن رویداد ها", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  }
});

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString("fa-IR") +
    " - " +
    date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
  );
};
</script>

<template>
  <div class="space-y-4">
    <Card v-for="event in eventStore.events" :key="event.id" class="w-full min-w-5xl">
      <CardContent class="flex items-center gap-4 p-4 flex-wrap sm:flex-nowrap">
        <!-- Image -->
        <img :src="event.image || '/cinema.jpg'" alt="عکس رویداد" class="w-28 h-28 object-cover rounded-xl shrink-0" />

        <!-- Event Title + Tracking -->
        <div class="flex flex-col justify-between w-64 truncate">
          <div class="text-xl font-semibold text-gray-800 truncate">
            {{ event.name || "بدون عنوان" }}
          </div>
          <div class="text-sm text-gray-500">
            پیگیری: {{ event.tracking_number }}
          </div>
        </div>

        <!-- Date & Time Info -->
        <div class="flex flex-col text-sm text-gray-700 gap-2 grow">
          <div class="flex items-center gap-2">
            <CalendarClock class="w-4 h-4 text-gray-500" />
            شروع پذیرش: {{ formatDateTime(event.start_acceptance) }}
          </div>
          <div class="flex items-center gap-2">
            <CalendarCheck class="w-4 h-4 text-gray-500" />
            شروع رویداد: {{ formatDateTime(event.start_time) }}
          </div>
          <div class="flex items-center gap-2">
            <CalendarX class="w-4 h-4 text-gray-500" />
            پایان رویداد: {{ formatDateTime(event.end_time) }}
          </div>
        </div>

        <!-- Status Pills -->
        <div class="flex flex-col gap-2 px-2">
          <div :class="[
            'text-xs px-3 py-1 rounded-lg font-medium text-center',
            event.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
          ]">
            فعال: {{ event.is_active ? "بله" : "خیر" }}
          </div>
          <div :class="[
            'text-xs px-3 py-1 rounded-lg font-medium text-center',
            event.is_started
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700',
          ]">
            شروع شده: {{ event.is_started ? "بله" : "خیر" }}
          </div>
        </div>

        <!-- Manage Button -->
        <router-link :to="`/dashboard/manage-event/${event.id}/settings`"
          class="shrink-0 inline-flex items-center h-14 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition">
          مدیریت رویداد
        </router-link>
      </CardContent>
    </Card>
  </div>
</template>
