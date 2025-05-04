<template>
  <procedure-table ref='procedureTableRef' :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerProcedure = true" />

    </div>
  </procedure-table>
  <v-dialog
    v-model="registerProcedure"
    class="z-999"
  >
    <procedure-form @close="registerProcedure = false"  @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useProcedureApi } from '@/composables/modules/useProcedureModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useProcedureApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerProcedure = ref(false);
  const procedureTableRef = ref(null);


  const submit = async (procedure) => {
    const success = await showFeedback(() => create(procedure));
    if (success) {
      procedureTableRef.value?.refetch();
      registerProcedure.value = false;
    }
  }
</script>
