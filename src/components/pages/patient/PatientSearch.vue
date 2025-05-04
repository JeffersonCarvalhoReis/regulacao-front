<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchPatient"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Paciente"
        placeholder="Nome, SUS ou CPF"
        variant="outlined"
        @keyup="emit('search-patient', searchPatient)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-patient'])
  const searchPatient = ref(null);
</script>
