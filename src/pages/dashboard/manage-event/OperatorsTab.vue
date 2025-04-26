<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import type { OperatorDataGET , OperatorData } from '@/types/oper';

const route = useRoute();
const eventId = parseInt(route.params.id as string);
const postSuccessMessage = ref('');
const postErrorMessage = ref('');
const deleteSuccessMessage = ref('');
const deleteErrorMessage = ref('');

// Operator data form
const persondata = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: ''
});
//Delete Oper
const deleteOperOfEvent = async (id: number) => {
  const { data: delete_data, error: error_data, loading: loading_data, fetchData: deleteOper } = useApi<OperatorDataGET[]>(
    'DELETE',
    `/api/v0/operators/${eventId}/${id}/delete/`
  );

  try {
    await deleteOper();
    console.log('Deleted!');
    await load_data(); // Refresh operators
  } catch (error) {
    console.error('Failed to delete:', error);
  }
};


// Fetch Operators
const { data, error, loading, fetchData } = useApi<OperatorDataGET[]>(
  'GET',
  `/api/v0/operators/${eventId}/`,
);

// Submit POST request to create operator
const { data: postData, error: postError, loading: postLoading, fetchData: postFetch } = useApi<OperatorData>(
  'POST',
  `/api/v0/operators/${eventId}/create/`,
);




// Submit operator data
const submitNewOper = async () => {
  const PostBody: OperatorData = {
    first_name: persondata.value.firstName,
    last_name: persondata.value.lastName,
    phone_number: persondata.value.phone,
    email: persondata.value.email,
    password: persondata.value.password,
    password_confirm: persondata.value.password
  };

  postSuccessMessage.value = '';
  postErrorMessage.value = '';

  try {
    await postFetch(PostBody);
    if (postData.value) {
      postSuccessMessage.value = 'اپراتور با موفقیت ثبت شد ✅';
      persondata.value = { firstName: '', lastName: '', phone: '', email: '', password: '' }; // Reset form
      await load_data(); // Reload operators list
    } else {
      postErrorMessage.value = postError.value || 'خطا در ثبت اطلاعات';
    }
  } catch (err) {
    console.error("Unexpected error during POST:", err);
    postErrorMessage.value = err instanceof Error ? err.message : 'خطای غیرمنتظره‌ای رخ داد';
  }
};

// Load operators data
const load_data = async () => {
  await fetchData();
  if (error.value) {
    console.error('Error fetching operators:', error.value);
  } else {
    console.log(data.value);
  }
};

onMounted(() => {
  load_data();
});
</script>

<template>
  <form @submit.prevent="submitNewOper" class="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-right">اضافه کردن اپراتور</h2>

    <!-- Success and Error Messages -->
    <div v-if="postSuccessMessage" class="bg-green-100 text-green-800 p-4 rounded mb-4 border border-green-300">
      {{ postSuccessMessage }}
    </div>
    <div v-if="postErrorMessage" class="bg-red-100 text-red-800 p-4 rounded mb-4 border border-red-300">
      {{ postErrorMessage }}
    </div>

    <!-- Operator Form Fields -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">نام</label>
        <input v-model="persondata.firstName" type="text" class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="نام" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">نام خانوادگی</label>
        <input v-model="persondata.lastName" type="text" class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="نام خانوادگی" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">شماره تلفن</label>
        <input v-model="persondata.phone" type="tel" class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="09123456789" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">ایمیل</label>
        <input v-model="persondata.email" type="email" class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="ایمیل" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">رمز عبور</label>
        <input v-model="persondata.password" type="password" class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="رمز عبور" />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md mt-4">
        افزودن اپراتور
      </button>
    </div>
  </form>

  <!-- Operators List -->
  <div class="mt-8 max-w-4xl mx-auto">
    <h3 class="text-xl font-bold mb-4 text-right">اپراتورهای موجود</h3>
    <div v-if="deleteSuccessMessage" class="bg-green-100 text-green-800 p-4 rounded mb-4 border border-green-300">
      {{ deleteSuccessMessage }}
    </div>
    <div v-if="deleteErrorMessage" class="bg-red-100 text-red-800 p-4 rounded mb-4 border border-red-300">
      {{ deleteErrorMessage }}
    </div>

    <div v-if="loading" class="text-center py-8">در حال بارگذاری...</div>
    <div v-if="error" class="text-red-500 text-center py-8">خطا در دریافت اطلاعات: {{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="operator in data" :key="operator.id" class="bg-white shadow-md p-4 rounded-md">
        <h4 class="font-semibold text-lg">{{ operator.first_name }} {{ operator.last_name }}</h4>
        <p class="text-gray-600"><span class="font-medium">تلفن:</span> {{ operator.phone_number }}</p>
        <p class="text-gray-600"><span class="font-medium">ایمیل:</span> {{ operator.email || 'ندارد' }}</p>
        <div class="mt-4">
          <button @click="deleteOperOfEvent(operator.id)" class="bg-red-600 text-white py-1 px-3 rounded-md">
            حذف اپراتور
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
