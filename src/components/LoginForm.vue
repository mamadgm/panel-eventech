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
import { toast } from 'vue-sonner'

// Form fields
const phone = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

// Use composable for login API
const { data, error, loading, fetchData } = useApi<LoginResponse>('POST', '/api/v0/account/login/password/')

const handleLogin = async () => {
  // 1) Basic client-side validation
  if (!phone.value || !password.value) {
    toast('لطفا شماره تلفن و رمز عبور را وارد کنید')
    
    return
  }

  // 2) Fire the request
  await fetchData({
    phone_number: phone.value,
    password: password.value,
  } as LoginRequest)

  // 3) First, did axios itself throw (e.g. network / non-2xx status)?
  if (error.value) {
    toast('خطای شبکه یا سرور: ' + error.value)
    return
  }

  // 4) Now check whether the response body itself is an “error” shape
  //    (e.g. your backend might respond 200 + { message: 'Invalid creds' })
  const payload = data.value as any
  const serverMsg =
    // common places you might find an error message
    payload?.message ||
    payload?.detail ||
    (Array.isArray(payload?.non_field_errors)
      ? payload.non_field_errors.join(', ')
      : null)

  if (serverMsg) {
    toast('ورود ناموفق: ' + serverMsg)
    return
  }

  // 5) Finally, if we made it this far we should have a token
  if (payload?.access_token) {
    toast('خوش آمدید')
    authStore.setToken(payload.access_token)
    router.push('/dashboard/manage-event')
  } else {
    // sanity‐check fallback
    toast('ورودی نامشخص از سرور؛ لطفاً دوباره تلاش کنید')
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
