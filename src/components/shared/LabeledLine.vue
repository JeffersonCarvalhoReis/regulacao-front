<template>
  <span class="whitespace-nowrap">{{ `${label}:` }}</span>
    <div
      class="flex-grow pl-1 text-sm leading-[1.5rem] bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),#6b7280_calc(100%-1px))] bg-[length:100%_1.5rem] bg-repeat-y"
    >
      {{ value }}
    </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true},
  value: { type: String, default: ''}
});
</script>
