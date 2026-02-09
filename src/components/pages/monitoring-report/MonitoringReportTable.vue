<template>
  <div>
    <patient-search @search-patient="search">
      <slot />
    </patient-search>
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      :icon-view="iconView"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
      @view-item="viewMonitoringReport"
    />
  </div>

  <v-dialog v-model="viewMonitoringReportOpen">
    <monitoring-report-details
      :monitoring-report-data="monitoringReportData"
      @close="viewMonitoringReportOpen = false"
    />
  </v-dialog>

  <v-dialog v-model="editMonitoringReport" class="z-999">
    <monitoring-report-form
      :model-value="selectedMonitoringReport"
      @close="editMonitoringReport = false"
      @save="submit"
    />
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useMonitoringReportApi } from "@/composables/modules/useMonitoringReportModule";
import debounce from "lodash/debounce";

const {
  data,
  loadingList,
  refetch,
  setTableOptions,
  meta,
  setFilter,
  destroy,
  update,
} = useMonitoringReportApi();
const { showFeedback, confirmModal } = useSweetAlertFeedback();

const iconView = "mdi-clipboard-text";
const options = ref({});
const viewMonitoringReportOpen = ref(false);
const editMonitoringReport = ref(false);
const selectedMonitoringReport = ref({});
const monitoringReportData = ref({});

const updateOptions = (newOptions) => {
  options.value = { ...newOptions };
};

const handleDelete = async (monitoringReport) => {
  const confirm = await confirmModal(
    `Tem certeza que deseja excluir o relatório de acompanhamento do paciente <strong>${monitoringReport.patient_name}</strong>?`,
    "Atenção",
  );
  if (confirm) {
    await showFeedback(() => destroy(monitoringReport));
    refetch();
  }
};

const handleEdit = (monitoringReport) => {
  selectedMonitoringReport.value = monitoringReport;
  editMonitoringReport.value = true;
};

const submit = async (monitoringReport) => {
  const id = selectedMonitoringReport.value.id;
  await showFeedback(() => update(id, monitoringReport));
  refetch();
  editMonitoringReport.value = false;
};

const search = debounce(async (v) => {
  setFilter("search", v);
  await nextTick();
  refetch();
}, 500);

const viewMonitoringReport = (v) => {
  monitoringReportData.value = v;
  viewMonitoringReportOpen.value = true;
};

watch(
  () => options.value,
  async (newOptions) => {
    await nextTick();
    setTableOptions(newOptions);
    refetch();
  },
  { deep: true },
);

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Relatório",
      value: "view",
      align: "center",
      width: "100px",
    },
    {
      title: "Paciente",
      key: "patient_name",
      sortable: true,
      align: "left",
    },
    {
      title: "CNS",
      key: "patient_cns",
      sortable: true,
      align: "left",
    },
    {
      title: "Ações",
      value: "action",
      align: "center",
      width: "100px",
    },
  ];

  return baseHeaders;
});

defineExpose({
  refetch,
});
</script>
