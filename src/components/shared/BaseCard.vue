<template>
  <v-card
    class="border-t-6 border-ita-light-blue w-full mx-auto sm:max-w-350 base-card"
  >
    <v-card-title
      class="flex items-center justify-between gap-3 text-lg sm:text-2xl shrink-0 sticky-title"
    >
      <span class="min-w-0 wrap-break-word">
        {{ title }}
      </span>
      <v-btn
        class="cursor-pointer hover:bg-gray-200 shrink-0 transition-all hover:scale-105 active:scale-95 duration-300 rounded-full"
        flat
        icon
        aria-label="Fechar"
        @click="emit('close')"
      >
        <v-icon> mdi-close </v-icon>
        <v-tooltip activator="parent"> Fechar </v-tooltip>
      </v-btn>
    </v-card-title>
    <v-divider class="shrink-0" />

    <!-- Só este container rola; é isso que dá ao título "algo por baixo"
         para o sticky funcionar. Sem esse wrapper, quem decide o scroll
         é o overlay do v-dialog, e o sticky depende do conteúdo ser alto
         o bastante para precisar rolar. -->
    <div class="card-scroll-area">
      <slot />
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
});
const emit = defineEmits(["close"]);
</script>

<style scoped>
/* Estrutura de coluna em qualquer tamanho de tela: cabeçalho fixo no
   topo, divisor fixo, e só a área de conteúdo rola. */
.base-card {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.sticky-title {
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgb(var(--v-theme-surface));
}

.card-scroll-area {
  overflow-y: auto;
  min-height: 0; /* necessário em flex para o filho poder encolher e rolar */
}

/* No celular o cartão ocupa a tela toda (edge-to-edge) */
@media (max-width: 767px) {
  .base-card {
    max-height: 100%;
    border-radius: 0;
  }
}
</style>
