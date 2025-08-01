<template>
  <requesting-unit-table ref="requestingUnitTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerRequestingUnit = true" />
    </div>
  </requesting-unit-table>
  <v-dialog
    v-model="registerRequestingUnit"
    class="z-999"
  >
    <requesting-unit-form @close="registerRequestingUnit = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useRequestingUnitApi } from '@/composables/modules/useRequestingUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useRequestingUnitApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerRequestingUnit = ref(false);
  const requestingUnitTableRef = ref(null);


  const submit = async requestingUnit => {
    const success = await showFeedback(() => create(requestingUnit));
    if (success) {
      requestingUnitTableRef.value?.refetch();
      registerRequestingUnit.value = false;
    }
  }
</script>
