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
      "Emergência: Caso gravíssimo, com necessidade de atendimento imediato e risco de morte.",
    value: "red",
    color: "#ec1f25",
  },
  {
    label:
      "Urgente: Caso de gravidade moderada, necessidade de atendimento médico, sem risco imediato",
    value: "yellow",
    color: "#fecb0a",
  },
  {
    label:
      "Pouco urgente: Caso para atendimento preferencial nas unidades de atenção básica",
    value: "green",
    color: "#007e49",
  },
];

const riskInfo = computed(() =>
  riskClassificationOptions.find(
    (option) => option.value === props.riskClassificationData,
  ),
);
</script>
