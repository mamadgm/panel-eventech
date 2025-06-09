<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import * as XLSX from 'xlsx';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import { toast } from 'vue-sonner';
import { Star } from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';

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
const { data: apiData, fetchData } = useApi<Guest[]>('GET', `/api/v0/guest/${eventId}/`);
const { fetchData: createGuests } = useApi<Guest[]>('POST', `/api/v0/guest/${eventId}/create/`);

// state
const onlineGuests = ref<Guest[]>([]);
const offlineGuests = ref<Guest[]>([]);
const errors = reactive<Record<string, string[]>>({});

// load online on mount
onMounted(async () => {
  await fetchData();
  onlineGuests.value = apiData.value || [];
});

// re-validate whenever either list changes
watch(
  [onlineGuests, offlineGuests],
  () => validateAll(),
  { deep: true }
);

// validation
function validateAll() {
  // clear
  for (const k in errors) delete errors[k];

  // collect tickets
  const entries: { ticket: string; key: string }[] = [];
  onlineGuests.value.forEach(g => {
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
      (errors[other] ??= []).push('شماره بلیط تکراری');
      (errors[key] ??= []).push('شماره بلیط تکراری');
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
    const wb = XLSX.read(reader.result as ArrayBuffer, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    offlineGuests.value = data.map((row) => ({
      first_name: row.first_name || '',
      last_name: row.last_name || '',
      phone_number: row.phone_number || '',
      ticket_number: String(row.ticket_number || ''),
      is_vip: !!row.is_vip,
    }));

  };
  reader.readAsArrayBuffer(file);
}

// delete online
function delOnline(id?: number) {
  onlineGuests.value = onlineGuests.value.filter(g => g.id !== id);
}

// submit combined
async function submitAll() {
  if (Object.keys(errors).length) {
    toast.error('لطفاً خطاهای جدول را برطرف کنید');
    return;
  }
  const payload = [...onlineGuests.value, ...offlineGuests.value];
  try {
    await createGuests(payload);
    toast.success('مهمانان با موفقیت ارسال شدند');
    // optionally refresh
    await fetchData();
    onlineGuests.value = apiData.value || [];
    offlineGuests.value = [];
  } catch {
    toast.error('ارسال مهمانان ناموفق بود');
  }
}

const toBoolean = (val: unknown): boolean => {
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    return v === 'vip' || v === 'ویژه';
  }
  return val === true || val === 1;
};


</script>

<template>
  <div class="space-y-6 p-6 bg-gray-50">
    <!-- File Upload -->
    <div class="flex items-center gap-4">
      <Label for="file-upload"
        class="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
        انتخاب فایل اکسل
      </Label>
      <input id="file-upload" type="file" accept=".xlsx, .xls" class="hidden" @change="onUpload" />
      <span v-if="offlineGuests.length" class="text-xs text-gray-600">
        {{ offlineGuests.length }} ردیف آماده بررسی
      </span>
    </div>



    <!-- Offline Guests -->
    <div class="mt-8">
      <h2 class="text-lg font-bold text-gray-700 mb-2">مهمانان آفلاین</h2>
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
          <TableRow v-for="(g, i) in offlineGuests" :key="i" :class="errors[`offline-${i}`]?.length ? 'bg-red-50' : ''">
            <TableCell class="cells w-1/5">
              <Input v-model="g.first_name" placeholder="نام" size="lg" />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input v-model="g.last_name" placeholder="نام خانوادگی" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input v-model="g.phone_number" placeholder="موبایل" size="sm" />
            </TableCell>
            <TableCell class="cells w-1/5">
              <Input v-model="g.ticket_number" placeholder="شماره بلیط" size="sm" />
              <div v-if="errors[`offline-${i}`]" class="text-red-600 text-xs mt-1">
                {{ errors[`offline-${i}`].join(', ') }}
              </div>
            </TableCell>
            <TableCell class="cells text-center">
              <span @click="g.is_vip = !toBoolean(g.is_vip)"
                class="w-18 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold cursor-pointer select-none transition-colors"
                :class="toBoolean(g.is_vip) ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                role="button" tabindex="0" @keydown.enter="g.is_vip = !toBoolean(g.is_vip)">
                <Star class="w-4 h-4 ml-1" />
                {{ toBoolean(g.is_vip) ? 'ویژه' : 'عادی' }}
              </span>
            </TableCell>
            <TableCell class="cells w-1/6">
              <Button variant="destructive" size="sm" @click="offlineGuests.splice(i, 1)">
                حذف
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <!-- Online Guests -->
    <div>
      <h2 class="text-lg font-bold text-gray-700 mb-2">مهمانان آنلاین</h2>
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
          <TableRow v-for="g in onlineGuests" :key="g.id" :class="errors[`online-${g.id}`]?.length ? 'bg-red-50' : ''">
            <TableCell class="cells">{{ g.first_name || '-' }}</TableCell>
            <TableCell class="cells">{{ g.last_name || '-' }}</TableCell>
            <TableCell class="cells">{{ g.phone_number || '-' }}</TableCell>
            <TableCell class="cells w-1/4"> {{ g.ticket_number }}</TableCell>
            <TableCell class="cells text-center">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold cursor-default select-none w-18"
                :class="toBoolean(g.is_vip) ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-600'">

                <Star class="w-4 h-4 ml-1" />
                {{ toBoolean(g.is_vip) ? 'ویژه' : 'عادی' }}
              </span>
            </TableCell>
            <TableCell class="cells w-1/6">
              <Button variant="destructive" size="sm" @click="delOnline(g.id)">
                حذف
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>


    <!-- Submit -->
    <div class="text-right">
      <Button :disabled="Object.keys(errors).length > 0 || !offlineGuests.length" @click="submitAll">
        ارسال مهمانان

      </Button>
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
