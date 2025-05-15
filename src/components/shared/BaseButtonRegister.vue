<template>
  <v-btn
    class="bg-ita-blue hover:bg-blue-700 text-white"
    :prepend-icon="buttonIcon"
    @click="emit('register')"
  >
    {{ buttonText }}
  </v-btn>
</template>
<script setup>
 const props = defineProps({
    buttonText: { type: String, default: 'Cadastrar' },
    buttonIcon: { type: String, default: 'mdi-plus' },
  })
  const emit = defineEmits(['register'])
</script>
