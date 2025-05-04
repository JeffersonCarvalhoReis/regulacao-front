<template>
  <patient-table ref="patientTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerPatient = true" />
      <v-badge color="error" :content="badgeCounter" v-if="badgeCounter > 0" >
      <v-btn
        class="bg-emerald-600 hover:bg-emerald-700 text-white"
        prepend-icon="mdi-filter-variant"
        @click="dialogFilter = true"
      >
        Filtros
      </v-btn>
    </v-badge>
      <v-btn
          v-else
          class="bg-emerald-600 hover:bg-emerald-700 text-white"
          prepend-icon="mdi-filter-variant"
          @click="dialogFilter = true"
        >
          Filtros
      </v-btn>
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
