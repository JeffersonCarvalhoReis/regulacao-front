<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchDoctor"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Médicos"
        placeholder="Nome do Médico"
        variant="outlined"
        @keyup="emit('search-doctor', searchDoctor)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-doctor'])
  const searchDoctor = ref(null);
</script>
