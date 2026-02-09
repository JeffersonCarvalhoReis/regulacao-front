<template>
  <monitoring-report-table
    ref="monitoringReportTableRef"
    :edit="true"
    :show-delete="true"
  >
    <div class="flex gap-2">
      <base-button-register @register="registerMonitoringReport = true" />
    </div>
  </monitoring-report-table>
  <v-dialog
    v-model="registerMonitoringReport"
    class="z-999"
    transition="dialog-transition"
  >
    <monitoring-report-form
      @close="registerMonitoringReport = false"
      @save="submit"
    />
  </v-dialog>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useMonitoringReportApi } from "../composables/modules/useMonitoringReportModule";

const { create } = useMonitoringReportApi();
const { showFeedback } = useSweetAlertFeedback();

const monitoringReportTableRef = ref(null);
const registerMonitoringReport = ref(false);

const submit = async (val) => {
  const success = await showFeedback(() => create(val));
  if (success) {
    monitoringReportTableRef.value?.refetch();
    registerMonitoringReport.value = false;
  }
};
</script>
