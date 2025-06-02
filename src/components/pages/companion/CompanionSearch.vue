<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchCompanion"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar"
        placeholder="Nome, SUS ou CPF"
        variant="outlined"
        @keyup="emit('search-companion', searchCompanion)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-companion'])
  const searchCompanion = ref(null);
</script>
