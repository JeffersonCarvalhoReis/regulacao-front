<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <BaseSection>
        <InfoGroup title="Dados do paciente">
          <div>Paciente: {{ props.solicitationData.patient }}</div>
          <div>Mãe: {{ props.solicitationData.patient_mother_name }}</div>
          <div>
            Data de Nascimento:
            {{ formatDate(props.solicitationData.patient_birth_date) }}
          </div>
          <div>
            Idade: {{ calculateAge(props.solicitationData.patient_birth_date) }}
          </div>
          <div>CPF: {{ props.solicitationData.patient_cpf }}</div>
          <div>SUS: {{ props.solicitationData.patient_cns }}</div>
          <div>Telefone: {{ props.solicitationData.patient_phone }}</div>
          <div>Unidade de Saúde: {{ props.solicitationData.health_unit }}</div>
          <div>
            Agente Comunitário de Saúde:
            {{ props.solicitationData.health_agent }}
          </div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Dados da Solicitação">
          <div v-if="isExam">Exame: {{ props.solicitationData.procedure }}</div>
          <div v-if="!isExam">
            Consulta com {{ props.solicitationData.specialist }}
          </div>
          <div v-if="props.solicitationData.cid" class="uppercase">
            Cid: {{ props.solicitationData.cid }}
          </div>
          <div :class="{ 'text-red-500': isUrgent }">
            Urgência: {{ isUrgentLabel }}
          </div>
          <div>Retorno: {{ isReturnLabel }}</div>
          <div>
            Data da Solicitação:
            {{ formatDate(props.solicitationData.solicitation_date) }}
          </div>
          <div>
            Unidade Solicitante: {{ props.solicitationData.requesting_unit }}
          </div>
          <div>Motivo: {{ props.solicitationData.reason }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Dados do Cadastro">
          <div>Cadastrado por {{ props.solicitationData.created_by }}</div>
          <div>
            Data de Cadastrado
            {{ formatDate(props.solicitationData.entry_date) }}
          </div>
        </InfoGroup>
      </BaseSection>
      <div class="flex justify-end">
        <AttachmentButton :attachment="attachment" />
      </div>
    </v-card-text>
  </base-card>
</template>

<script setup>
import { useBooleanLabel } from "@/composables/utils/useBooleanLabel";
import { useFormatDate } from "@/composables/utils/useFormatDate";

const props = defineProps({
  solicitationData: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close"]);

const { formatDate } = useFormatDate();
const { booleanToLabel } = useBooleanLabel();
const { calculateAge } = useCalculateAge();

const isExam = computed(
  () => props.solicitationData.solicitation_type === "exam",
);
const isUrgentLabel = computed(() =>
  booleanToLabel(props.solicitationData.is_urgent),
);
const isUrgent = computed(() => !!props.solicitationData.is_urgent);
const isReturnLabel = computed(() =>
  booleanToLabel(props.solicitationData.is_first_time, "Não", "Sim"),
);
const attachmentText = computed(() =>
  props.solicitationData.attachment
    ? "Clique para ver o arquivo anexado"
    : "Não há arquivo anexado nessa solicitação",
);
const title = computed(
  () =>
    `Solicitação: ${props.solicitationData.procedure || props.solicitationData.specialist}`,
);
const attachment = computed(() => props.solicitationData.attachment);
</script>
