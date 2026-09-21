<template>
  <base-card title="Demanda Reprimida" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <p class="text-sm text-gray-600">
        Gere uma planilha com todas as solicitações que ainda não possuem
        agendamento, filtrando por especialidade (consultas) ou por
        procedimento (exames).
      </p>
      <v-radio-group v-model="type" density="compact" hide-details inline>
        <v-radio label="Especialista" value="specialist" />
        <v-radio label="Procedimento" value="procedure" />
      </v-radio-group>

      <v-autocomplete
        v-if="type === 'specialist'"
        v-model="selectedIds"
        chips
        closable-chips
        density="compact"
        :error-messages="errorMessage"
        item-title="name"
        item-value="id"
        :items="sortedSpecialists"
        label="Especialidades"
        :loading="specialistLoading"
        multiple
        variant="outlined"
      />
      <v-autocomplete
        v-if="type === 'procedure'"
        v-model="selectedIds"
        chips
        closable-chips
        density="compact"
        :error-messages="errorMessage"
        item-title="name"
        item-value="id"
        :items="sortedProcedures"
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
import { useProcedureApi } from "@/composables/modules/useProcedureModule";
import { useRepressedDemandApi } from "@/composables/modules/useRepressedDemandModule";
import { useSpecialistApi } from "@/composables/modules/useSpecialistModule";

const emit = defineEmits(["close"]);

const { showFeedbackLoading } = useSweetAlertFeedback();
const {
  data: procedureData,
  params: procedureParams,
  refetch: procedureRefetch,
  loadingList: procedureLoading,
} = useProcedureApi();
const {
  data: specialistData,
  params: specialistParams,
  refetch: specialistRefetch,
  loadingList: specialistLoading,
} = useSpecialistApi();
const { exportRepressedDemand, loading: exportLoading } =
  useRepressedDemandApi();

const type = ref("specialist");
const selectedIds = ref([]);
const errorMessage = ref(null);

const sortByName = (items) =>
  [...(items || [])].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "pt-BR", { sensitivity: "base" }),
  );

const sortedProcedures = computed(() => sortByName(procedureData.value));
const sortedSpecialists = computed(() => sortByName(specialistData.value));

// Ao trocar entre Especialista/Procedimento, limpa a seleção anterior,
// já que os itens do select são completamente diferentes.
watch(type, () => {
  selectedIds.value = [];
  errorMessage.value = null;
});

onMounted(async () => {
  procedureParams.value.per_page = -1;
  specialistParams.value.per_page = -1;
  await nextTick();
  await Promise.all([procedureRefetch(), specialistRefetch()]);
});

const handleExport = async () => {
  if (!selectedIds.value.length) {
    errorMessage.value =
      type.value === "procedure"
        ? "Selecione ao menos um procedimento/exame"
        : "Selecione ao menos uma especialidade";
    return;
  }
  errorMessage.value = null;

  await showFeedbackLoading(() =>
    exportRepressedDemand(type.value, selectedIds.value),
  );
};
</script>
