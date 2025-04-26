<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import { nextTick } from 'vue';
import type { Guest, GuestData } from '@/types/events';


const route = useRoute();
const eventId = route.params.id as string

// Excel File Handling
const excelFile = ref<File | null>(null);

// Add these to manage user messages
const successMessage = ref('');
const errorMessage = ref('');

const jsonData = ref<Guest[]>([]);
const { data: apiData, error, loading, fetchData } = useApi<GuestData[]>("GET", `/api/v0/guest/${eventId}/`);
const { data: postData, error: postError, loading: postLoading, fetchData: postFetch } = useApi<GuestData>("POST", `/api/v0/guest/${eventId}/create/`);

// Table Configuration
const columns = {
  username: 'کاربر',
  phone_number: 'شماره تلفن',
  ticket_number: 'شماره بلیط',
  status: 'وضعیت',
  contacts: 'روابط',
  actions: 'اقدامات',
};

const filters = ref('');

// Data Transformation
const users = computed(() => {
  const sourceData = apiData.value || [];
  return sourceData.map((item: any) => ({
    id: item.id || Math.random().toString(36).substring(2, 9),
    username: item.username || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
    position: item.position || (item.is_vip ? 'VIP' : 'عادی'),
    phone_number: item.phone_number || '',
    ticket_number: item.ticket_number || '',
    status: item.status || (item.is_vip ? 'VIP' : 'عادی'),
    picture: item.picture || '',
    initials: item.initials || (item.first_name?.[0] || '') + (item.last_name?.[0] || ''),
    color: item.color || (item.is_vip ? 'primary' : 'info'),
    contacts: item.contacts || [],
    location: item.location || '',
    industry: item.industry || '',
    badge: item.badge || (item.is_vip ? 'VIP' : undefined),
  }));
});

const filteredData = computed(() => {
  if (!filters.value) return users.value;
  const filterRe = new RegExp(filters.value, 'i');
  return users.value.filter((item: any) => {
    return (
      (item.username && item.username.match(filterRe)) ||
      (item.position && item.position.match(filterRe)) ||
      (item.phone_number && item.phone_number.match(filterRe)) ||
      (item.ticket_number && item.ticket_number.match(filterRe)) ||
      (item.status && item.status.match(filterRe)) ||
      (item.location && item.location.match(filterRe))
    );
  });
});

const submitEventData = async () => {
  // Ensure jsonData.value is not null before proceeding
  if (!jsonData.value || jsonData.value.length === 0) {
    errorMessage.value = '❌ هیچ داده‌ای برای ارسال وجود ندارد';
    successMessage.value = '';
    return;
  }

  try {
    // Send only valid data (not null)
    await postFetch(jsonData.value);

    if (postData.value) {
      console.log("POST response data:", postData.value);
      successMessage.value = '✅ مهمانان با موفقیت ثبت شدند';
      errorMessage.value = '';
    } else {
      console.log("POST Error:", postError.value);
      errorMessage.value = postError.value || '❌ خطا در ثبت مهمانان';
      successMessage.value = '';
    }
  } catch (err) {
    console.error("Unexpected error during POST request:", err);
    errorMessage.value = '❌ خطای غیرمنتظره‌ای رخ داد';
    successMessage.value = '';
  }
};



// API Data Loading
const load_data = async () => {
  await fetchData();
  if (error.value) {
    console.error('Error fetching events:', error.value);
  }
};

onMounted(async () => {
  await load_data();
});

const downloadPublicFile = () => {
  const link = document.createElement('a');
  link.href = '/example.xlsx'; // Changed to xlsx
  link.download = 'example.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    excelFile.value = target.files[0];
    jsonData.value = []; // Reset previous JSON data
  }
};

const convertToJson = () => {
  if (!excelFile.value) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target?.result;
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    // Ensure the transformed data matches the `Guest` type
    jsonData.value = excelData.map((item: any) => ({
      event: eventId, // Ensure this is a string
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      phone_number: item.phone_number
        ? item.phone_number.toString().length === 10
          ? '0' + item.phone_number.toString()
          : item.phone_number.toString()
        : '',
      email: item.email || '',
      ticket_number: item.ticket_number || '',
      ticket_registration_datetime: new Date().toISOString(),
      is_vip: item.is_vip === "TRUE" || item.is_vip === true,
    }));

    nextTick(() => {
      console.log("Data rendered in the DOM:", jsonData.value); // Check if data is reflected in DOM after update
    });
  };


  if (jsonData.value && jsonData.value.length > 0) {
    
    console.log(JSON.stringify(jsonData.value[0], null, 2)); // Pretty-print the object
  } else {
    console.log("jsonData is not populated yet");
  }



  reader.onerror = () => {
    alert('Error reading file');
  };

  reader.readAsArrayBuffer(excelFile.value);
};

const displayJson = computed(() => {
  if (!jsonData.value) return [];
  return jsonData.value.map(({ event, ticket_registration_datetime, ...rest }) => rest);
});


function deleteOfflineGuest(index: number) {
  if (jsonData.value && Array.isArray(jsonData.value)) {
    jsonData.value.splice(index, 1);
  }
}

function deleteApiGuest(index: number) {
  console.log('Deleting API guest at index:', index);
}



</script>

<template>
  <div>
    <!-- File Upload Section with Structured Buttons -->
    <div class="stepper-form">
      <div class="form-sections">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg">
          <div class="flex items-center gap-4">
            <!-- Download Sample Button -->
            <button @click="downloadPublicFile"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              دانلود نمونه فایل
            </button>

            <!-- File Upload Button -->
            <div class="relative inline-block">
              <label
                class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 shadow-sm transition">
                <i class="fas fa-cloud-upload-alt text-blue-500"></i>
                <span>انتخاب فایل اکسل</span>
                <input type="file" accept=".xlsx, .xls" @change="handleFileUpload"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </label>
              <span v-if="excelFile" class="block mt-2 text-xs text-gray-600 text-center">
                {{ excelFile.name }}
              </span>
            </div>

          </div>

          <div class="flex items-center gap-4">
            <!-- Convert to JSON Button -->
            <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              :disabled="!excelFile" @click="convertToJson">
              تبدیل به مهمان
            </button>

            <!-- Submit Button -->
            <button type="button" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              :disabled="!jsonData" @click="submitEventData">
              ارسال مهمانان
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success & Error messages -->
    <div v-if="successMessage" class="text-green-600 text-center mt-4 bg-green-100 p-2 rounded">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="text-red-600 text-center mt-4 bg-red-100 p-2 rounded">
      {{ errorMessage }}
    </div>

    <!-- Search Field -->
    <div class="mb-6">
      <input v-model="filters" class="p-2 border border-gray-300 rounded-lg w-full" type="text"
        placeholder="جستجو..." />
    </div>

<!-- Data Table for Fetched and Uploaded Guests -->
<div v-if="filteredData.length || displayJson.length" class="space-y-12 mt-8">

<!-- Offline Guests (from uploaded Excel) -->
<div v-if="jsonData.length > 0">
  <h2 class="text-lg font-bold text-gray-700 mb-4">مهمانان آفلاین (وارد شده از فایل اکسل)</h2>
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table class="min-w-full text-sm text-right text-gray-700 bg-white">
      <thead class="text-xs uppercase bg-yellow-200 text-gray-800">
        <tr>
          <th class="px-6 py-3">نام</th>
          <th class="px-6 py-3">شماره تلفن</th>
          <th class="px-6 py-3">شماره بلیط</th>
          <th class="px-6 py-3">اقدامات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in jsonData"
          :key="'json-' + item.phone_number + '-' + index"
          class="border-b last:border-0"
        >
          <td class="px-6 py-4">{{ item.first_name }} {{ item.last_name }}</td>
          <td class="px-6 py-4">{{ item.phone_number }}</td>
          <td class="px-6 py-4">{{ item.ticket_number }}</td>
          <td class="px-6 py-4">
            <button @click="deleteOfflineGuest(index)" class="text-red-500 hover:text-red-600">
              حذف
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Online Guests (fetched from API) -->
<div v-if="filteredData.length > 0">
  <h2 class="text-lg font-bold text-gray-700 mb-4">مهمانان آنلاین (دریافت شده از سرور)</h2>
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table class="min-w-full text-sm text-right text-gray-700 bg-white">
      <thead class="text-xs uppercase bg-green-300 text-gray-800">
        <tr>
          <th class="px-6 py-3">نام</th>
          <th class="px-6 py-3">شماره تلفن</th>
          <th class="px-6 py-3">شماره بلیط</th>
          <th class="px-6 py-3">اقدامات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in filteredData"
          :key="'api-' + item.id"
          class="border-b last:border-0"
        >
          <td class="px-6 py-4">{{ item.username }}</td>
          <td class="px-6 py-4">{{ item.phone_number }}</td>
          <td class="px-6 py-4">{{ item.ticket_number }}</td>
          <td class="px-6 py-4">
            <button @click="deleteApiGuest(item.id)" class="text-red-500 hover:text-red-600">
              حذف
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</div>


    <!-- Uploaded Guests Table with Different Background -->
    <div v-else>
      <div class="text-center">لطفاً فایل اکسل را بارگذاری و تبدیل کنید</div>
    </div>
  </div>
</template>


<style scoped>
input[type="file"] {
  display: none;
}
</style>
