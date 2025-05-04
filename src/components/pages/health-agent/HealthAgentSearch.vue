<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchHealthAgent"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Agente Comunitário de Saúde"
        placeholder="Nome do Agente"
        variant="outlined"
        @keyup="emit('search-health-agent', searchHealthAgent)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-health-agent'])
  const searchHealthAgent = ref(null);
</script>
