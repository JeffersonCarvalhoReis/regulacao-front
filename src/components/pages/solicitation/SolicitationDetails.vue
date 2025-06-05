<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <BaseSection>
        <InfoGroup title="Dados do paciente">
          <div>Paciente: {{ props.solicitationData.patient }}</div>
          <div>Data de Nascimento: {{ formatDate(props.solicitationData.patient_birth_date) }}</div>
          <div>Idade: {{ calculateAge(props.solicitationData.patient_birth_date) }}</div>
          <div>CPF: {{ props.solicitationData.patient_cpf }}</div>
          <div>SUS: {{ props.solicitationData.patient_cns }}</div>
          <div>Telefone: {{ props.solicitationData.patient_phone }}</div>
          <div>Unidade de Saúde: {{ props.solicitationData.health_unit }}</div>
          <div>Agente Comunitário de Saúde: {{ props.solicitationData.health_agent }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Dados da Solicitação">
          <div v-if="isExam">Exame: {{ props.solicitationData.procedure }}</div>
          <div v-if="!isExam">Consulta com {{ props.solicitationData.specialist }}</div>
          <div v-if=" props.solicitationData.cid " class="uppercase">Cid: {{ props.solicitationData.cid }}</div>
          <div :class="{'text-red-500': isUrgent }">Urgência: {{ isUrgentLabel }}</div>
          <div>Retorno: {{ isReturnLabel }}</div>
          <div>Data da Solicitação: {{ formatDate(props.solicitationData.solicitation_date) }}</div>
          <div>Unidade Solicitante: {{ props.solicitationData.requesting_unit }} </div>
          <div>Motivo: {{ props.solicitationData.reason }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Dados do Cadastro">
          <div>Cadastrado por {{ props.solicitationData.created_by }}</div>
          <div>Data de Cadastrado {{ formatDate(props.solicitationData.entry_date) }}</div>
        </InfoGroup>
      </BaseSection>
      <div class="flex justify-end">
        <v-btn
          v-if="attachment"
          prepend-icon="mdi-paperclip"
          color="success"
          @click="openAttachment = true"
         >
          Anexo
          <v-tooltip
          activator="parent"
          >
          {{ attachmentText }}
          </v-tooltip>
        </v-btn>

        <v-btn
          v-else
          prepend-icon="mdi-paperclip-off"
          color="error"
        >
        Anexo
        <v-tooltip
        activator="parent"
        >
        {{ attachmentText }}
        </v-tooltip>
        </v-btn>
      </div>
    </v-card-text>
  </base-card>
  <v-dialog v-model="openAttachment">
  <BaseCard title="Anexo" @close="openAttachment = false">
    <v-card-text class="flex justify-center items-end h-full">
      <iframe
        v-if="isPDF(attachment)"
        :src="attachment"
        width="100%"
        height="500px"
        class="rounded-lg border"
      ></iframe>
      <img
        v-else-if="isImage(attachment)"
        :src="attachment"
        style="max-width: 100%; max-height: 800px; display: block; margin: auto;"
        class="rounded-lg border"
    />
  </v-card-text>

    <div class="flex justify-end gap-4 m-4">
      <v-btn
        prepend-icon="mdi-download"
        color="primary"
        @click="handleDownloadFile"
      >
        Baixar
        <v-tooltip activator="parent">Baixar</v-tooltip>
      </v-btn>
      <v-btn
      prepend-icon="mdi-printer"
      color="success"
      @click="handlePrint"
    >
      Imprimir
      <v-tooltip activator="parent">Imprimir</v-tooltip>
    </v-btn>
  </div>
  </BaseCard>
</v-dialog>
</template>

<script setup>
import { useBooleanLabel } from '@/composables/utils/useBooleanLabel';
import { useDownloadFile } from '@/composables/utils/useDownloadFile';
import { useFormatDate } from '@/composables/utils/useFormatDate';

  const props = defineProps({
    solicitationData: { type: Object, default: () => ({}) },
  });

  const emit = defineEmits(['close']);

  const { formatDate } = useFormatDate();
  const { printContent } = usePrintIframe();
  const { downloadFile } = useDownloadFile();
  const { booleanToLabel } = useBooleanLabel();
  const { calculateAge } = useCalculateAge();

  const isExam = computed(() => props.solicitationData.solicitation_type === 'exam')
  const isUrgentLabel = computed(() => booleanToLabel(props.solicitationData.is_urgent))
  const isUrgent = computed(() => !!props.solicitationData.is_urgent)
  const isReturnLabel = computed(() => booleanToLabel(props.solicitationData.is_first_time, 'Não', 'Sim'))
  const attachmentText = computed(() => props.solicitationData.attachment ? 'Clique para ver o arquivo anexado' : 'Não há arquivo anexado nessa solicitação')
  const title = computed(() => `Solicitação: ${props.solicitationData.procedure || props.solicitationData.specialist}`)
  const openAttachment = ref(false);
  const attachment = computed(() => props.solicitationData.attachment)
  const attachmentRef = ref(null)

  const handlePrint = ()  => {
    printContent(attachmentRef)
  }

  const handleDownloadFile = () => {
    downloadFile(attachment.value)
  }

  const isPDF = (url) => {
    return url?.toLowerCase().endsWith('.pdf');
  };

  const isImage = (url) => {
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url || '');
  };

</script>
