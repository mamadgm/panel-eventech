<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import DatePicker from "vue3-persian-datetime-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Cinema from "@/components/Cinema.vue";
import { toast } from "vue-sonner";

import { useEventStore } from "@/stores/event";
import { useHallStore } from "@/stores/hall";
const hallStore = useHallStore();
const eventStore = useEventStore();

const route = useRoute();
const eventId = parseInt(route.params.id as string);

function handleSubmit() {
  try {
    eventStore.UpdateEvent(eventId);
    toast.success(`رویداد با موفقیت ویرایش شد`);
  } catch (error: any) {
    toast.error("خطا در ویرایش رویداد", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  }
}

onMounted(async () => {
  eventStore.setFormDataFromEventId(eventId);

  try {
    await hallStore.getDefealutHalls();
  } catch (error: any) {
    toast.error("خطا در گرفتن سالن ها", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  }
});

async function handleGetHall(id: number) {
  try {
    await hallStore.getFullHall(id);
  } catch (error: any) {
    toast.error("خطا در گرفتن سالن", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
    <h1 class="text-3xl font-bold text-right mb-6">ویرایش رویداد</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6 text-right">
      <!-- Event Name -->
      <div>
        <label for="name" class="block mb-1 text-sm font-medium text-gray-700"
          >نام رویداد</label
        >
        <input
          v-model="eventStore.form.name"
          type="text"
          id="name"
          placeholder="نام رویداد"
          class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Event Date-Time Pickers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            for="start_acceptance"
            class="block mb-1 text-sm font-medium text-gray-700"
            >شروع پذیرش</label
          >
          <DatePicker
            v-model="eventStore.form.start_acceptance"
            type="datetime"
            format="YYYY-MM-DD HH:mm:00"
            displayFormat="HH:mm:00 jYYYY-jMM-jDD"
            class="w-full"
          />
        </div>
        <div>
          <label
            for="start_time"
            class="block mb-1 text-sm font-medium text-gray-700"
            >زمان شروع</label
          >
          <DatePicker
            v-model="eventStore.form.start_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:00"
            displayFormat="HH:mm:00 jYYYY-jMM-jDD"
            class="w-full"
          />
        </div>
        <div>
          <label
            for="end_time"
            class="block mb-1 text-sm font-medium text-gray-700"
            >زمان پایان</label
          >
          <DatePicker
            v-model="eventStore.form.end_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:00"
            displayFormat="HH:mm:00 jYYYY-jMM-jDD"
            class="w-full"
          />
        </div>
      </div>

      <!-- Select Hall -->
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700"
          >محل برگزاری</label
        >
        <RadioGroup v-model="eventStore.form.default_hall" class="space-y-3">
          <template v-for="hall in hallStore.hallsById" :key="hall.id">
            <div class="flex items-center gap-2">
              <RadioGroupItem
                :value="hall.id"
                :id="`hall-${hall.id}`"
                class="form-radio text-blue-600"
                @click="handleGetHall(hall.id)"
              />
              <label :for="`hall-${hall.id}`" class="text-sm text-gray-800">
                {{ hall.name }} - {{ hall.address }}
              </label>
            </div>
            <Cinema
              v-if="
                hallStore.hallsById[hall.id]?.position_matrix &&
                hallStore.hallsById[hall.id].id == eventStore.form.default_hall
              "
              :cinema="hallStore.hallsById[hall.id].position_matrix ?? [[0]]"
              :squareSize="15"
              :height="240"
            />
          </template>
        </RadioGroup>
      </div>

      <!-- Submit Button -->
      <div class="text-left">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          ویرایش رویداد
        </button>
      </div>
      <!-- <StatusUi
        :message="A_create_mess"
        :error="A_create_error"
        :loading="patchEvent_load"
      /> -->
    </form>
  </div>
</template>
