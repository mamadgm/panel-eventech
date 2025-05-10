<!-- src/pages/dashboard/tabs/ChairsTab.vue -->
<script setup lang="ts">
import { useApi } from "@/composables/useapi";
import { onMounted, ref } from "vue";
import CinemaGrid from "@/components/Cinema.vue"; // keep original
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";
import type { CinemaData, CinemaPostData } from "@/types/events";

const route = useRoute();
const eventId = parseInt(route.params.id as string);

// State
const positionMatrix = ref<number[][]>([[0]]);
const cinemaLayout = ref<number[][]>([[0]]);
const successMessage = ref("");
const errorMessage = ref("");
const mode = ref<0 | 1>(0);

const { data, error, loading, fetchData } = useApi<CinemaData>("GET", `/api/v0/hall/event/${eventId}/`);

const refreshpage = async () => {
  successMessage.value = "";
  await fetchData();
  if (data.value) {
    positionMatrix.value = data.value.position_matrix;
    cinemaLayout.value = positionMatrix.value;
  } else if (error.value) {
    console.error("Error fetching layout:", error.value);
  }
};

const {
  data: postData,
  error: postError,
  loading: postLoading,
  fetchData: postFetch,
} = useApi<CinemaPostData>("PUT", `/api/v0/hall/event/${eventId}/`);

// Lifecycle
onMounted(async () => {
  await fetchData();
  if (data.value) {
    positionMatrix.value = data.value.position_matrix;
    cinemaLayout.value = positionMatrix.value;
  } else if (error.value) {
    console.error("Error fetching layout:", error.value);
  }
});

// Handlers
const handleCellClicked = (payload: { rowIndex: number; colIndex: number; cellValue: number }) => {
  const { rowIndex, colIndex, cellValue } = payload;

  // If your business logic still forbids clicking “-1” seats:
  if (cinemaLayout.value[rowIndex][colIndex] === -1) return;

  // Apply exactly what the child told us
  cinemaLayout.value[rowIndex][colIndex] = cellValue;

  // Keep your “working copy” in sync
  positionMatrix.value = structuredClone(cinemaLayout.value);
};


const submitEventData = async () => {
  const PostBody: CinemaPostData = {
    event: eventId,
    position_matrix: positionMatrix.value,
  };

  try {
    await postFetch(PostBody);

    if (postData.value) {
      successMessage.value = "✅ چینش سالن با موفقیت ذخیره شد";
      errorMessage.value = "";
    } else {
      errorMessage.value = postError.value || "❌ خطا در ذخیره‌سازی سالن";
      successMessage.value = "";
    }
  } catch (err) {
    errorMessage.value = "❌ خطای غیرمنتظره‌ای رخ داد.";
    successMessage.value = "";
  }
};
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center gap-2">
      <label for="mode" class="font-medium">نوع انتخاب صندلی:</label>
      <select id="mode" v-model="mode" class="border rounded p-1">
        <option :value="0">حالت ویژه</option>
        <option :value="1">حالت رزرو</option>
      </select>
    </div>

    <div v-if="loading" class="text-center text-gray-500">در حال بارگذاری...</div>

    <div v-else-if="!error">
      <div class="border rounded-lg bg-white p-4 shadow-sm">
        <CinemaGrid :cinema="cinemaLayout" :mode="mode" :squareSize="25" @cellClicked="handleCellClicked" :allowchange="1" :height="370" />
      </div>

      <div class="flex justify-center mt-6 gap-4">
        <Button variant="default" @click="submitEventData" :disabled="postLoading"> ذخیره چینش </Button>
        <Button variant="outline" @click="refreshpage"> 🔄 بارگذاری مجدد </Button>
      </div>

      <p
        class="text-center mt-4 w-3xl transition-all duration-300 min-h-[48px]"
        :class="successMessage ? 'bg-green-100 text-green-600 p-3 rounded' : ''"
      >
        {{ successMessage }}
      </p>

      <p v-show="errorMessage" class="text-red-600 text-center mt-4 bg-red-100 p-3 rounded">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else>
      <p class="text-red-500 text-center">خطا در دریافت اطلاعات سالن</p>
    </div>
  </div>
</template>
