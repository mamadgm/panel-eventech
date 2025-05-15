<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";
import StatusUi from "@/components/StatusUi.vue";

//etc
const router = useRouter();
const authStore = useAuthStore();
//local vars
const A_login_error = ref("");
const A_login_mess = ref("");
const A_login_loading = ref(false);
const phone_number = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await authStore.Login(phone_number.value, password.value);
    toast.success("با موفقیت وارد شدید" , {
      description: authStore.first_name + " " + authStore.last_name
    });
    router.push("/dashboard/manage-event");
  } catch (error: any) {
    toast.error('ورود ناموفق', {
      description: error?.response?.data?.message || error.message || 'خطای ناشناخته',
    })
  }
};
</script>

<template>
  <Card class="mx-auto max-w-sm w-96">
    <CardHeader>
      <CardTitle class="text-2xl">ورود</CardTitle>
      <CardDescription
        >شماره تلفن خود را وارد کنید تا وارد شوید</CardDescription
      >
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="phone">شماره تلفن</Label>
          <Input
            id="phone"
            type="tel"
            v-model="phone_number"
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
            placeholder="********"
            required
          />
        </div>
        <Button @click="handleLogin" class="w-full" :disabled="A_login_loading">
          {{ A_login_loading ? "در حال ورود..." : "ورود" }}
        </Button>
        <StatusUi
          :message="A_login_mess"
          :error="A_login_error"
          :loading="A_login_loading"
        />
      </div>
    </CardContent>
  </Card>
</template>
