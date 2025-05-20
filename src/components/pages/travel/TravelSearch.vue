<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchTravel"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Viagens"
        variant="outlined"
        @keyup="emit('search-travel', searchTravel)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-travel'])
  const searchTravel = ref(null);
</script>
