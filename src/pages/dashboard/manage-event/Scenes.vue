<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import StatusUi from '@/components/StatusUi.vue';
import type { Event, SceneInput, SceneList } from '@/types/events';

interface SceneBlock {
    name: string;
    duration: number;
    speaker: string;
    speaker_first_name: string;
    speaker_last_name: string;
    descriptions: string;
}


// --- ROUTE & API SETUP ---
const route = useRoute();
const eventId = route.params.id as string;

// API hooks
const { fetchData: getEvent, data: eventData, error: getEvent_error, loading: getEvent_loading } =
    useApi<Event>('GET', `/api/v0/core/${eventId}`);
const { fetchData: getScenes, data: ScenesData, error: getScenes_error, loading: getScenes_loading } =
    useApi<SceneList>('GET', `/api/v0/scenes/${eventId}`);
const { fetchData: PostScene, data: SceneData, error: PostScene_error, loading: PostScene_loading } =
    useApi<SceneInput>('POST', `/api/v0/scenes/${eventId}/create/`);

// --- STATE ---
const A_getE_error = ref('');
const A_getS_error = ref('');
const A_create_error = ref('');
const A_create_mess = ref('');
const blocks = ref<SceneBlock[]>([]);

// --- LIFECYCLE ---
onMounted(async () => {
    await getEvent();
    if (getEvent_error.value) {
        A_getE_error.value = getEvent_error.value;
    }

    await getScenes();
    if (getScenes_error.value) {
        A_getS_error.value = getScenes_error.value;
    }
});

// --- HELPERS ---
function addBlock() {
    blocks.value.push({
        name: '',
        duration: 5,
        speaker: '',
        speaker_first_name: '',
        speaker_last_name: '',
        descriptions: '',
    });
}


function removeBlock(idx: number) {
    blocks.value.splice(idx, 1);
}

function addMinutes(date: Date, mins: number) {
    return new Date(date.getTime() + mins * 60000);
}

// --- SUBMIT & REFRESH ---
const handleSubmit = async () => {
    A_create_error.value = '';
    A_create_mess.value = '';

    if (!eventData.value) {
        A_create_error.value = 'Event data not loaded yet.';
        return;
    }
    if (!blocks.value.length) {
        A_create_error.value = 'لطفاً حداقل یک بخش اضافه کنید.';
        return;
    }

    let cursor = new Date(eventData.value.start_time);

    for (const block of blocks.value) {
        const start = new Date(cursor);
        const end = addMinutes(start, block.duration);

        const payload: SceneInput = {
            speaker: block.speaker,
            name: block.name,
            start_time: formatTimeOnly(start),
            end_time: formatTimeOnly(end),
            speaker_first_name: block.speaker_first_name,
            speaker_last_name: block.speaker_last_name,
            descriptions: block.descriptions,
        };

        await PostScene(payload);

        if (PostScene_error.value) {
            A_create_error.value = PostScene_error.value;
            return;
        }

        cursor = end;
    }


    A_create_mess.value = 'تمام بخش‌ها با موفقیت ساخته شدند.';
    blocks.value = [];
};

const refreshScenes = async () => {
    await getScenes();
};


function formatTimeOnly(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}




</script>

<template>
    <div class="p-6 max-w-2xl mx-auto space-y-6">
        <!-- STATUS BARS -->
        <StatusUi message="" :error="A_getE_error" :loading="getEvent_loading" />
        <StatusUi message="" :error="A_getS_error" :loading="getScenes_loading" />
        <StatusUi :message="A_create_mess" :error="A_create_error" :loading="PostScene_loading" />

        <!-- BLOCK EDITOR -->
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


            <button @click="addBlock" class="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2">
                + افزودن بخش
            </button>
        </div>

        <!-- ACTIONS -->
        <div class="flex gap-4">
            <button @click="handleSubmit" class="flex-1 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
                ارسال بخش‌ها
            </button>
            <button @click="refreshScenes" class="flex-1 bg-gray-100 hover:bg-gray-200 rounded px-4 py-2">
                🔄 تازه‌سازی
            </button>
        </div>

        <!-- EXISTING SCENES LIST -->
        <div v-if="ScenesData?.length" class="mt-6">
            <h3 class="font-semibold mb-2">صحنه‌های فعلی:</h3>
            <ul class="list-disc list-inside space-y-1">
                <li v-for="scene in ScenesData" :key="scene.id">
                    {{ scene.name }}: {{ scene.start_time }} → {{ scene.end_time }}
                </li>
            </ul>
        </div>
    </div>
</template>
