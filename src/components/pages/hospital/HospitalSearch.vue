<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchHospital"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Hospitais"
        placeholder="Nome do hospital"
        variant="outlined"
        @keyup="emit('search-hospital', searchHospital)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-hospital'])
  const searchHospital = ref(null);
</script>
