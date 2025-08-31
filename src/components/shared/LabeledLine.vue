<template>
  <span class="whitespace-nowrap" :class="{'self-end': textField}">{{ `${label}:` }}</span>
  <v-text-field
  v-if="textField"
    density="compact"
    variant="underlined"
    hide-details
    class="pl-2"
  />
  <div
    v-else
    class="flex-grow pl-1 leading-[1.5rem] bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),#6b7280_calc(100%-1px))] bg-[length:100%_1.5rem] bg-repeat-y"
  >
    {{ value }}
  </div>
</template>

<script setup>
  defineProps({
    label: { type: String, required: true },
    value: { type: String, default: '' },
    textField: { type: Boolean, default: false}
  });
</script>

<style scoped>
/* 1) Limpa o estilo do próprio input autofilled */
:deep(.v-field__input:-webkit-autofill),
:deep(.v-field__input:-webkit-autofill:hover),
:deep(.v-field__input:-webkit-autofill:focus),
:deep(.v-field__input:-webkit-autofill:active) {
  -webkit-text-fill-color: #000 !important;                /* cor do texto */
  border: 0 !important;                                    /* remove borda direta */
  outline: none !important;                                /* remove outline do foco */
  transition: background-color 5000s ease-in-out 0s;       /* evita "flash" */
}

/* 2) Remove qualquer box-shadow/borda aplicada pelo pai (.v-field__outline)
   usando o seletor :has() — funciona no Chrome moderno */
:deep(.v-field:has(.v-field__input:-webkit-autofill)) .v-field__outline,
:deep(.v-field:has(.v-field__input:-webkit-autofill:focus)) .v-field__outline {
  border-color: transparent !important;
  box-shadow: none !important;
}

/* 3) fallback se você NÃO quiser usar :has() ou se não funcionar:
   força remover a borda de todos os outlines próximos — menos seguro, use com cuidado */
:deep(.v-field__outline) {
  /* só aplica se não quebrar outras partes visuais do seu form */
  border-color: transparent !important;
  box-shadow: none !important;
}
</style>

