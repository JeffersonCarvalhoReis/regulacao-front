<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <BaseSection>
        <InfoGroup title="Dados do paciente">
          <div class="flex gap-10">
            <div>
              <div>
                Paciente: {{ props.appointmentData.solicitation.patient }}
              </div>
              <div>
                Mãe:
                {{ props.appointmentData.solicitation.patient_mother_name }}
              </div>
              <div>
                Data de Nascimento:
                {{
                  formatDate(
                    props.appointmentData.solicitation.patient_birth_date,
                  )
                }}
              </div>
              <div>
                Idade:
                {{
                  calculateAge(
                    props.appointmentData.solicitation.patient_birth_date,
                  )
                }}
              </div>
              <div>
                CPF: {{ props.appointmentData.solicitation.patient_cpf }}
              </div>
              <div>
                SUS: {{ props.appointmentData.solicitation?.patient_cns ?? "" }}
              </div>
            </div>
            <div>
              <div>
                Telefone: {{ props.appointmentData.solicitation.patient_phone }}
              </div>
              <div>
                Agente Comunitário de Saúde:
                {{ props.appointmentData.solicitation.health_agent }}
              </div>
              <div>
                Unidade de Saúde:
                {{ props.appointmentData.solicitation.health_unit }}
              </div>
            </div>
          </div>
        </InfoGroup>
      </BaseSection>
      <BaseSection>
        <InfoGroup title="Dados do Agendamento">
          <div class="flex gap-10">
            <div>
              <div>
                Data da Consulta: {{ formatDate(props.appointmentData.date) }}
              </div>
              <div>Hora da Consulta: {{ props.appointmentData.time }}</div>
              <div>
                Status do Agendamento:
                {{ status(props.appointmentData.status) }}
              </div>
            </div>
            <div>
              <div>
                Unidade Prestadora: {{ props.appointmentData.provider_unit }}
              </div>
              <div>Médico Responsável: {{ props.appointmentData.doctor }}</div>
            </div>
            <div>
              <div>
                Data do Agendamento: {{ props.appointmentData.created_at }}
              </div>
              <div>Agendado por: {{ props.appointmentData.scheduled_by }}</div>
            </div>
          </div>
        </InfoGroup>
      </BaseSection>
      <BaseSection>
        <InfoGroup title="Dados da Solicitação">
          <div class="flex gap-10">
            <div>
              <div v-if="isExam">
                Exame: {{ props.appointmentData.solicitation.procedure }}
              </div>
              <div v-if="!isExam">
                Consulta com {{ props.appointmentData.solicitation.specialist }}
              </div>
              <div>
                Unidade Solicitante:
                {{ props.appointmentData.solicitation.requesting_unit }}
              </div>
              <div>
                Data da Solicitação:
                {{
                  formatDate(
                    props.appointmentData.solicitation.solicitation_date,
                  )
                }}
              </div>
            </div>
            <div>
              <div :class="{ 'text-red-500': isUrgent }">
                Urgência: {{ isUrgentLabel }}
              </div>
              <div>Retorno: {{ isReturnLabel }}</div>
              <div>Motivo: {{ props.appointmentData.solicitation.reason }}</div>
            </div>
            <div>
              <div>
                Cadastrado por
                {{ props.appointmentData.solicitation.created_by }}
              </div>
              <div>
                Data de Cadastrado
                {{ formatDate(props.appointmentData.solicitation.entry_date) }}
              </div>
            </div>
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
  appointmentData: { type: Object, default: () => ({}) },
});

const { formatDate } = useFormatDate();
const { booleanToLabel } = useBooleanLabel();
const { calculateAge } = useCalculateAge();

const emit = defineEmits(["close"]);
const title = "Agendamento";

const isExam = computed(
  () => props.appointmentData.solicitation.solicitation_type === "exam",
);
const isUrgentLabel = computed(() =>
  booleanToLabel(props.appointmentData.solicitation.is_urgent),
);
const isUrgent = computed(() => !!props.appointmentData.solicitation.is_urgent);
const isReturnLabel = computed(() =>
  booleanToLabel(
    props.appointmentData.solicitation.is_first_time,
    "Não",
    "Sim",
  ),
);
const attachmentText = computed(() =>
  props.appointmentData.solicitation.attachment
    ? "Clique para ver o arquivo anexado"
    : "Não há arquivo anexado nessa solicitação",
);
const attachment = computed(
  () => props.appointmentData.solicitation.attachment,
);
const attachmentRef = ref(null);

const status = (status) => {
  const statusMap = {
    scheduled: "Agendado",
    realized: "Realizado",
    "not-present": "Não Compareceu",
    pending: "Pendente",
  };
  return statusMap[status] || "Desconhecido";
};
</script>
