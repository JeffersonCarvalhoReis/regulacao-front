<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchSpecialist"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Especialidades"
        placeholder="Nome da Especialidade"
        variant="outlined"
        @keyup="emit('search-specialist', searchSpecialist)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-specialist'])
  const searchSpecialist = ref(null);
</script>
