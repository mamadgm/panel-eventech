<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useapi";
import { toast } from "vue-sonner";
import { Star } from "lucide-vue-next";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_BASE_URL } from "@/types/const";
import { useAuthStore } from "@/stores/auth";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// state
const onlineGuests = ref<Guest[]>([]);
const offlineGuests = ref<Guest[]>([]);
const originalGuests = ref<Guest[]>([]);
const errors = reactive<Record<string, string[]>>({});
const authStore = useAuthStore(); // get access to token

type Guest = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  ticket_number: string;
  is_vip?: boolean;
};

// route & API hooks
const route = useRoute();
const eventId = route.params.id as string;
const { data: apiData, fetchData } = useApi<Guest[]>(
  "GET",
  `/api/v0/guest/${eventId}/`
);

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
    toast.info("مهمان حذف شد");
    await fetchData(); // Refresh Guests
    onlineGuests.value = apiData.value || [];
    originalGuests.value = JSON.parse(JSON.stringify(apiData.value || [])); // deep clone
  } catch (error) {
    console.error("Failed to delete:", error);
    toast.error("حذف موفقیت‌آمیز نبود");
  }
};

const editedFlags = computed(() => {
  const originalMap = new Map<number, Guest>(
    originalGuests.value.map((g) => [g.id!, g])
  );

  return onlineGuests.value.map((g) => {
    const o = originalMap.get(g.id!);
    if (!o) return false;

    return (
      g.first_name !== o.first_name ||
      g.last_name !== o.last_name ||
      g.phone_number !== o.phone_number ||
      g.ticket_number !== o.ticket_number ||
      toBoolean(g.is_vip) !== toBoolean(o.is_vip)
    );
  });
});
// load online on mount
onMounted(async () => {
  await fetchData();
  onlineGuests.value = apiData.value || [];
  originalGuests.value = JSON.parse(JSON.stringify(apiData.value || [])); // deep clone
});

// re-validate whenever either list changes
watch([onlineGuests, offlineGuests], () => validateAll(), { deep: true });

// validation
function validateAll() {
  // clear
  for (const k in errors) delete errors[k];

  // collect tickets
  const entries: { ticket: string; key: string }[] = [];
  onlineGuests.value.forEach((g) => {
    entries.push({ ticket: g.ticket_number, key: `online-${g.id}` });
  });
  offlineGuests.value.forEach((g, i) => {
    entries.push({ ticket: g.ticket_number, key: `offline-${i}` });
  });

  // find duplicates
  const seen = new Map<string, string>();
  entries.forEach(({ ticket, key }) => {
    if (!ticket) return;
    if (seen.has(ticket)) {
      const other = seen.get(ticket)!;
      (errors[other] ??= []).push("شماره بلیط تکراری");
      (errors[key] ??= []).push("شماره بلیط تکراری");
    } else {
      seen.set(ticket, key);
    }
  });
}

// file upload handler
function onUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const wb = XLSX.read(reader.result as ArrayBuffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    offlineGuests.value = data.map((row) => ({
      first_name: row.first_name || "",
      last_name: row.last_name || "",
      phone_number: row.phone_number || "",
      ticket_number: String(row.ticket_number || ""),
      is_vip: !!row.is_vip,
    }));
  };
  reader.readAsArrayBuffer(file);
}
// State
const isSubmitting = ref(false);
const currentBatch = ref(0);
const totalBatches = ref(0);

// Util: Chunk array
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function submitAll() {
  if (Object.keys(errors).length) {
    toast.error("لطفاً خطاهای جدول را برطرف کنید");
    return;
  }

  const payload = [...offlineGuests.value];
  const chunks = chunkArray(payload, 10);

  isSubmitting.value = true;
  totalBatches.value = chunks.length;

  try {
    for (let i = 0; i < chunks.length; i++) {
      currentBatch.value = i + 1;

      await axios.post(
        `${API_BASE_URL}/api/v0/guest/${eventId}/create/`,
        chunks[i]
      );
    }

    toast.success("همه مهمانان با موفقیت ارسال شدند");
    // Reset
    await fetchData();
    offlineGuests.value = [];
  } catch (e: any) {
    const errMessage =
      e?.response?.data?.message || e?.message || "خطای ناشناخته";

    console.error("❌ ارسال شکست خورد در دسته:", currentBatch.value, e);
    toast.error(`ارسال شکست خورد در دسته ${currentBatch.value}: ${errMessage}`);
  } finally {
    isSubmitting.value = false;
    currentBatch.value = 0;
    totalBatches.value = 0;
  }
}

const toBoolean = (val: unknown): boolean => {
  if (typeof val === "string") {
    const v = val.trim().toLowerCase();
    return v === "vip" || v === "ویژه";
  }
  return val === true || val === 1;
};

// toggle VIP inline
function toggleVIP(g: Guest) {
  g.is_vip = !toBoolean(g.is_vip);
}

// edit: delete then re-create

async function editOnline(index: number) {
  const g = onlineGuests.value[index];

  const headers = {
    "Content-Type": "application/json",
    ...(authStore.access_token && {
      Authorization: `Bearer ${authStore.access_token}`,
    }),
  };

  try {
    await axios.delete(
      `${API_BASE_URL}/api/v0/guest/${eventId}/${g.id}/delete/`,
      { headers }
    );

    await axios.post(
      `${API_BASE_URL}/api/v0/guest/${eventId}/create/`,
      {
        first_name: g.first_name,
        last_name: g.last_name,
        phone_number: g.phone_number,
        ticket_number: g.ticket_number,
        is_vip: toBoolean(g.is_vip) ? "ویژه" : "",
      },
      { headers }
    );

    toast.success("ویرایش با موفقیت انجام شد");

    await fetchData();
    onlineGuests.value = apiData.value || [];
    originalGuests.value = JSON.parse(JSON.stringify(apiData.value || []));
  } catch (e: any) {
    console.error(e);
    toast.error("ویرایش موفقیت‌آمیز نبود");
  }
}
</script>

<template>
  <div class="space-y-6 p-6 bg-gray-50">
    <!-- File Upload -->
    <div class="flex items-center gap-4">
      <Label
        for="file-upload"
        class="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
      >
        انتخاب فایل اکسل
      </Label>
      <a
        href="/example.xlsx"
        download
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
      >
        📥 دانلود فایل اکسل
      </a>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx, .xls"
        class="hidden"
        @change="onUpload"
      />
      <span v-if="offlineGuests.length" class="text-xl font-bold text-gray-600">
        {{ offlineGuests.length }} ردیف آماده بررسی و ارسال
      </span>

      <div class="text-right">
        <Button
          :disabled="Object.keys(errors).length > 0 || !offlineGuests.length"
          @click="submitAll"
        >
          ارسال مهمانان
        </Button>
      </div>
      <!-- Simple Loading Dialog -->
      <div
        v-if="isSubmitting"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
          <h2 class="text-lg font-bold text-gray-800 mb-2">
            در حال ارسال مهمانان...
          </h2>
          <p class="text-sm text-gray-600 mb-4">
            لطفاً منتظر بمانید. در حال ارسال دسته {{ currentBatch }} از
            {{ totalBatches }}.
          </p>
          <button
            class="bg-gray-300 text-gray-500 text-sm px-4 py-2 rounded cursor-not-allowed"
            disabled
          >
            در حال پردازش...
          </button>
        </div>
      </div>

      <span
        v-if="Object.keys(errors).length > 0"
        class="text-[18px] font-bold text-red-600"
      >
        {{ Object.keys(errors).length / 2 }} بلیط تکراری داریم
      </span>
    </div>

    <!-- Offline Guests -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold text-gray-700 mb-2">
        مهمانان جدید برای ارسال
      </h2>
      <Table class="min-w-full bg-white rounded-lg shadow" dir="rtl">
        <TableBody class="bg-gray-200">
          <TableRow>
            <TableCell class="cells">نام</TableCell>
            <TableCell class="cells">نام خانوادگی</TableCell>
            <TableCell class="cells">موبایل</TableCell>
            <TableCell class="cells">شماره بلیط</TableCell>
            <TableCell class="cells">نوع بلیط</TableCell>
            <TableCell class="cells">اقدامات</TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          <TableRow
            v-for="(g, i) in offlineGuests"
            :key="i"
            :class="errors[`offline-${i}`]?.length ? 'bg-red-50' : ''"
          >
            <TableCell class="cells w-1/5">
              <Input v-model="g.first_name" placeholder="نام" size="lg" />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input
                v-model="g.last_name"
                placeholder="نام خانوادگی"
                size="sm"
              />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input v-model="g.phone_number" placeholder="موبایل" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input
                v-model="g.ticket_number"
                placeholder="شماره بلیط"
                size="sm"
              />
              <div
                v-if="errors[`offline-${i}`]"
                class="text-red-600 text-xs mt-1"
              >
                {{ errors[`offline-${i}`].join(", ") }}
              </div>
            </TableCell>
            <TableCell class="cells text-center">
              <span
                @click="g.is_vip = !toBoolean(g.is_vip)"
                class="w-18 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold cursor-pointer select-none transition-colors"
                :class="
                  toBoolean(g.is_vip)
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
                role="button"
                tabindex="0"
                @keydown.enter="g.is_vip = !toBoolean(g.is_vip)"
              >
                <Star class="w-4 h-4 ml-1" />
                {{ toBoolean(g.is_vip) ? "ویژه" : "عادی" }}
              </span>
            </TableCell>
            <TableCell class="cells w-1/6">
              <Button
                variant="destructive"
                size="sm"
                @click="offlineGuests.splice(i, 1)"
              >
                حذف
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <!-- Online Guests -->
    <!-- Online Guests -->
    <div>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">
        مهمانان قبلی و ثبت شده
      </h2>
      <Table class="min-w-full bg-white rounded-lg shadow" dir="rtl">
        <!-- Header Row -->
        <TableBody class="bg-gray-200">
          <TableRow>
            <TableCell class="cells">نام</TableCell>
            <TableCell class="cells">نام خانوادگی</TableCell>
            <TableCell class="cells">موبایل</TableCell>
            <TableCell class="cells">شماره بلیط</TableCell>
            <TableCell class="cells">نوع بلیط</TableCell>
            <TableCell class="cells">اقدامات</TableCell>
          </TableRow>
        </TableBody>

        <!-- Editable Body -->
        <TableBody>
          <TableRow
            v-for="(g, i) in onlineGuests"
            :key="g.id"
            :class="errors[`online-${g.id}`]?.length ? 'bg-red-50' : ''"
          >
            <!-- Editable fields -->
            <TableCell class="cells w-1/6">
              <Input v-model="g.first_name" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/6">
              <Input v-model="g.last_name" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/6">
              <Input v-model="g.phone_number" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/6">
              <Input v-model="g.ticket_number" size="sm" />
              <div
                v-if="errors[`online-${g.id}`]"
                class="text-red-600 text-xs mt-1"
              >
                {{ errors[`online-${g.id}`].join(", ") }}
              </div>
            </TableCell>
            <TableCell class="cells text-center w-1/6">
              <span
                @click="toggleVIP(g)"
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold cursor-pointer select-none transition-colors"
                :class="
                  toBoolean(g.is_vip)
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                "
              >
                <Star class="w-4 h-4 ml-1" />
                {{ toBoolean(g.is_vip) ? "ویژه" : "عادی" }}
              </span>
            </TableCell>

            <TableCell class="cells w-1/6">
              <div class="flex gap-2 w-full">
                <Button
                  variant="destructive"
                  size="sm"
                  class="flex-1"
                  @click="deleteuserfromevent(g.id as number)"
                >
                  حذف
                </Button>

                <Button
                  v-if="editedFlags[i]"
                  variant="outline"
                  size="sm"
                  class="flex-1"
                  @click="editOnline(i)"
                >
                  ویرایش
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style scoped>
.cells {
  padding-left: calc(var(--spacing) * 12);
  border-style: var(--tw-border-style);
  border-width: 1px;
  border-color: cadetblue;
}
</style>
