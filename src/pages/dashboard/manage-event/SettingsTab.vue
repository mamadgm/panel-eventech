<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import DatePicker from "vue3-persian-datetime-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Cinema from "@/components/Cinema.vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-vue-next";
import { useEventStore } from "@/stores/event";
import { useHallStore } from "@/stores/hall";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
const hallStore = useHallStore();
const eventStore = useEventStore();

const route = useRoute();
const eventId = parseInt(route.params.id as string);

const handleSubmit_loading = ref(false);
async function handleSubmit() {
  handleSubmit_loading.value = true;
  try {
    await eventStore.UpdateEvent(eventId);
    toast.success(`رویداد با موفقیت ویرایش شد`);
  } catch (error: any) {
    toast.error("خطا در ویرایش رویداد", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  } finally {
    handleSubmit_loading.value = false;
  }
}

onMounted(async () => {
  eventStore.setFormDataFromEventId(eventId);

  console.log(eventStore.form.image);

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
function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    eventStore.form.image = file;
  }
}

const imageUrl = computed(() => {
  const image = eventStore.form.image;
  if (typeof image === "string") {
    return image;
  }
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  return "";
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
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

      <!-- inside your form -->
      <div class="grid w-full max-w-48 items-center gap-1.5">
        <Label for="picture">تصویر رویداد</Label>
        <Input id="picture" type="file" @change="onFileChange" />
      </div>
      <Card>
        <CardContent class="p-4">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="تصویر رویداد"
            class="w-full h-64 object-cover rounded-xl shadow"
          />
          <p v-else class="text-center text-muted-foreground">
            تصویری یافت نشد
          </p>
        </CardContent>
      </Card>

      <div class="flex p-4">
        <div class="p-2">
          <label for="name" class="block mb-1 text-sm font-medium text-gray-700"
            >نام سالن</label
          >
          <input
            v-model="eventStore.form.hall_name"
            type="text"
            id="name"
            placeholder="نام سالن"
            class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="p-2">
          <label for="name" class="block mb-1 text-sm font-medium text-gray-700"
            >آدرس سالن</label
          >
          <input
            v-model="eventStore.form.hall_address"
            type="text"
            id="name"
            placeholder="آدرس سالن"
            class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="p-2">
          <label for="name" class="block mb-1 text-sm font-medium text-gray-700"
            >ظرفیت سالن</label
          >
          <input
            v-model="eventStore.form.hall_capacity"
            type="number"
            id="name"
            placeholder="ظرفیت سالن"
            class="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Select Hall -->
      <div>
        <!-- <label class="block mb-2 text-sm font-medium text-gray-700"
          >محل برگزاری</label
        > -->
        <!-- <RadioGroup v-model="eventStore.form.hall_id" class="space-y-3">
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
                hallStore.hallsById[hall.id].id.toString() ==
                  eventStore.form.hall_id
              "
              :cinema="hallStore.hallsById[hall.id].position_matrix ?? [[0]]"
              :squareSize="15"
              :height="240"
            />
          </template>
        </RadioGroup> -->
      </div>
      <!-- Submit Button -->
      <div class="text-left">
        <Button type="submit" :disabled="handleSubmit_loading">
          <Loader2
            v-if="handleSubmit_loading"
            class="w-4 h-4 mr-2 animate-spin"
          />
          {{ handleSubmit_loading ? "در حال ثبت..." : "ویرایش رویداد" }}
        </Button>
      </div>
    </form>
  </div>
</template>
