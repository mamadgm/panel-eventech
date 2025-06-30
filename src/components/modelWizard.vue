<script setup lang="ts">
import { useModalStore } from "@/stores/model";
import WizardTitle from "./wizardTitle.vue";
import InputIcon from "./inputIcon.vue";
import { ref } from "vue";
import {
  PlaneLanding,
  PlaneTakeoff,
  Tags,
  Ticket,
  ImagePlus,
  Check,
  CloudUpload,
} from "lucide-vue-next";

const imageFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

const modal = useModalStore();

const eventName = ref("");

function submit() {
  console.log("Submitted:", eventName.value);
  modal.close();
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0] && files[0].type.startsWith("image/")) {
    imageFile.value = files[0];
    imageUrl.value = URL.createObjectURL(files[0]);
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files[0] && files[0].type.startsWith("image/")) {
    imageFile.value = files[0];
    imageUrl.value = URL.createObjectURL(files[0]);
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}
</script>

<template>
  <div
    v-if="modal.isOpen"
    class="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center z-50"
  >
    <div
      class="bg-red-50 rounded-lg shadow-lg p-6 relative h-[85dvh] aspect-square flex flex-col justify-start items-center"
    >
      <div>
        <!-- Close button -->
        <button
          @click="modal.close()"
          class="absolute text-3xl top-3 left-3 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <!-- Step indicator -->
        <div
          class="flex justify-between mt-8 flex-row-reverse bg-transparent gap-2"
        >
          <div v-for="n in 4">
            <div
              :key="n"
              class="flex-1 h-2 mx-1 rounded w-28"
              :class="modal.step >= n ? 'bg-green-500' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Screens -->
      <div class="mt-8 w-full flex-1 flex flex-col">
        <div v-if="modal.step === 1">
          <WizardTitle
            big="ایجاد رویداد جدید"
            small="برای شروع فرایند ثبت رویداد، لطفاً اطلاعات اولیه را با دقت وارد نمایید."
          ></WizardTitle>
          <div class="gap-y-8 flex flex-col">
            <div class="flex justify-between gap-x-2">
              <InputIcon
                title="نام رویداد"
                hint="نام رویداد خود را وارد کنید..."
                v-model="eventName"
              ></InputIcon>
              <InputIcon
                title="دسته ‌بندی رویداد"
                hint="دسته ‌بندی  خود را وارد کنید..."
                v-model="eventName"
                :icon="Tags"
              ></InputIcon>
            </div>
            <InputIcon
              title="زمان شروع پذیرش"
              hint="زمان شروع پذیرش را انتخاب کنید..."
              v-model="eventName"
              :icon="Ticket"
            ></InputIcon>
            <div class="flex justify-between gap-x-2">
              <InputIcon
                title="زمان شروع رویداد"
                hint="زمان شروع رویداد را وارد کنید..."
                v-model="eventName"
                :icon="PlaneLanding"
              ></InputIcon>
              <InputIcon
                title="زمان پایان رویداد"
                hint="زمان پایان رویداد را وارد کنید..."
                v-model="eventName"
                :icon="PlaneTakeoff"
              ></InputIcon>
            </div>
          </div>
        </div>
        <div v-else-if="modal.step === 2" class="h-full flex flex-col">
          <WizardTitle
            big="بارگذاری تصویر رویداد"
            small="فایل تصویر پوستر را از سیستم خود انتخاب و بارگذاری نمایید."
          ></WizardTitle>
          <!-- IMAGE UPLOAD -->
          <div
            class="flex flex-1 w-full bg-gray-100 rounded-3xl border-dashed border-4 dash mb-20 justify-center items-center relative overflow-hidden font-[yekan]"
            @drop="handleDrop"
            @dragover="handleDragOver"
          >
            <div
              v-if="imageUrl"
              class="flex flex-col items-center justify-center text-center p-4"
            >
              <img
                :src="imageUrl"
                alt="Uploaded"
                class="max-h-64 rounded-xl mb-4 shadow-md"
              />
              <Check class="text-green-500 w-8 h-8 mb-2 bg-white rounded-full p-2" />
              <p class="font-bold font-[yekanb] text-lg">
                تصویر با موفقیت بارگذاری شده
              </p>
              <p class="text-gray-500 text-sm">
                فایل با موفقیت بارگذاری شد. در صورت نیاز می‌توانید تصویر را
                تغییر دهید.
              </p>
            </div>

            <!-- Default Drop Area -->
            <div v-else class="flex flex-col items-center text-center">
              <CloudUpload class="w-12 h-12 text-gray-400 mb-4" />
              <p class="text-black font-[yekanb] text-xl font-semibold">
                انتخاب و بارگذاری پوستر
              </p>
              <p class="text-gray-500">
                تصویر پیشنهادی با نسبت ۳:۴ و حداقل ابعاد ۹۰۰×۱۲۰۰ پیکسل باشد.
                <br />
                فرمت مجاز: JPG یا PNG | حجم فایل: حداکثر ۲ مگابایت
              </p>
              <input
                type="file"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange"
              />
            </div>
          </div>
        </div>
        <div v-else-if="modal.step === 3">
          <WizardTitle
            big="مدیریت سالن برگزاری"
            small="می‌توانید از سامانه هوشمند استفاده کنید یا فقط اطلاعات سالن را به‌صورت دستی وارد نمایید."
          ></WizardTitle>
        </div>
        <div v-else>
          <WizardTitle
            big="ثبت شرکت‌کنندگان رویداد"
            small="فایل نمونه را دانلود و تکمیل کنید، سپس برای بررسی و ثبت نهایی بارگذاری نمایید."
          ></WizardTitle>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div
        class="absolute justify-between p-4 bottom-0 flex w-full font-[yekan] text-2xl"
      >
        <button
          v-if="modal.step < 4"
          @click="modal.next()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          بعدی
        </button>
        <button
          v-else
          @click="submit()"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          تایید
        </button>
        <button
          @click="modal.prev()"
          :disabled="modal.step === 1"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          برگشت
        </button>
      </div>
    </div>
  </div>
</template>
