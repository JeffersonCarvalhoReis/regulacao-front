<template>
  <span>
  {{ label }}:
  </span>
  <div class="flex-grow border-b border-gray-300 pl-1"> {{ value }}</div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true},
  value: { type: String, default: ''}
});
</script>
