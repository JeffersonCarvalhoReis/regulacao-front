<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchProviderUnit"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Unidades Prestadoras"
        placeholder="Nome da Unidade Prestadora"
        variant="outlined"
        @keyup="emit('search-provider-unit', searchProviderUnit)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-provider-unit'])
  const searchProviderUnit = ref(null);
</script>
