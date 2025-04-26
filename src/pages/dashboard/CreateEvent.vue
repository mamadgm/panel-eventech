<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composables/useapi';
import DatePicker from 'vue3-persian-datetime-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Cinema from '@/components/Cinema.vue';
import type { Hall , Event } from '@/types/events';

// Refs for form fields and hall data
const event = ref<Event>({
  name: '',
  // image: 'example.png',
  start_acceptance: '',
  start_time: '',
  end_time: '',
  default_hall: 0,
  categories: [],
});

const halls = ref<Hall[]>([]); // List of halls
const { fetchData: fetchhalls, data, loading, error } = useApi<Hall[]>('GET', '/api/v0/hall/default/'); // Get halls via API
const { fetchData: fetchhall2, data : data_hall2, loading:loading_hall2, error:error2 } = useApi('GET', '/api/v0/hall/default/3/'); // Get halls via API
const positionMatrix = ref<number[][]>([]); // Reactive variable for the cinema prop

// Fetch halls on component mount
onMounted(async () => {
  await fetchhall2().then(() => {
    if (data_hall2.value && typeof data.value === "object") {
      const jsondata = data_hall2.value as { position_matrix: number[][]; };
      positionMatrix.value = jsondata.position_matrix;
      console.log(positionMatrix.value);
    } else {
      console.log(error.value);
    }
  });
  await fetchhalls();
  if (data.value) {
    halls.value = data.value;
  }

});

// Use composable for creating the event
const { fetchData: createEvent, data: eventData, error: eventError, loading: eventLoading } = useApi<Event>('POST', '/api/v0/core/');

// Handle form submission
const handleSubmit = async () => {
  try {
    const newEvent = {
      ...event.value,
      start_acceptance: event.value.start_acceptance || new Date().toISOString(),
      start_time: event.value.start_time || new Date().toISOString(),
      end_time: event.value.end_time || new Date().toISOString(),
    };

    // Send event creation request via composable
    await createEvent(newEvent);

    if (eventData.value) {
      console.log('Event created successfully', eventData.value);
      // Optionally redirect or notify the user
    }
  } catch (err: any) {
    console.error('Error creating event:', err);
    alert('Failed to create event. Please try again.');
  }
};

</script>

<template>
  <div class="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
    <h1 class="text-3xl font-bold text-right mb-6">ایجاد رویداد جدید</h1>
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
            <Cinema :cinema="positionMatrix" :squareSize="15" />
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
          ایجاد رویداد
        </button>
      </div>
    </form>
  </div>
</template>
