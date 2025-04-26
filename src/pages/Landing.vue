<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const router = useRouter()

const moveToDashboard = () => {
  return router.push('/dashboard/manage-event')
}
const moveToLogin = () => {
  return router.push('/login')
}


</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gray-100">
    <Card class="w-full max-w-md shadow-lg rounded-2xl">
      <CardContent class="flex flex-col items-center justify-center space-y-6 p-8">
        <h1 class="text-3xl font-bold text-center">خوش آمدید 👋</h1>
        <p class="text-gray-600 text-center text-lg">
          لطفا وارد شوید یا داشبورد را ببینید
        </p>
        <div class="flex flex-col w-full space-y-4">
          <Button class="w-full" @click="moveToLogin">
            ورود به سیستم
          </Button>
          <Button variant="outline" class="w-full" @click="moveToDashboard">
            رفتن به داشبورد
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
