<template>
  <div class="pb-8 pr-5">
    <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Grupo" },
});
</script>
