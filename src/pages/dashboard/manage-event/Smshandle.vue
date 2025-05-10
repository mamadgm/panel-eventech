<!-- src/pages/dashboard/SmsManagement.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "@/composables/useapi";
import StatusUi from "@/components/StatusUi.vue";
import DatePicker from "vue3-persian-datetime-picker";
import type { Scene, SceneList } from "@/types/events";
import type { SmsCreatePayload, SmsItem } from "@/types/events";
import { toast } from "vue-sonner";

// — route & eventId —
const route = useRoute();
const eventId = route.params.id as string;

// — Fetch existing SMS list —
const { fetchData: getSms, data: smsData, loading: smsLoading, error: smsError } = useApi<SmsItem[]>("GET", `/api/v0/sms-service/${eventId}/`);
const smsList = ref<SmsItem[]>([]);
const loadError = ref<string>("");

onMounted(async () => {
  await getSms();
  if (smsError.value) loadError.value = smsError.value;
  else if (smsData.value) smsList.value = smsData.value;
});

// — Scenes API (for scene-based conditions) —
const { fetchData: getScenes, data: sceneData, loading: scenesLoading, error: scenesError } = useApi<SceneList>("GET", `/api/v0/scenes/${eventId}`);

// — Create SMS API —
const { fetchData: postSms, loading: postLoading, error: postError } = useApi<SmsCreatePayload>("POST", `/api/v0/sms-service/${eventId}/create/`);

// — Form state —
const showForm = ref(false);
const form = ref<SmsCreatePayload>({
  event: +eventId,
  title: "",
  text: "",
  condition_send: 0,
  is_vip: null,
  in_hall: null,
  scenes: [],
  guests: [],
  datetime_send: "", // will only be sent when condition_send === 1
});

// — When user picks a scene-based condition, load scenes —
watch(
  () => form.value.condition_send,
  async (cond) => {
    if ([4, 5, 6].includes(cond)) {
      await getScenes();
    } else {
      form.value.scenes = [];
    }
  }
);

// — Submit handler —
const submitSms = async () => {
  if (!form.value.title || !form.value.text) {
    return toast("عنوان و متن پیامک را پر کنید");
  }

  // 1️⃣ Clone the form
  const payload = { ...form.value };

  // 2️⃣ If scene-based, drop datetime_send
  if ([4, 5, 6].includes(payload.condition_send)) {
    delete (payload as any).datetime_send;
  }

  // 2.5️⃣ If datetime_send is an empty string, drop it too
  if (payload.datetime_send === "") {
    delete (payload as any).datetime_send;
  }

  // 3️⃣ Remove any keys whose value is null
  Object.entries(payload).forEach(([key, val]) => {
    if (val === null) {
      delete (payload as any)[key];
    }
  });

  // 4️⃣ Finally send
  await postSms(payload);
  if (postError.value) {
    toast("خطا در ایجاد پیامک: " + postError.value);
  } else {
    await getSms();
    smsList.value = smsData.value || [];
    showForm.value = false;
    // reset form
    form.value = {
      event: +eventId,
      title: "",
      text: "",
      datetime_send: "",
      condition_send: 0,
      is_vip: null,
      in_hall: null,
      scenes: [],
      guests: [],
    };
  }
};

// — Persian datetime formatting helper —
const formatFa = (val: string) => {
  const timeOnly = /^\d{2}:\d{2}:\d{2}$/.test(val);
  if (timeOnly) {
    const [h, m] = val.split(":");
    return `${h}:${m}`;
  }
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(val));
  } catch {
    return val;
  }
};

const deleteSms = async (id: number) => {
  const {
    data: delete_data,
    error: error_data,
    loading: loading_data,
    fetchData: deleteOper,
  } = useApi("DELETE", `/api/v0/sms-service/${eventId}/${id}/delete/`);

  try {
    await deleteOper();
    toast("پیامک پاک شد");
    await getSms();
    if (smsError.value) loadError.value = smsError.value;
    else if (smsData.value) smsList.value = smsData.value;
  } catch (error) {
    toast("مشکلی پیش آمد");
  }
};
</script>

<template>
  <!-- Status bar for loading/errors -->
  <StatusUi message="" :error="loadError" :loading="smsLoading" />

  <!-- Toggle form -->
  <button class="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="showForm = !showForm">
    {{ showForm ? "لغو" : "ایجاد پیامک جدید" }}
  </button>

  <!-- Create SMS Form -->
  <div v-if="showForm" class="border rounded-lg p-4 bg-white shadow mb-6 space-y-4">
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Title -->
      <div>
        <label class="block font-medium">عنوان</label>
        <input v-model="form.title" type="text" class="w-full border rounded px-2 py-1" />
      </div>

      <!-- Text -->
      <div>
        <label class="block font-medium">متن</label>
        <textarea v-model="form.text" class="w-full border rounded px-2 py-1" rows="3" />
      </div>

      <!-- Send Condition -->
      <div>
        <label class="block font-medium">شرط ارسال</label>
        <select v-model.number="form.condition_send" class="w-full border rounded px-2 py-1">
          <option :value="0">در لحظه</option>
          <!-- <option :value="1">در زمان معین</option> -->
          <option :value="2">در صورت حضور به موقع</option>
          <option :value="3">در صورت دیر رسیدن</option>
          <option :value="4">شروع سین</option>
          <!-- <option :value="5">حین اجرای سین</option> -->
          <option :value="6">پایان سین</option>
        </select>
      </div>

      <!-- Date/Time Picker (only for condition 1) -->
      <div v-if="form.condition_send === 1">
        <label class="block font-medium">زمان ارسال</label>
        <DatePicker v-model="form.datetime_send" type="datetime" format="YYYY-MM-DD HH:mm:00" displayFormat="HH:mm:00 jYYYY-jMM-jDD" class="w-full" />
      </div>

      <!-- VIP Filter: None / Normal / VIP -->
      <div>
        <label class="block font-medium">فیلتر VIP</label>
        <select v-model="form.is_vip" class="w-full border rounded px-2 py-1">
          <option :value="null">همه مهمانان</option>
          <option :value="false">مهمانان عادی</option>
          <option :value="true">فقط VIP</option>
        </select>
      </div>

      <!-- In-Hall Filter: None / Outside / In-Hall -->
      <div>
        <label class="block font-medium">فیلتر در سالن</label>
        <select v-model="form.in_hall" class="w-full border rounded px-2 py-1">
          <option :value="null">همه مهمانان</option>
          <option :value="false">خارج سالن</option>
          <option :value="true">فقط داخل سالن</option>
        </select>
      </div>
    </div>

    <!-- Scene Selection for conditions 4,5,6 -->
    <div v-if="[4, 5, 6].includes(form.condition_send)" class="mt-4">
      <h4 class="font-medium mb-2">انتخاب سکانس‌ها</h4>
      <StatusUi message="" :error="scenesError ?? undefined" :loading="scenesLoading" />
      <div v-if="sceneData" class="space-y-2 max-h-48 overflow-auto">
        <label v-for="scene in sceneData" :key="scene.id" class="flex items-center gap-2">
          <input type="checkbox" :value="scene.id" v-model="form.scenes" />
          <span>
            {{ scene.name }}
            ({{ formatFa(scene.start_time) }} → {{ formatFa(scene.end_time) }})
          </span>
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <button class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" :disabled="postLoading" @click="submitSms">ذخیره پیامک</button>
  </div>

  <!-- Existing SMS List -->
  <div class="grid grid-cols-2 gap-4">
    <div v-for="sms in smsList" :key="sms.id" class="border rounded-lg bg-white shadow p-6 w-full space-y-3">
      <!-- Title and Main Text -->
      <div>
        <h3 class="text-lg font-bold text-gray-800">{{ sms.title }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ sms.text }}</p>
      </div>

      <!-- Conditional Info Section -->
      <ul class="text-sm text-gray-700 space-y-1">
        <!-- Show send time if available -->
        <li v-if="sms.datetime_send"><strong>ارسال:</strong> {{ formatFa(sms.datetime_send) }}</li>

        <!-- VIP and hall status, shown together only if datetime is null -->
        <template v-else>
          <li><strong>وضعیت مهمانان:</strong> {{ sms.is_vip_str }}</li>
          <li><strong>وضعیت سالن:</strong> {{ sms.in_hall_str }}</li>
        </template>

        <!-- Show scenes only if present -->
        <li v-if="sms.scenes.length">
          <strong>سکانس‌ها:</strong>
          <span>
            <template v-for="(sceneId, idx) in sms.scenes"> {{ sceneId }}<span v-if="idx < sms.scenes.length - 1">، </span> </template>
          </span>
        </li>

        <!-- Always show condition -->
        <li><strong>شرط:</strong> {{ sms.condition_send_str }}</li>

        <!-- Always show cost -->
        <li><strong>هزینه:</strong> {{ sms.cost }} تومان</li>

        <!-- Status with badge -->
        <li>
          <strong>وضعیت:</strong>
          <span :class="sms.status ? 'text-green-700 bg-green-100 px-2 py-0.5 rounded' : 'text-red-700 bg-red-100 px-2 py-0.5 rounded'">
            {{ sms.status ? "ارسال شده" : "ارسال نشده" }}
          </span>
        </li>
      </ul>
      <!-- Delete button -->
      <div class="mt-4">
        <button
          @click="deleteSms(sms.id)"
          class="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          حذف
        </button>
      </div>
    </div>
  </div>
</template>

<style setup>
/* ensure the DatePicker fills width in its container */
.vue3-persian-datetime-picker {
  width: 100%;
}
</style>
