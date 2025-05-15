<template>
  <v-btn
    class="bg-ita-yellow hover:bg-yellow-400 text-white"
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
