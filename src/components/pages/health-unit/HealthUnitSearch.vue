<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchHealthUnit"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Unidade de Saúde"
        placeholder="Nome da Unidade"
        variant="outlined"
        @keyup="emit('search-health-unit', searchHealthUnit)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-health-unit'])
  const searchHealthUnit = ref(null);
</script>
