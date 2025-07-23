<template>
  <doctor-table ref="doctorTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerDoctor = true" />

    </div>
  </doctor-table>
  <v-dialog
    v-model="registerDoctor"
    class="z-999"
  >
    <doctor-form @close="registerDoctor = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useDoctorApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerDoctor = ref(false);
  const doctorTableRef = ref(null);


  const submit = async doctor => {
    const success = await showFeedback(() => create(doctor));
    if (success) {
      doctorTableRef.value?.refetch();
      registerDoctor.value = false;
    }
  }
</script>
