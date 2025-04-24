<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import SettingsTab from './manage-event/SettingsTab.vue'
import ChairsTab from './manage-event/ChairsTab.vue'
import GuestsTab from './manage-event/GuestsTab.vue'
import OperatorsTab from './manage-event/OperatorsTab.vue'


const route = useRoute()
const eventId = parseInt(route.params.id as string)
const selectedTab = ref('settings')
</script>

<template>
    <div class="p-4 space-y-6">
        
        <h2 class="text-2xl text-gray-800 font-kalame">مدیریت رویداد شماره {{ eventId }}</h2>
        <Tabs v-model="selectedTab" class="space-y-4" dir="rtl">
            <TabsList class="flex w-4xl gap-2 rtl:flex-row-reverse">
                <TabsTrigger value="operators">اپراتورها</TabsTrigger>
                <TabsTrigger value="chairs">سالن رویداد</TabsTrigger>
                <TabsTrigger value="guests">لیست شرکت کنندگان</TabsTrigger>
                <TabsTrigger value="settings">تنظیمات کلی</TabsTrigger>
            </TabsList>

            <TabsContent value="operators" class="min-h-[700px] p-4">
                <OperatorsTab :event-id="eventId" />
            </TabsContent>

            <TabsContent value="chairs" class="min-h-[700px] p-4">
                <ChairsTab :event-id="eventId" />
            </TabsContent>

            <TabsContent value="guests" class="min-h-[700px] p-4">
                <GuestsTab :event-id="eventId" />
            </TabsContent>

            <TabsContent value="settings" class="min-h-[700px] p-4">
                <SettingsTab :event-id="eventId" />
            </TabsContent>




        </Tabs>
    </div>
</template>
