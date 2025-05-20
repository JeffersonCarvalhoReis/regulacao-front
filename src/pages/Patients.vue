<template>
  <patient-table ref="patientTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerPatient = true" />
      <v-badge color="error" :content="badgeCounter" v-if="badgeCounter > 0" >
       <base-button-filter @filters="dialogFilter = true"/>
      </v-badge>
      <base-button-filter v-else @filters="dialogFilter = true"/>
      <base-button-clear
        button-icon="mdi-filter-remove-outline"
        button-text="Limpar Filtros"
        @clear="clear"
      />
    </div>
  </patient-table>
  <v-dialog
    v-model="registerPatient"
    class="z-999"
    transition="dialog-transition"
  >
    <patient-form @close="registerPatient = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogFilter"
    class="z-999"
    transition="dialog-transition"
  >
    <patient-filters @close="dialogFilter = false" @filters="submitFilters" />
  </v-dialog>
</template>
<script setup>
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = usePatientApi();
  const { showFeedback } = useSweetAlertFeedback();

  const patientTableRef = ref(null);
  const registerPatient = ref(false)
  const clear = () => {
    patientTableRef.value?.clearFilters();
    patientTableRef.value?.refetch();
    badgeCounter.value = 0

  }

  const submit = async val => {
    const success = await showFeedback(() => create(val));
    if (success) {
      patientTableRef.value?.refetch();
      registerPatient.value = false;
    }
  }
  //filters
  const dialogFilter = ref(false);
  const badgeCounter = ref(0);

  const countNotNullKeys = (obj) => {
  return Object.values(obj).filter(value => {
    if (Array.isArray(value)) {
      // Verifica se todo o array é nulo
      return value.some(item => item !== null);
    }
    return value !== null;
  }).length;
  };
  const submitFilters = async val => {
    patientTableRef.value?.setFilter('', val);
    badgeCounter.value = countNotNullKeys(val);
    patientTableRef.value?.refetch();
    dialogFilter.value = false
  }
</script>
