<template>
  <patient-search
    placeholder="Nome ou CPF"
    ref="patientSearchRef"
    @search-patient="search"
  >
    <div class="flex gap-2">
      <base-button-register @register="registerFibroPatient = true" />
    </div>
  </patient-search>
  <FibroPatientsTable ref="fibroPatientsTableRef" />
  <v-dialog v-model="registerFibroPatient" z-index="999">
    <FibroPatientsForm @close="registerFibroPatient = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
import FibroPatientsForm from "@/components/pages/fibro-patients/FibroPatientsForm.vue";
import FibroPatientsTable from "@/components/pages/fibro-patients/FibroPatientsTable.vue";
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import debounce from "lodash/debounce";
import { useFibroPatientsApi } from "../composables/modules/useFibroPatientsModule";

const { createWithAttachment } = useFibroPatientsApi();
const { showFeedback } = useSweetAlertFeedback();

const registerFibroPatient = ref(false);
const fibroPatientsTableRef = ref(null);

const submit = async (patient) => {
  const success = await showFeedback(() => createWithAttachment(patient));
  if (success) {
    fibroPatientsTableRef.value?.refetch();
    registerFibroPatient.value = false;
  }
};
const patientSearchRef = ref(null);

const search = debounce(async (v) => {
  fibroPatientsTableRef.value?.setFilter("search", v);
  await nextTick();
  fibroPatientsTableRef.value?.refetch();
}, 500);
</script>
