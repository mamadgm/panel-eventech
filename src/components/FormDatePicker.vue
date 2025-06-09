<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { CalendarDays } from 'lucide-vue-next'
import { toRefs } from 'vue'

const props = defineProps<{
  label: string
  id: string
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
</script>

<template>
  <div>
    <label :for="id" class="block mb-1 text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <Popover>
      <PopoverTrigger as-child>
        <div class="relative">
          <Input
            :id="id"
            :value="modelValue"
            readonly
            class="w-full cursor-pointer pr-10"
            placeholder="انتخاب زمان"
          />
          <CalendarDays class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <DatePicker
          v-model="modelValue"
          type="datetime"
          format="YYYY-MM-DD HH:mm:00"
          display-format="HH:mm:00 jYYYY-jMM-jDD"
          @update:modelValue="emit('update:modelValue', $event)"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
