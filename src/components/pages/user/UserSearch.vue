<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchUser"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Usuários"
        placeholder="Nome do Usuário"
        variant="outlined"
        @keyup="emit('search-user', searchUser)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-user'])
  const searchUser = ref(null);
</script>
