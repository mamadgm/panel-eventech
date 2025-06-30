<script setup lang="ts">
import BoxCircle from "@/components/boxCircle.vue";
import BreadCamp from "@/components/breadCamp.vue";
import { UserCircle } from "lucide-vue-next";
import { Calendar } from "lucide-vue-next";
import chartComp from "@/components/chartComp.vue";
import { Venus } from "lucide-vue-next";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";
</script>

<template>
  <div class="h-8 mt-8">
    <BreadCamp
      title="داشبورد"
      :links="[{ name: 'داشبورد', link: '2' }]"
    ></BreadCamp>
  </div>

  <div class="mr-20 ml-20">
    <div class="grid grid-cols-2 w-full p-4 mt-20 gap-4">
      <BoxCircle
        number="2576"
        title="کل شرکت‌کننده‌ها"
        desc="۲۷ درصد رشد نسبت به ماه گذشته"
        :icon="UserCircle"
        :badge="true"
      ></BoxCircle>
      <BoxCircle
        number="47"
        title="رویدادهای برگزارشده"
        desc="۷ رویداد جدید در تیرماه ایجاد شده"
        :icon="Calendar"
      ></BoxCircle>
    </div>

    <div class="grid grid-cols-4 h-72 p-4 gap-4">
      <div class="col-span-3 grid grid-cols-3 bg-gray-100 rounded-[40px]">
        <div class="col-span-1">
          <div class="flex flex-col justify-between h-full p-8">
            <h1 class="font-[yekanb] text-xl">
              نرخ تبدیل<br />
              ثبت نام به حضور
            </h1>
            <div class="">
              <div class="flex items-center gap-2">
                <div class="rounded-4xl w-6 h-3 bg-green-500"></div>
                <h1 class="font-[yekanb] text-xl">2150</h1>
              </div>
              <h1 class="font-[yekan] text-gray-400">
                افراد حاضر شده پس از ثبت نام
              </h1>

              <div class="flex items-center gap-2">
                <div class="rounded-4xl w-6 h-3 bg-red-500"></div>
                <h1 class="font-[yekanb] text-xl">396</h1>
              </div>
              <h1 class="font-[yekan] text-gray-400">
                افراد حاضر نشده پس از ثبت نام
              </h1>
            </div>
          </div>
        </div>
        <div class="col-span-2 flex items-center justify-center">
          <div class="p-4 w-96 h-72 overflow-hidden">
            <chartComp :value="20" class="overflow-hidden" />
          </div>
        </div>
      </div>
      <div
        class="col-span-1 bg-yellow-100 rounded-[40px] h-full flex flex-col items-center justify-center"
      >
        <Venus
          class="bg-white rounded-full flex items-center justify-center h-32 w-32 p-4"
        ></Venus>
        <div class="flex flex-col mt-2 items-center">
          <h1 class="font-[yekanb] text-2xl">معصومه رضاییان</h1>
          <h2 class="font-[yekan] text-gray-500">
            فعال ترین کاربر رویدادهای شما
          </h2>
          <router-link to="2" class="text-blue-400 underline"
            >مشاهده همه</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
