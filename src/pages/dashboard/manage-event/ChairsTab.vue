<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHallStore } from "@/stores/hall";
import { useEventStore } from "@/stores/event";
import { Card } from "@/components/ui/card";
import { toast } from "vue-sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, CheckCircle, XCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button/";

const route = useRoute();
const eventId = parseInt(route.params.id as string);
const hallStore = useHallStore();
const eventStore = useEventStore();

const event = computed(() => eventStore.events[eventId]);
const guests = computed(
  () => eventStore.guestDataByEventId[eventId]?.guests ?? []
);
const analytics = computed(() => {
  return eventStore.guestDataByEventId[eventId] ?? {};
});

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

onMounted(async () => {
  try {
    await eventStore.getEventDetails(eventId);
    toast.success("مهمانان دریافت شدند");
  } catch (error: any) {
    // toast.error("Failed to load event details");
  }
});

async function refreshGuests() {
  try {
    await eventStore.getEventDetails(eventId);
    toast.success("مهمانان مجدد دریافت شدند");
  } catch (error: any) {
    toast.error("خطایی رخ داد");
  }
}

const toBoolean = (val: unknown): boolean => {
  if (typeof val === "string") return val.trim().toLowerCase() === "true";
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;
  return false;
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const loadGuests = async (page: number) => {
  await eventStore.getEventDetails(eventId, page);
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div
      class="w-full min-w-[800px] bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <div class="px-6 py-8 md:px-12 bg-white space-y-2">
        <h1 class="text-3xl md:text-4xl font-extrabold">
          {{ event?.hall_name }}
        </h1>
        <p class="text-muted-foreground text-sm md:text-2xl">
          {{ event?.hall_address }}
        </p>

        <div class="flex">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card class="p-4 text-center max-h-36">
              <p class="text-2xl text-muted-foreground">شروع پذیرش</p>
              <p class="font-semibold text-2xl">
                {{ formatDateTime(event?.start_acceptance ?? "") }}
              </p>
            </Card>

            <Card class="p-4 text-center max-h-36">
              <p class="text-2xl text-muted-foreground">شروع رویداد</p>
              <p class="font-semibold text-2xl">
                {{ formatDateTime(event?.start_time ?? "") }}
              </p>
            </Card>

            <Card class="p-4 text-center max-h-36">
              <p class="text-2xl text-muted-foreground">پایان رویداد</p>
              <p class="font-semibold text-2xl">
                {{ formatDateTime(event?.end_time ?? "") }}
              </p>
            </Card>
          </div>
          <!-- Guest Analytics -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-6 mt-0">
            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">کل مهمان‌ها</p>
              <p class="font-bold text-3xl text-blue-600">
                {{ analytics?.total_guest ?? 0 }}
              </p>
            </Card>

            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">مهمان VIP</p>
              <p class="font-bold text-3xl text-yellow-600">
                {{ analytics?.vip_guest ?? 0 }}
              </p>
            </Card>

            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">پذیرفته‌شده</p>
              <p class="font-bold text-3xl text-green-600">
                {{ analytics?.accepted_guests ?? 0 }}
              </p>
            </Card>
            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">ظرفیت سالن</p>
              <p class="font-bold text-3xl text-cyan-600">
                {{ analytics?.capacity_hall ?? 0 }}
              </p>
            </Card>

            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">مهمان عادی</p>
              <p class="font-bold text-3xl text-black">
                {{
                  (analytics?.total_guest ?? 0) - (analytics?.vip_guest ?? 0)
                }}
              </p>
            </Card>
            <Card class="p-4 text-center">
              <p class="text-xl text-muted-foreground">پذیرفته‌نشده</p>
              <p class="font-bold text-3xl text-red-600">
                {{ analytics?.unaccepted_guests ?? 0 }}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Table>
      <TableCaption
        @click="refreshGuests"
        class="cursor-pointer text-blue-600 hover:underline"
      >
        برای رفرش کلیک کنید
      </TableCaption>

      <TableBody>
        <TableRow>
          <TableHead class="text-right">نام</TableHead>
          <TableHead class="text-right">نام خانوادگی</TableHead>
          <TableHead class="text-right">موبایل</TableHead>
          <TableHead class="text-right">شماره بلیط</TableHead>
          <TableHead class="text-right">نوع بلیط</TableHead>
          <TableHead class="text-right">وضعیت حضور</TableHead>
          <TableHead class="text-right">زمان ورود</TableHead>
        </TableRow>
      </TableBody>

      <TableBody>
        <TableRow v-for="guest in guests" :key="guest.ticket_number">
          <TableCell>{{ guest.first_name }}</TableCell>
          <TableCell>{{ guest.last_name }}</TableCell>
          <TableCell>{{ guest.phone_number }}</TableCell>
          <TableCell>{{ guest.ticket_number }}</TableCell>

          <!-- نوع بلیط -->
          <TableCell class="text-right">
            <span
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold select-none"
              :class="
                toBoolean(guest.is_vip)
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              "
            >
              <Star class="w-4 h-4 ml-1" />
              {{ toBoolean(guest.is_vip) ? "ویژه" : "عادی" }}
            </span>
          </TableCell>

          <!-- وضعیت حضور -->
          <TableCell class="text-right">
            <span
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold select-none"
              :class="
                toBoolean(guest.is_accepted)
                  ? 'bg-green-600 text-white'
                  : 'bg-red-500 text-white'
              "
            >
              <CheckCircle
                v-if="toBoolean(guest.is_accepted)"
                class="w-4 h-4 ml-1"
              />
              <XCircle v-else class="w-4 h-4 ml-1" />
              {{ toBoolean(guest.is_accepted) ? "حاضر" : "غایب" }}
            </span>
          </TableCell>

          <!-- زمان ورود -->
          <TableCell class="text-right">
            {{
              guest.datetime_accepted
                ? formatTime(guest.datetime_accepted)
                : "-"
            }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="mt-4 flex justify-center gap-4">
      <Button
        :disabled="!eventStore.guestDataByEventId[eventId]?.previous"
        @click="() => eventStore.guestDataByEventId[eventId]?.previous !== null && loadGuests(eventStore.guestDataByEventId[eventId]!.previous!)"
      >
        صفحه قبل
      </Button>

      <Button
        :disabled="!eventStore.guestDataByEventId[eventId]?.next"
        @click="() => eventStore.guestDataByEventId[eventId]?.next !== null && loadGuests(eventStore.guestDataByEventId[eventId]!.next!)"
      >
        صفحه بعد
      </Button>
    </div>
  </div>
</template>
