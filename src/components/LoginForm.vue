<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useapi'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest, LoginResponse } from '@/types/auth'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Form fields
const phone = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

// Use composable for login API
const { data, error, loading, fetchData } = useApi<LoginResponse>('POST', '/api/v0/account/login/password/')

const handleLogin = async () => {
  if (!phone.value || !password.value) {
    alert('لطفا شماره تلفن و رمز عبور را وارد کنید')
    return
  }

  await fetchData({
    phone_number: phone.value,
    password: password.value,
  } as LoginRequest)

  if (data.value) {
    authStore.setToken(data.value.access_token)
    router.push('/dashboard/manage-event')
  } else if (error.value) {
    alert('ورود ناموفق: ' + error.value)
  }
}
</script>

<template>
  <Card class="mx-auto max-w-sm w-96">
    <CardHeader>
      <CardTitle class="text-2xl">ورود</CardTitle>
      <CardDescription>شماره تلفن خود را وارد کنید تا وارد شوید</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="phone">شماره تلفن</Label>
          <Input
            id="phone"
            type="tel"
            v-model="phone"
            placeholder="09012345678"
            required
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">رمز عبور</Label>
          <Input
            id="password"
            type="password"
            v-model="password"
            required
          />
        </div>
        <Button @click="handleLogin" class="w-full" :disabled="loading">
          {{ loading ? 'در حال ورود...' : 'ورود' }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
