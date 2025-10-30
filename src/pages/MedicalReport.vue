<template>
  <patient-search ref="patientSearchRef" @search-patient="search">
    <div class="flex gap-2">
      <base-button-register @register="registerMedicalReport = true" />
    </div>
  </patient-search>
  <MedicalReportTable ref="medicalReportTableRef" @change-tab="clearSearch" />
  <v-dialog v-model="registerMedicalReport" z-index="999">
    <MedicalReportForm @close="registerMedicalReport = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
import MedicalReportTable from "@/components/pages/medical-report/MedicalReportTable.vue";
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useMedicalReportApi } from "@/composables/modules/useMedicalReportModule";
import debounce from "lodash/debounce";

const { create } = useMedicalReportApi();
const { showFeedback } = useSweetAlertFeedback();

const registerMedicalReport = ref(false);
const medicalReportTableRef = ref(null);

const submit = async (travel) => {
  const success = await showFeedback(() => create(travel));
  if (success) {
    medicalReportTableRef.value?.refetch();
    registerMedicalReport.value = false;
  }
};
const patientSearchRef = ref(null);
const clearSearch = () => {
  patientSearchRef.value?.clear();
  medicalReportTableRef.value?.setFilter("search", "");
  medicalReportTableRef.value?.refetch();
};

const search = debounce(async (v) => {
  medicalReportTableRef.value?.setFilter("search", v);
  await nextTick();
  medicalReportTableRef.value?.refetch();
}, 500);
</script>
