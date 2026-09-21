<template>
  <base-card
    title="Exportar Solicitações Sem Agendamento"
    @close="emit('close')"
  >
    <v-card-text class="flex flex-col gap-2">
      <p class="text-sm text-gray-600">
        Selecione um ou mais procedimentos/exames para gerar uma planilha com
        todas as solicitações desses exames que ainda não possuem agendamento.
      </p>
      <v-autocomplete
        v-model="selectedProcedureIds"
        chips
        closable-chips
        density="compact"
        :error-messages="errorMessage"
        item-title="name"
        item-value="id"
        :items="procedureData"
        label="Procedimentos/Exames"
        :loading="procedureLoading"
        multiple
        variant="outlined"
      />
    </v-card-text>
    <v-card-actions class="flex justify-end mx-4 mb-4">
      <v-btn
        class="bg-ita-green hover:bg-green-600 text-white"
        :disabled="exportLoading"
        :loading="exportLoading"
        prepend-icon="mdi-microsoft-excel"
        @click="handleExport"
      >
        Gerar Planilha
      </v-btn>
    </v-card-actions>
  </base-card>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useSolicitationExportApi } from "@/composables/modules/useSolicitationExportModule";
import { useSpecialistApi } from "@/composables/modules/useSpecialistModule";

const emit = defineEmits(["close"]);

const { showFeedbackLoading } = useSweetAlertFeedback();
const {
  data: procedureData,
  params: procedureParams,
  refetch: procedureRefetch,
  loadingList: procedureLoading,
} = useSpecialistApi();
const { exportSolicitations, loading: exportLoading } =
  useSolicitationExportApi();

const selectedProcedureIds = ref([]);
const errorMessage = ref(null);

onMounted(async () => {
  procedureParams.value.per_page = -1;
  await nextTick();
  await procedureRefetch();
});

const handleExport = async () => {
  if (!selectedProcedureIds.value.length) {
    errorMessage.value = "Selecione ao menos um procedimento/exame";
    return;
  }
  errorMessage.value = null;

  await showFeedbackLoading(() =>
    exportSolicitations(selectedProcedureIds.value),
  );
};
</script>
