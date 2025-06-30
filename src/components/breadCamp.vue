<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Links = {
  name: string;
  link: string;
};

const props = defineProps<{
  links: Links[];
  title: string;
}>();
</script>

<template>
  <h1 class="font-[yekanb] font-bold text-4xl">
    {{ title }}
  </h1>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-if="links.length === 1">
        <BreadcrumbItem>
          <BreadcrumbLink>
            <a :href="links[0].link" class="text-black font-medium">{{
              links[0].name
            }}</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="rotate-180" />
      </template>

      <template v-else>
        <template v-for="(link, index) in links" :key="link.name">
          <BreadcrumbItem>
            <BreadcrumbLink>
              <a
                :href="link.link"
                :class="[
                  index === links.length - 1
                    ? 'text-black font-medium'
                    : 'text-gray-500',
                ]"
              >
                {{ link.name }}
              </a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < links.length - 1" />
        </template>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
