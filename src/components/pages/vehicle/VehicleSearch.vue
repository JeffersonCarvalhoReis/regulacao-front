<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchVehicle"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Veículos"
        placeholder="Nome do modelo do veiculo"
        variant="outlined"
        @keyup="emit('search-vehicle', searchVehicle)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-vehicle'])
  const searchVehicle = ref(null);
</script>
