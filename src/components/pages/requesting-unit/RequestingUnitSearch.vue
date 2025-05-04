<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchRequestingUnit"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Unidades Solicitantes"
        placeholder="Nome da Unidade Solicitante"
        variant="outlined"
        @keyup="emit('search-requesting-unit', searchRequestingUnit)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-requesting-unit'])
  const searchRequestingUnit = ref(null);
</script>
