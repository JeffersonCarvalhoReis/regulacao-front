<template>
  <v-tabs
    v-model="tab"
    class="bg-white border-t border-x border-gray-200"
    selected-class="text-blue-800 bg-blue-100"
  >
    <v-tab class="font-bold px-10" value="active">Ativos</v-tab>
    <v-tab class="font-bold px-10" value="expired"> Expirados</v-tab>
    <v-tab class="font-bold px-10" value="closed"> Encerrados</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="active">
      <base-table
        class="rounted-t-none"
        :headers="headers"
        :icon-edit="iconEdit"
        :items="items"
        :loading="loadingList"
        text-view="Ver Laudo Médico"
        :total-items="meta.total"
        @delete-item="handleDelete"
        @edit-item="handleEdit"
        @update-options="updateOptions"
        @view-item="handleOpenDetails"
      />
    </v-tabs-window-item>
    <v-tabs-window-item value="expired">
      <base-table
        class="rounted-t-none"
        :headers="headers"
        :delete-on="false"
        :tooltipTextDelete="tooltipTextDelete"
        :icon-edit="iconRenew"
        :class-edit="classEdit"
        :items="items"
        :text-edit="renewText"
        :loading="loadingList"
        text-view="Ver Laudo Médico"
        :total-items="meta.total"
        @delete-item="handleDelete"
        @edit-item="handleRenew"
        @update-options="updateOptions"
        @view-item="handleOpenDetails"
      />
    </v-tabs-window-item>
    <v-tabs-window-item value="closed">
      <base-table
        class="rounted-t-none"
        :edit="false"
        :delete-on="false"
        :tooltipTextDelete="tooltipTextDelete"
        :headers="headers"
        :items="items"
        :loading="loadingList"
        text-view="Ver Laudo Médico"
        :total-items="meta.total"
        @delete-item="handleDelete"
        @update-options="updateOptions"
        @view-item="handleOpenDetails"
      />
    </v-tabs-window-item>
  </v-tabs-window>
  <v-dialog v-model="openMedicalReportDetails">
    <MedicalReportDetails
      :medical-report-data="medicalReportData"
      @close="openMedicalReportDetails = false"
    />
  </v-dialog>
  <v-dialog v-model="editMedicalReport">
    <MedicalReportForm
      :model-value="medicalReportData"
      @close-report="handleCloseReport"
      @close="editMedicalReport = false"
      @save-renew="submitRenew"
      @save="submit"
      :current-tab="tab"
      :isRenew="isRenew"
    />
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useMedicalReportApi } from "@/composables/modules/useMedicalReportModule";
import debounce from "lodash/debounce";

const {
  data,
  loadingList,
  refetch,
  closeReport,
  setTableOptions,
  meta,
  setFilter,
  setSort,
  destroy,
  clearFilters,
  create,
  update,
} = useMedicalReportApi();
const { showFeedback, confirmModal } = useSweetAlertFeedback();

const emit = defineEmits(["change-tab"]);
const options = ref({});
const iconEdit = "mdi-account-edit";
const openMedicalReportDetails = ref(false);
const medicalReportData = ref({});
const editMedicalReport = ref(false);
const tab = ref("active");
const tooltipTextDelete = "Não é possível excluir esse laudo";
const classEdit = "text-ita-yellow bg-white/0/0 border-0 ml-1 h-full";
const iconRenew = "mdi-autorenew";
const renewText = "Renovar laudo";
const isRenew = ref(false);

const updateOptions = (newOptions) => {
  options.value = { ...newOptions };
};
const items = computed(() => {
  const raw = data.value;
  return raw.map((r) => ({
    ...r,
    patient_name: r.patient?.name ?? "",
    report_date: formattedDate(r.report_date),
    valid_until: formattedDate(r.valid_until),
    closed_at: formattedDate(r.closed_at),
  }));
});

const formattedDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
};

const handleOpenDetails = (report) => {
  medicalReportData.value = report;
  openMedicalReportDetails.value = true;
};

const handleEdit = (report) => {
  const raw = data.value.find((r) => r.id === report.id);
  medicalReportData.value = raw;
  editMedicalReport.value = true;
  isRenew.value = false;
};

const handleRenew = (report) => {
  const raw = data.value.find((r) => r.id === report.id);
  medicalReportData.value = raw;
  editMedicalReport.value = true;
  isRenew.value = true;
};

const handleDelete = async (medicalReport) => {
  const confirm = await confirmModal(
    `Tem certeza que deseja excluir laudo do paciente <strong>${medicalReport.patient.name}</strong>?`,
    "Atenção"
  );
  if (confirm) {
    await showFeedback(() => destroy(medicalReport));
    refetch();
  }
};
const handleCloseReport = async (medicalReport) => {
  const confirm = await confirmModal(
    `Tem certeza que deseja encerrar laudo do paciente <strong>${medicalReport.patient.name}</strong>?`,
    "Atenção"
  );
  if (confirm) {
    await showFeedback(() => closeReport(medicalReport));
    editMedicalReport.value = false;
    refetch();
  }
};

const submit = async (medicalReport) => {
  await showFeedback(() => update(medicalReport.id, medicalReport));
  refetch();
  editMedicalReport.value = false;
};
const submitRenew = async (medicalReport) => {
  await showFeedback(() => create(medicalReport), {
    message: "Laudo renovado com sucesso",
  });
  refetch();
  editMedicalReport.value = false;
};

const handleWatch = debounce(async () => {
  switch (tab.value) {
    case "active":
      clearFilters();
      setSort("report_date");
      setFilter("status", "active");

      break;
    case "expired":
      clearFilters();
      setSort("-report_date");
      setFilter("is_expired", true);

      break;
    case "closed":
      clearFilters();
      setSort("-closed_at");
      setFilter("status", "closed");

      break;

    default:
      clearFilters();
      break;
  }

  emit("change-tab");

  await nextTick();
  refetch();
}, 100);

watch(() => tab.value, handleWatch, { deep: true });

watch(
  () => options.value,
  async (newOptions) => {
    await nextTick();
    setTableOptions(newOptions);
    refetch();
  },
  { deep: true }
);

onMounted(async () => {
  await nextTick();
  setSort("report_date");
  setFilter("status", "active");
});

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Detalhes",
      value: "view",
      align: "left",
      width: "200px",
    },
    {
      title: "Paciente",
      key: "patient_name",
      sortable: true,
      align: "center",
    },

    {
      title: "Data do laudo",
      key: "report_date",
      sortable: true,
      align: "center",
    },
    {
      title: "Ações",
      value: "action",
      align: "center",
      width: "100px",
    },
  ];
  switch (tab.value) {
    case "active":
      baseHeaders.splice(3, 0, {
        title: "Validade",
        key: "valid_until",
        sortable: true,
        align: "center",
      });

      break;
    case "expired":
      baseHeaders.splice(3, 0, {
        title: "Data da expiração",
        key: "valid_until",
        sortable: true,
        align: "center",
      });

      break;
    case "closed":
      baseHeaders.splice(3, 0, {
        title: "Data do encerramento",
        key: "closed_at",
        sortable: true,
        align: "center",
      });

      break;

    default:
      baseHeaders.splice(3, 0, {
        title: "Validade",
        key: "valid_until",
        sortable: true,
        align: "center",
      });
      break;
  }
  return baseHeaders;
});

defineExpose({
  refetch,
  setFilter,
});
</script>

<style lang="scss" scoped></style>
