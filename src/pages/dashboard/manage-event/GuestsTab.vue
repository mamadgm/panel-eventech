<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import { nextTick } from 'vue';
import StatusUi from '@/components/StatusUi.vue'
import type {ErrorResponse, Guest, GuestData } from '@/types/events';
import { toast } from 'vue-sonner';

const route = useRoute();
const eventId = route.params.id as string

const excelFile = ref<File | null>(null);

const jsonData = ref<Guest[]>([]);
const { data: apiData, error, loading, fetchData } = useApi<GuestData[]>("GET", `/api/v0/guest/${eventId}/`);
const { data: create_post_data, error: create_post_error, loading: create_post_loading, fetchData: create_post_api } = useApi<GuestData>("POST", `/api/v0/guest/${eventId}/create/`);
const { data: check_post_data, error: check_post_error, loading: check_post_loading, fetchData: check_post_api } = useApi<ErrorResponse>("POST", `/api/v0/guest/${eventId}/check/`);

//Delete Oper
const deleteuserfromevent = async (id: number) => {
  const {
    data: delete_data,
    error: error_data,
    loading: loading_data,
    fetchData: deleteuser,
  } = useApi("DELETE", `/api/v0/guest/${eventId}/${id}/delete/`);

  try {
    await deleteuser();
    console.log("Deleted!");
    await load_data(); // Refresh Guests
  } catch (error) {
    console.error("Failed to delete:", error);
  }
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

const A_create_mess = ref('');
const A_create_error = ref('');
const submitEventData = async () => {
  if (!jsonData.value || jsonData.value.length === 0) {
    A_create_error.value = 'هیچ داده‌ای برای ارسال وجود ندارد';
    A_create_mess.value = '';
    return;
  }

  A_create_mess.value = '';
  A_create_error.value = '';

  await create_post_api(jsonData.value); // Only call fetch

  if (create_post_error.value) {
    A_create_error.value = create_post_error.value;
  } else if (create_post_data.value) {
    A_create_mess.value = 'مهمانان با موفقیت ثبت شدند';
    await load_data(); // Refresh Guests
  } else {
    A_create_error.value = 'خطای غیرمنتظره‌ای رخ داد';
  }
};

const rowErrors = ref<any[]>([]);  // Declare rowErrors as a ref
const A_check_mess = ref('');
const A_check_error = ref('');
const CheckGuests = async () => {
  if (!jsonData.value || jsonData.value.length === 0) {
    A_check_error.value = 'هیچ داده‌ای برای ارسال وجود ندارد';
    A_check_mess.value = '';
    return;
  }

  A_check_mess.value = '';
  A_check_error.value = '';
  rowErrors.value = [];

  await check_post_api(jsonData.value);

  if (check_post_error.value) {
    const data = check_post_data.value;

    // Case 1: it's an array of objects (e.g. [{non_field_errors: [...]}, {}, ...])
    if (Array.isArray(data)) {
      toast("تکرار داده های ارسالی" , {
        description: 'در داده های ارسالی جدید شما مشکل است',
      })
      const allErrors: string[] = [];

      for (const item of data) {
        if (
          item &&
          typeof item === 'object' &&
          Array.isArray(item.non_field_errors)
        ) {
          allErrors.push(...item.non_field_errors);
        }
      }

      if (allErrors.length) {
        rowErrors.value = allErrors;
        console.log('Extracted errors from array format:', allErrors);
        return;
      }
    }

    // Case 2: it's a single object with non_field_errors
    if (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.non_field_errors)
    ) {
      toast("تکرار داده های دیتابیس" , {
        description: 'در داده های ارسالی جدید شما با قبلی مشکل است',
      })
      rowErrors.value = data.non_field_errors;
      console.log('Extracted errors from single object:', rowErrors.value);
      return;
    }

    // If neither worked:
    console.error('No valid non_field_errors found in expected formats', data);
    A_check_error.value = 'خطای ناشناخته‌ای رخ داد در بررسی مهمانان';
  } else if (check_post_data.value) {
    A_check_mess.value = 'مهمانان چک شدند ✅';
  } else {
    A_check_error.value = 'خطای غیرمنتظره‌ای رخ داد';
  }
};



// API Data Loading
const load_data = async () => {
  await fetchData();
  if (error.value) {
    console.error('Error fetching Guests');
  }
};

onMounted(async () => {
  await load_data();
});

const downloadPublicFile = () => {
  const link = document.createElement('a');
  link.href = '/example.xlsx';
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
  rowErrors.value = [];
  if (jsonData.value && Array.isArray(jsonData.value)) {
    jsonData.value.splice(index, 1);
  }
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
            <!-- Submit Button -->
            <button type="button" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-green-700 transition"
              :disabled="!jsonData" @click="CheckGuests">
              چک کردن مهمانان
            </button>
          </div>
        </div>
      </div>
    </div>
    <StatusUi :message="A_create_mess" :error="A_create_error" :loading="create_post_loading" />
    <StatusUi :message="A_check_mess" :error="A_check_error" :loading="check_post_loading" />
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
                <th class="px-6 py-3">وضعیت</th>
                
                <th class="px-6 py-3">اقدامات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in jsonData" :key="'json-' + item.phone_number + '-' + index"
                :class="['border-b last:border-0', rowErrors[index] && rowErrors[index].length > 2 ? 'bg-red-50' : '']">
                <td class="px-6 py-4">{{ item.first_name }} {{ item.last_name }}</td>
                <td class="px-6 py-4">{{ item.phone_number }}</td>
                <td class="px-6 py-4">{{ item.ticket_number }}</td>
                <td class="px-6 py-4">{{ item.is_vip }}</td>
                <!-- <td class="px-6 py-4">{{ item.ticket_registration_datetime }}</td> -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-2">
                    <button @click="deleteOfflineGuest(index)" class="text-red-500 hover:text-red-600">
                      حذف
                    </button>
                    <div v-if="rowErrors[index] && Object.keys(rowErrors[index]).length > 0"
                      class="text-red-600 text-xs mt-1">
                      {{ rowErrors[index] }}
                    </div>
                  </div>
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
                <th class="px-6 py-3">وضعیت</th>
                <!-- <th class="px-6 py-3">وضعیت</th> -->
                <th class="px-6 py-3">اقدامات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredData" :key="'api-' + item.id" class="border-b last:border-0">
                <td class="px-6 py-4">{{ item.username }}</td>
                <td class="px-6 py-4">{{ item.phone_number }}</td>
                <td class="px-6 py-4">{{ item.ticket_number }}</td>
                <td class="px-6 py-4">{{ item.status }}</td>
                <!-- <td class="px-6 py-4">{{ item.username }}</td> -->
                <td class="px-6 py-4">
                  <button @click="deleteuserfromevent(item.id)" class="text-red-500 hover:text-red-600">
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
