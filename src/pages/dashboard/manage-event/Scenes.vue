<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useapi";
import StatusUi from "@/components/StatusUi.vue";
import type { Event, SceneInput, Scene, SceneList } from "@/types/events";

interface SceneBlock {
  name: string;
  duration: number;
  speaker: string;
  speaker_first_name: string;
  speaker_last_name: string;
  descriptions: string;
  start : string ;
  end : string ;
}

// ─────────────── NEW: TIME COMPUTATIONS ───────────────
const totalEventMinutes = computed(() => {
  if (!eventData.value) return 0;
  const start = new Date(eventData.value.start_time);
  const end = new Date(eventData.value.end_time);
  return Math.round((end.getTime() - start.getTime()) / 60000);
});
const allocatedMinutes = computed(() => blocks.value.reduce((sum, b) => sum + b.duration, 0));
const remainingMinutes = computed(() => totalEventMinutes.value - allocatedMinutes.value);
const hasOverflow = computed(() => allocatedMinutes.value > totalEventMinutes.value);
const canAdd = computed(() => remainingMinutes.value > 0);
const canSubmit = computed(() => blocks.value.length > 0 && !hasOverflow.value);
// ────────────────────────────────────────────────────────────

// --- ROUTE & API SETUP ---
const route = useRoute();
const eventId = route.params.id as string;

const { fetchData: getEvent, data: eventData, error: getEvent_error, loading: getEvent_loading } = useApi<Event>("GET", `/api/v0/core/${eventId}`);
const {
  fetchData: getScenes,
  data: ScenesData,
  error: getScenes_error,
  loading: getScenes_loading,
} = useApi<SceneList>("GET", `/api/v0/scenes/${eventId}`);
const {
  fetchData: PostScene,
  data: SceneData,
  error: PostScene_error,
  loading: PostScene_loading,
} = useApi<SceneInput[]>("POST", `/api/v0/scenes/${eventId}/create/`);

// --- STATE ---
const A_getE_error = ref("");
const A_getS_error = ref("");
const A_create_error = ref("");
const A_create_mess = ref("");
const blocks = ref<SceneBlock[]>([]);

// ─────────────── NEW: EXISTING SCENES AS BLOCKS ───────────────
function parseTimeToMs(timeStr: string) {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600000 + m * 60000 + s * 1000;
}

const existingBlocks = computed<SceneBlock[]>(() => {
  if (!ScenesData.value) return [];
  return ScenesData.value.map((scene: Scene) => {
    // derive duration in minutes
    const duration = Math.round((parseTimeToMs(scene.end_time) - parseTimeToMs(scene.start_time)) / 60000);
    return {
      name: scene.name,
      duration,
      speaker: scene.speaker.phone_number,
      speaker_first_name: scene.speaker_first_name,
      speaker_last_name: scene.speaker_last_name,
      descriptions: scene.descriptions,
      start: scene.start_time,
      end: scene.end_time,
    };
  });
});
// ────────────────────────────────────────────────────────────────────

// --- LIFECYCLE ---
onMounted(async () => {
  await getEvent();
  if (getEvent_error.value) {
    A_getE_error.value = getEvent_error.value;
  }

  await getScenes();
  if (getScenes_error.value) {
    A_getS_error.value = getScenes_error.value;
  } else if (ScenesData.value) {
    // *** NEW: seed blocks with existing scenes ***
    blocks.value = ScenesData.value.map((scene) => {
      // compute duration in minutes from HH:mm:ss
      const [sh, sm, ss] = scene.start_time.split(":").map(Number);
      const [eh, em, es] = scene.end_time.split(":").map(Number);
      const dur = eh * 60 + em - (sh * 60 + sm);

      return {
        name: scene.name,
        duration: dur,
        speaker: scene.speaker.phone_number,
        speaker_first_name: scene.speaker_first_name,
        speaker_last_name: scene.speaker_last_name,
        descriptions: scene.descriptions,
      } as SceneBlock;
    });
  }
});

// --- HELPERS ---
function addBlock() {
  blocks.value.push({ name: "", duration: 5, speaker: "", speaker_first_name: "", speaker_last_name: "", descriptions: ""  , start:"" , end: ""});
}
function removeBlock(idx: number) {
  blocks.value.splice(idx, 1);
}
function addMinutes(date: Date, mins: number) {
  return new Date(date.getTime() + mins * 60000);
}
function formatTimeOnly(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// --- SUBMIT & REFRESH ---
const handleSubmit = async () => {
  A_create_error.value = "";
  A_create_mess.value = "";

  if (!eventData.value) {
    A_create_error.value = "Event data not loaded yet.";
    return;
  }
  if (!blocks.value.length) {
    A_create_error.value = "لطفاً حداقل یک بخش اضافه کنید.";
    return;
  }
  if (hasOverflow.value) {
    A_create_error.value = `مدت تخصیص‌یافته (${allocatedMinutes.value} دقیقه) از کل زمان رویداد (${totalEventMinutes.value} دقیقه) بیشتر است!`;
    return;
  }

  let cursor = new Date(eventData.value.start_time);
  const payloadList = blocks.value.map((block) => {
    const start = new Date(cursor);
    const end = addMinutes(start, block.duration);
    cursor = end;
    return {
      speaker: block.speaker,
      name: block.name,
      start_time: formatTimeOnly(start),
      end_time: formatTimeOnly(end),
      speaker_first_name: block.speaker_first_name,
      speaker_last_name: block.speaker_last_name,
      descriptions: block.descriptions,
    };
  });

  await PostScene(payloadList);
  if (PostScene_error.value) {
    A_create_error.value = PostScene_error.value;
    return;
  }

  A_create_mess.value = "تمام بخش‌ها با موفقیت ساخته شدند.";
  blocks.value = [];
};

const refreshScenes = async () => {
  await getScenes();
};

const blocksWithTimes = computed(() => {
  if (!eventData.value) return [];
  let cursor = new Date(eventData.value.start_time);
  return;
  blocks.value.map((block) => {
    const start = new Date(cursor);
    const end = addMinutes(start, block.duration);
    cursor = end;
    return { ...block, start_time: formatTimeOnly(start), end_time: formatTimeOnly(end) };
  });
});


</script>

<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6">
    <!-- STATUS BARS -->
    <StatusUi message="" :error="A_getE_error" :loading="getEvent_loading" />
    <StatusUi message="" :error="A_getS_error" :loading="getScenes_loading" />
    <StatusUi :message="A_create_mess" :error="A_create_error" :loading="PostScene_loading" />

    <!-- ───── EXISTING SCENES ───── -->
    <div v-if="existingBlocks.length" class="space-y-4">
      <h3 class="font-semibold">صحنه‌های قبلی:</h3>
      <div v-for="(blk, i) in existingBlocks" :key="`existing-${i}`" class="space-y-1 border-l-4 border-gray-400 pl-4 py-2 bg-gray-50 rounded">
        <div class="font-medium">{{ blk.name }} ({{ blk.duration }} دقیقه)</div>
        <div class="text-sm">سخنران: {{ blk.speaker_first_name }} {{ blk.speaker_last_name }}</div>
        <div class="text-xs text-gray-600">{{ blk.descriptions }}</div>
        <div class="text-xs text-gray-600">{{ blk.start }}</div>
        <div class="text-xs text-gray-600">{{ blk.end }}</div>
      </div>
    </div>

    <!-- ─────── TIME SUMMARY WIDGET ─────── -->
    <div class="border rounded p-4 bg-gray-50 space-y-2">
      <div>
        مدت کل رویداد: <strong>{{ totalEventMinutes }}</strong> دقیقه
      </div>
      <div>
        مدت تخصیص‌یافته: <strong>{{ allocatedMinutes }}</strong> دقیقه
      </div>
      <div>
        زمان باقی‌مانده:
        <strong :class="remainingMinutes >= 0 ? 'text-green-600' : 'text-red-600'"> {{ remainingMinutes }} دقیقه </strong>
      </div>
      <div v-if="hasOverflow" class="text-red-600 font-semibold">خطا: مجموع زمان صحنه‌ها نباید بیشتر از مدت رویداد باشد!</div>
    </div>

    <!-- ─────── BLOCK EDITOR ─────── -->
    <div class="space-y-4">
      <div v-for="(block, idx) in blocks" :key="idx" class="space-y-2 border p-4 rounded">
        <input v-model="block.name" placeholder="نام صحنه" class="input w-full" />
        <input v-model.number="block.duration" type="number" placeholder="مدت (دقیقه)" class="input w-full" />
        <input v-model="block.speaker" placeholder="شماره تماس سخنران" class="input w-full" />
        <input v-model="block.speaker_first_name" placeholder="نام سخنران" class="input w-full" />
        <input v-model="block.speaker_last_name" placeholder="نام خانوادگی سخنران" class="input w-full" />
        <textarea v-model="block.descriptions" placeholder="توضیحات" class="input w-full" rows="2" />
        <button @click="removeBlock(idx)" class="text-red-600 hover:underline">حذف</button>
      </div>
      <button
        @click="addBlock"
        :disabled="!canAdd"
        :class="['rounded px-4 py-2', canAdd ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 cursor-not-allowed opacity-50']"
      >
        افزودن
      </button>
    </div>

    <!-- ─────── ACTIONS ─────── -->
    <div class="flex gap-4">
      <button
        @click="handleSubmit"
        :disabled="!canSubmit"
        :class="['flex-1 text-white rounded px-4 py-2', canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed opacity-50']"
      >
        ارسال
      </button>
      <button @click="refreshScenes" class="flex-1 bg-gray-100 hover:bg-gray-200 rounded px-4 py-2">🔄 تازه‌سازی</button>
    </div>
  </div>
</template>
