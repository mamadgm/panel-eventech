<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/solid";
import { useOperatorStore } from "@/stores/operator";
import { toast } from "vue-sonner";

const route = useRoute();
const eventId = parseInt(route.params.id as string);
const operatorStore = useOperatorStore();

function submitNewOper() {}

onMounted(async () => {
  try {
    await operatorStore.getOperators(eventId);
  } catch (error: any) {
    toast.error("خطا در دریافت اپراتور ها", {
      description:
        error?.response?.data?.message || error.message || "خطای ناشناخته",
    });
  }
});

const passwords = reactive<Record<number, string>>({});
const visiblePasswords = reactive<Record<number, boolean>>({});

// Toggle visibility function
const togglePasswordVisibility = (id: number) => {
  visiblePasswords[id] = !visiblePasswords[id];
};

const operDelete = async (id: number) => {};
const operChangePass = async (id: number, pass: string) => {};
</script>

<template>
  <div>
    <form
      @submit.prevent="submitNewOper"
      class="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-3xl"
    >
      <h2 class="text-2xl font-bold mb-4 text-right">اضافه کردن اپراتور</h2>

      <!-- Operator Form Fields -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">نام</label>
          <input
            v-model="operatorStore.form.first_name"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >نام خانوادگی</label
          >
          <input
            v-model="operatorStore.form.last_name"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >شماره تلفن</label
          >
          <input
            v-model="operatorStore.form.phone_number"
            type="tel"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">ایمیل</label>
          <input
            v-model="operatorStore.form.email"
            type="email"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >رمز عبور</label
          >
          <input
            v-model="operatorStore.form.password"
            type="password"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >تکرار رمز عبور</label
          >
          <input
            v-model="operatorStore.form.password_confirm"
            type="password"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
        >
          افزودن اپراتور
        </button>
      </div>
    </form>

    <!-- Operators List -->
    <div class="mt-8 max-w-5xl mx-auto">
      <!-- <h3 class="text-xl font-bold mb-4 text-right">اپراتورهای موجود</h3> -->

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="operator in operatorStore.operators"
          :key="operator.id"
          class="bg-white shadow-md p-4 rounded-md"
        >
          <h4 class="font-semibold text-lg">
            {{ operator.first_name }} {{ operator.last_name }}
          </h4>
          <p class="text-gray-600">
            <span class="font-medium">تلفن:</span> {{ operator.phone_number }}
          </p>
          <p class="text-gray-600">
            <span class="font-medium">ایمیل:</span>
            {{ operator.email || "ندارد" }}
          </p>

          <!-- Password Input -->
          <div class="mt-4 relative">
            <input
              :type="visiblePasswords[operator.id] ? 'text' : 'password'"
              v-model="passwords[operator.id]"
              placeholder="رمز عبور جدید"
              class="w-full border rounded-md px-3 py-2 pr-10"
            />
            <span
              class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              @click="togglePasswordVisibility(operator.id)"
            >
              <component
                :is="visiblePasswords[operator.id] ? EyeIcon : EyeSlashIcon"
                class="w-5 h-5"
              />
            </span>
          </div>

          <!-- Change Password Button -->
          <div class="mt-2">
            <button
              @click="operChangePass(operator.id, passwords[operator.id])"
              class="bg-blue-600 text-white py-1 px-3 rounded-md m-4"
            >
              تغییر پسورد
            </button>
            <button
              @click="operDelete(operator.id)"
              class="bg-red-600 text-white py-1 px-3 rounded-md"
            >
              حذف اپراتور
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
