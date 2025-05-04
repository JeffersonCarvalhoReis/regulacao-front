<template>
  <v-btn
    class="bg-orange-600 hover:bg-orange-700 text-white"
    :prepend-icon="buttonIcon"
    @click="emit('clear')"
  >
    {{ buttonText }}
  </v-btn>
</template>

<script setup>
  defineProps({
    buttonText: { type: String, default: 'Limpar' },
    buttonIcon: { type: String, default: 'mdi-broom' },
  })
  const emit = defineEmits(['clear'])

</script>

<style lang="scss" scoped>

</style>
