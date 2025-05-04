<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchProcedure"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Procedimentos"
        placeholder="Nome do procedimento"
        variant="outlined"
        @keyup="emit('search-procedure', searchProcedure)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-procedure'])
  const searchProcedure = ref(null);
</script>
