<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AppSideBar from '@/components/AppSidebar.vue'
import { onMounted } from 'vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const eventId = parseInt(route.params.id as string)

onMounted(() => {
  // Log the eventId for debugging purposes
  console.log("eventId:", eventId)

  // Check if the eventId is NaN (invalid ID)
  if (isNaN(eventId)) {
    toast('رویداد را انتخاب کنید', {
        description: 'ابتدا رویداد را انتخاب کنید',
      })
    router.replace('/dashboard/manage-event')
  }
})
</script>

<template>
  <div class="flex">
    <div class="flex-1 p-6">
      <router-view />
    </div>
  </div>
</template>
