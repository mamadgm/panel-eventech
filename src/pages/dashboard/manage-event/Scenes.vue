<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useapi';
import StatusUi from '@/components/StatusUi.vue';
import type { Event, SceneInput, SceneList } from '@/types/events';

const route = useRoute();
const eventId = route.params.id;
const EventDetails = ref<SceneInput>();
const A_getE_error = ref('');
const A_getS_error = ref('');



// Fetch existing event
const { fetchData: getEvent, data: eventData, error: getEvent_error, loading: getEvent_loading } = useApi<Event>('GET', `/api/v0/core/${eventId}`);
const { fetchData: getScenes, data: ScenesData, error: getScenes_error, loading: getScenes_loading } = useApi<SceneList>('GET', `/api/v0/scenes/${eventId}`);
const { fetchData: PostScene, data: SceneData, error: PostScene_error, loading: PostScene_loading } = useApi<SceneInput>('GET', `/api/v0/scenes/${eventId}/create/`);




onMounted(async () => {
    await getEvent();
    if (getEvent_error.value) {
        A_getE_error.value = getEvent_error.value;
    } else if (eventData.value == null) {
        A_create_error.value = 'خطای غیرمنتظره‌ای رخ داد';
    }else{
        console.log(eventData.value);
    }
    await getScenes();
    if (getScenes_error.value) {
        A_getS_error.value = getScenes_error.value;
    } else if (ScenesData.value == null) {
        A_getS_error.value = 'خطای غیرمنتظره‌ای رخ داد';
    }

});



const A_create_mess = ref('');
const A_create_error = ref('');
const handleSubmit = async () => {
    A_create_error.value = '';
    A_create_mess.value = '';
    await PostScene(EventDetails.value);

    if (PostScene_error.value) {
        A_create_error.value = PostScene_error.value;
    } else if (SceneData.value) {
        A_create_mess.value = 'سین ساخته شد';
    } else {
        A_create_error.value = 'خطای غیرمنتظره‌ای رخ داد';
    }

};
</script>

<template>
    <StatusUi message="" :error="A_getS_error" :loading="getScenes_loading" />
    <StatusUi message="" :error="A_getE_error" :loading="getEvent_loading" />
    <StatusUi :message="A_create_mess" :error="A_create_error" :loading="PostScene_loading" />
</template>
