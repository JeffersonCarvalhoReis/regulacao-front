<template>
  <specialist-table ref="specialistTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerSpecialist = true" />

    </div>
  </specialist-table>
  <v-dialog
    v-model="registerSpecialist"
    class="z-999"
  >
    <specialist-form @close="registerSpecialist = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useSpecialistApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerSpecialist = ref(false);
  const specialistTableRef = ref(null);


  const submit = async specialist => {
    const success = await showFeedback(() => create(specialist));
    if (success) {
      specialistTableRef.value?.refetch();
      registerSpecialist.value = false;
    }
  }
</script>
