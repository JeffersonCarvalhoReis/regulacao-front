<template>
  Avaliação de Risco:
  <v-alert
    v-if="riskClassificationData"
    :color="riskInfo?.color"
    :text="riskInfo?.label"
    density="compact"
    variant="tonal"
  />
  <v-alert v-else density="compact" variant="tonal"> Não avaliado </v-alert>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  riskClassificationData: { type: String, default: null },
});

// Mesmas opções usadas em SolicitationRiskClassificationForm.vue
const riskClassificationOptions = [
  {
    label:
      "Muito urgente: Caso grave e de risco significativo de evoluir para morte. Atendimento urgente",
    value: "red",
    color: "red",
  },
  {
    label:
      "Urgente: Caso de gravidade moderada, necessidade de atendimento médico, sem risco imediato",
    value: "yellow",
    color: "amber",
  },
  {
    label:
      "Pouco urgente: Caso para atendimento preferencial nas unidades de atenção básica",
    value: "green",
    color: "green",
  },
];

const riskInfo = computed(() =>
  riskClassificationOptions.find(
    (option) => option.value === props.riskClassificationData,
  ),
);
</script>
