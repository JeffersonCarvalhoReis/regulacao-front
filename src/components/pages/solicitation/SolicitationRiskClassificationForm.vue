<template>
  <base-card title="Classificar Risco" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="grid grid-cols-1 gap-4">
          <v-select
            v-model="risk_classification"
            class="required"
            density="compact"
            :error-messages="errors.risk_classification"
            item-title="label"
            item-value="value"
            :items="riskClassificationOptions"
            label="Classificação de Risco"
            variant="outlined"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-icon :color="item.color" icon="mdi-circle" size="small" />
                </template>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <v-icon
                :color="item.color"
                icon="mdi-circle"
                size="small"
                class="mr-2"
              />
              {{ item.label }}
            </template>
          </v-select>

          <!-- Card explicativo com a cor correspondente -->
          <div
            v-if="selectedRiskOption"
            class="rounded-lg p-4 text-white flex items-start gap-3"
            :style="{ backgroundColor: selectedRiskOption.hex }"
          >
            <v-icon color="white" icon="mdi-alert-decagram" size="28" />
            <div>
              <div class="font-bold uppercase text-sm tracking-wide">
                {{ selectedRiskOption.title }}
              </div>
              <div class="text-sm">
                {{ selectedRiskOption.description }}
              </div>
            </div>
          </div>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="flex justify-end items-end mx-4 mb-4">
      <v-spacer />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useSolicitationApi } from "@/composables/modules/useSolicitationModule";
import { useField, useForm } from "vee-validate";
import { computed } from "vue";
import * as yup from "yup";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const { classify } = useSolicitationApi();
const { showFeedback } = useSweetAlertFeedback();

const emit = defineEmits(["close", "save"]);

const riskClassificationOptions = [
  {
    label: "Emergência",
    value: "red",
    color: "red",
    hex: "#ec1f25",
    title: "Emergência",
    description:
      "Caso gavsíssimo, com necessidade de atendimento imediato e risco de morte.",
  },
  {
    label: "Urgente",
    value: "yellow",
    color: "#fecb0a",
    hex: "#fecb0a",
    title: "Urgência",
    description:
      "Caso de gravidade moderada, necessidade de atendimento médico, sem risco imediato.",
  },
  {
    label: "Pouco urgente",
    value: "green",
    color: "green",
    hex: "#007e49",
    title: "Pouca Urgência",
    description:
      "Caso para atendimento preferencial nas unidades de atenção básica.",
  },
  {
    label: "Não urgente",
    value: "blue",
    color: "blue",
    hex: "#264474",
    title: "Não Urgência",
    description:
      "Caso para atendimento na unidade de saúde mais próxima da residência. Atendimento de acordo com o horário de chegada",
  },
];

const schema = yup.object({
  risk_classification: yup
    .string()
    .trim()
    .required("Classificação de risco é obrigatória")
    .oneOf(
      ["red", "yellow", "green", "blue"],
      "Classificação de risco inválida",
    ),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    risk_classification: props.modelValue?.risk_classification ?? null,
  },
});

const { value: risk_classification } = useField("risk_classification");

const selectedRiskOption = computed(() =>
  riskClassificationOptions.find(
    (option) => option.value === risk_classification.value,
  ),
);

const onSubmit = handleSubmit(async (value) => {
  const response = await showFeedback(() => classify(props.modelValue, value));
  if (response) {
    emit("save", { ...props.modelValue, ...(response.data ?? value) });
    emit("close");
  }
});
</script>
