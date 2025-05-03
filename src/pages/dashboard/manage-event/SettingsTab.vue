<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import DatePicker from 'vue3-persian-datetime-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Cinema from '@/components/Cinema.vue';
import { Toaster } from '@/components/ui/sonner';
import type { Hall, Event } from '@/types/events';
import StatusUi from '@/components/StatusUi.vue';

const route = useRoute();
const eventId = route.params.id;
const event = ref<Event>({
  name: '',
  start_acceptance: '',
  start_time: '',
  end_time: '',
  default_hall: 0,
  categories: [],
});

const halls = ref<Hall[]>([]);
const positionMatrix = ref<number[][]>([]);

// Fetch existing event
const { fetchData: getEvent, data: eventData } = useApi<Event>('GET', `/api/v0/core/${eventId}`);
const { fetchData: patchEvent  , error : patchEvent_error , loading : patchEvent_load , data : patchEvent_data} = useApi<Event>('PATCH', `/api/v0/core/${eventId}/`);
const { fetchData: fetchHalls, data: hallsData } = useApi<Hall[]>('GET', '/api/v0/hall/default/');
const { fetchData: fetchSingleHall, data: singleHallData } = useApi('GET', `/api/v0/hall/default/3/`);

onMounted(async () => {
  await getEvent();
  if (eventData.value) {
    event.value = eventData.value;
  }

  await fetchSingleHall().then(() => {
    const json = singleHallData.value as { position_matrix: number[][] };
    positionMatrix.value = json.position_matrix;
  });

  await fetchHalls();
  if (hallsData.value) {
    halls.value = hallsData.value;
  }
});



const A_create_mess = ref('');
const A_create_error = ref('');
const handleSubmit = async () => {
  A_create_error.value = '';
  A_create_mess.value = '';
  await patchEvent(event.value);

  if (patchEvent_error.value) {
    A_create_error.value = patchEvent_error.value;
  } else if (patchEvent_data.value) {
    A_create_mess.value = 'رویداد ویرایش شد';
  } else {
    A_create_error.value = 'خطای غیرمنتظره‌ای رخ داد';
  }

};
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
    <h1 class="text-3xl font-bold text-right mb-6">ویرایش رویداد</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6 text-right">
      <!-- Event Name -->
      <div>
        <label for="name" class="block mb-1 text-sm font-medium text-gray-700">نام رویداد</label>
        <input v-model="event.name" type="text" id="name" placeholder="نام رویداد"
          class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Event Date-Time Pickers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="start_acceptance" class="block mb-1 text-sm font-medium text-gray-700">شروع پذیرش</label>
          <DatePicker v-model="event.start_acceptance" type="datetime" format="YYYY-MM-DD HH:mm:ss"
            displayFormat="HH:mm:ss jYYYY-jMM-jDD" class="w-full" />
        </div>
        <div>
          <label for="start_time" class="block mb-1 text-sm font-medium text-gray-700">زمان شروع</label>
          <DatePicker v-model="event.start_time" type="datetime" format="YYYY-MM-DD HH:mm:ss"
            displayFormat="HH:mm:ss jYYYY-jMM-jDD" class="w-full" />
        </div>
        <div>
          <label for="end_time" class="block mb-1 text-sm font-medium text-gray-700">زمان پایان</label>
          <DatePicker v-model="event.end_time" type="datetime" format="YYYY-MM-DD HH:mm:ss"
            displayFormat="HH:mm:ss jYYYY-jMM-jDD" class="w-full" />
        </div>
      </div>

      <!-- Select Hall -->
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700">محل برگزاری</label>
        <RadioGroup v-model="event.default_hall" class="space-y-3">
          <template v-for="hall in halls" :key="hall.id">
            <div class="flex items-center gap-2">
              <RadioGroupItem :value="hall.id" :id="`hall-${hall.id}`" class="form-radio text-blue-600" />
              <label :for="`hall-${hall.id}`" class="text-sm text-gray-800">
                {{ hall.name }} - {{ hall.address }}
              </label>
            </div>
            <Cinema :cinema="positionMatrix" :squareSize="15" :height="240"/>
          </template>
        </RadioGroup>
      </div>

      <!-- Categories -->
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-700">دسته‌بندی‌ها</label>
        <div class="flex flex-col space-y-2">
          <label class="inline-flex items-center">
            <input type="checkbox" value="دسته اول" v-model="event.categories" class="form-checkbox text-blue-600" />
            <span class="ml-2">دسته اول</span>
          </label>
          <label class="inline-flex items-center">
            <input type="checkbox" value="دسته دوم" v-model="event.categories" class="form-checkbox text-blue-600" />
            <span class="ml-2">دسته دوم</span>
          </label>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-left">
        <button type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
          ویرایش رویداد
        </button>
      </div>
      <StatusUi :message="A_create_mess" :error="A_create_error" :loading="patchEvent_load" />
    </form>
  </div>
</template>
