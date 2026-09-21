<template>
  <v-card
    class="border-t-6 border-ita-light-blue w-full mx-auto sm:max-w-350 base-card-mobile"
  >
    <v-card-title
      class="flex items-center justify-between gap-3 text-lg sm:text-2xl"
    >
      <span class="min-w-0 break-words">
        {{ title }}
      </span>
      <v-btn
        class="cursor-pointer hover:bg-gray-200 shrink-0 transition-all hover:scale-105 active:scale-95 duration-300 rounded-full"
        flat
        icon
        aria-label="Fechar"
        @click="emit('close')"
      >
        <v-icon>
          mdi-close
        </v-icon>
        <v-tooltip activator="parent">
          Fechar
        </v-tooltip>
      </v-btn>
    </v-card-title>
    <v-divider class="mb-4" />
    <slot />
  </v-card>
</template>
<script setup>
  defineProps({
    title: { type: String, required: true },
  })
  const emit = defineEmits(['close'])
</script>

<style scoped>
/* No celular o cartão ocupa a tela toda: cabeçalho fixo, conteúdo rolando */
@media (max-width: 767px) {
  .base-card-mobile {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    border-radius: 0;
  }

  .base-card-mobile :deep(> .v-card-title) {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgb(var(--v-theme-surface));
  }
}
</style>
