<template>
  <hospital-table ref='hospitalTableRef' :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerHospital = true" />

    </div>
  </hospital-table>
  <v-dialog
    v-model="registerHospital"
    class="z-999"
  >
    <hospital-form @close="registerHospital = false"  @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useHospitalApi } from '@/composables/modules/useHospitalModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useHospitalApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerHospital = ref(false);
  const hospitalTableRef = ref(null);


  const submit = async (hospital) => {
    const success = await showFeedback(() => create(hospital));
    if (success) {
      hospitalTableRef.value?.refetch();
      registerHospital.value = false;
    }
  }
</script>
