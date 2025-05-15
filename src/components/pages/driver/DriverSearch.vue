<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchDriver"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Motoristas"
        placeholder="Nome do motorista"
        variant="outlined"
        @keyup="emit('search-driver', searchDriver)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-driver'])
  const searchDriver = ref(null);
</script>
