<template>
  <v-btn
    class="bg-ita-green hover:bg-green-600 text-white"
    :prepend-icon="props.buttonIcon"
    @click="emit('filters')"
  >
    {{ buttonText }}
  </v-btn>
</template>
<script setup>
  const props = defineProps({
    buttonText: { type: String, default: 'Filtros' },
    buttonIcon: { type: String, default: 'mdi-filter-variant' },
  })
  const emit = defineEmits(['filters'])
</script>
