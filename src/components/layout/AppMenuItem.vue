<!-- AppMenuItem.vue -->
<template>
  <v-list-item :active="active" active-class="bg-blue-100" :class="classes" :to="to">
    <template #prepend>
      <v-icon :class="active ? 'text-ita-blue ' : ''">{{ icon }}</v-icon>
    </template>
    <v-list-item-title :class="active ? 'text-ita-blue ' : ''">
      {{ title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script setup>
  defineProps({
    to: Object,
    active: Boolean,
    icon: String,
    title: String,
    classes: {
      type: String,
      default: 'hover:bg-blue-100 hover:text-ita-blue text-slate-700',
    },
  });
</script>
