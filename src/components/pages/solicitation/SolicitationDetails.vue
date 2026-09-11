<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <BaseSection>
        <div class="flex gap-x-2">
          <InfoGroup title="Dados do paciente" class="flex-1">
            <div>Paciente: {{ localData.patient }}</div>
            <div>Mãe: {{ localData.patient_mother_name }}</div>
            <div>
              Data de Nascimento:
              {{ formatDate(localData.patient_birth_date) }}
            </div>
            <div>Idade: {{ calculateAge(localData.patient_birth_date) }}</div>
            <div>CPF: {{ localData.patient_cpf }}</div>
            <div>SUS: {{ localData?.patient_cns ?? "" }}</div>
            <div>Telefone: {{ localData.patient_phone }}</div>
            <div>Unidade de Saúde: {{ localData.health_unit }}</div>
            <div>
              Agente Comunitário de Saúde:
              {{ localData.health_agent }}
            </div>
          </InfoGroup>
          <v-divider vertical />
          <InfoGroup title="Dados da Solicitação" class="flex-1">
            <div v-if="isExam">Exame: {{ localData.procedure }}</div>
            <div v-if="!isExam">Consulta com {{ localData.specialist }}</div>
            <div v-if="localData.cid" class="uppercase">
              Cid: {{ localData.cid }}
            </div>
            <div :class="{ 'text-red-500': isUrgent }">
              Urgência: {{ isUrgentLabel }}
            </div>
            <div>Retorno: {{ isReturnLabel }}</div>
            <div>
              Data da Solicitação:
              {{ formatDate(localData.solicitation_date) }}
            </div>
            <div>Unidade Solicitante: {{ localData.requesting_unit }}</div>
            <div>Motivo: {{ localData.reason }}</div>
            <SolicitationRiskClassificationAlert
              v-if="isUrgent"
              :risk-classification-data="localData.risk_classification"
            />
          </InfoGroup>
          <v-divider vertical />
          <InfoGroup title="Dados do Cadastro" class="flex-1">
            <div>Cadastrado por {{ localData.created_by }}</div>
            <div>
              Data de Cadastrado
              {{ formatDate(localData.entry_date) }}
            </div>
          </InfoGroup>
        </div>
      </BaseSection>
      <div
        :class="`flex gap-2 ${doctorRole ? 'justify-between' : 'justify-end'}`"
      >
        <div v-if="doctorRole">
          <base-button-register
            buttonText="Classificação de risco"
            buttonIcon="mdi-clipboard-pulse"
            @register="openRiskClassificationForm = true"
          />
        </div>
        <AttachmentButton :attachment="attachment" />
      </div>
    </v-card-text>
  </base-card>
  <v-dialog v-model="openRiskClassificationForm">
    <SolicitationRiskClassificationForm
      :model-value="localData"
      @close="openRiskClassificationForm = false"
      @save="handleRiskClassificationSave"
    />
  </v-dialog>
</template>

<script setup>
import SolicitationRiskClassificationForm from "@/components/pages/solicitation/SolicitationRiskClassificationForm.vue";
import { useBooleanLabel } from "@/composables/utils/useBooleanLabel";
import { useFormatDate } from "@/composables/utils/useFormatDate";
import { useMeStore } from "@/stores/me";

const props = defineProps({
  solicitationData: { type: Object, default: () => ({}) },
});

const doctorRole = computed(() => ["regulation_doctor"].includes(role));
const role = useMeStore().role;
const openRiskClassificationForm = ref(false);

const emit = defineEmits(["close", "update-solicitation"]);

const { formatDate } = useFormatDate();
const { booleanToLabel } = useBooleanLabel();
const { calculateAge } = useCalculateAge();

// Cópia local e reativa dos dados, para refletir alterações (ex.: classificação
// de risco) imediatamente na tela, sem depender de recarregar a página.
const localData = ref({ ...props.solicitationData });
watch(
  () => props.solicitationData,
  (newValue) => {
    localData.value = { ...newValue };
  },
);

const handleRiskClassificationSave = (updatedSolicitation) => {
  localData.value = { ...localData.value, ...updatedSolicitation };
  emit("update-solicitation", localData.value);
};

const isExam = computed(() => localData.value.solicitation_type === "exam");
const isUrgentLabel = computed(() => booleanToLabel(localData.value.is_urgent));
const isUrgent = computed(() => !!localData.value.is_urgent);
const isReturnLabel = computed(() =>
  booleanToLabel(localData.value.is_first_time, "Não", "Sim"),
);
const attachmentText = computed(() =>
  localData.value.attachment
    ? "Clique para ver o arquivo anexado"
    : "Não há arquivo anexado nessa solicitação",
);
const title = computed(
  () =>
    `Solicitação: ${localData.value.procedure || localData.value.specialist}`,
);
const attachment = computed(() => localData.value.attachment);
</script>
