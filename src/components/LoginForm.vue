<script setup lang="ts">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import the auth store to manage authentication state

// Set up reactive variables for email and password input fields
const email = ref('')
const password = ref('')

// Initialize Vue Router
const router = useRouter()

// Access the authentication store
const authStore = useAuthStore()

// Handle login
const handleLogin = () => {
  // You would generally validate the credentials with an API here.
  // For now, we simulate the login process.
  if (email.value && password.value) {
    authStore.login() // Set authentication status to true
    router.push('/dashboard') // Redirect to the dashboard on successful login
  } else {
    // Handle login failure (optional: show an error message)
    alert('Please fill in both email and password')
  }
}
</script>

<template>
  <Card class="mx-auto max-w-sm w-96">
    <CardHeader>
      <CardTitle class="text-2xl">
        ورود
      </CardTitle>
      <CardDescription>
        ایمیل خود را وارد کنید تا به حساب کاربری خود وارد شوید
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">ایمیل</Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            placeholder="m@example.com"
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
        <Button @click="handleLogin" class="w-full">
          ورود
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
