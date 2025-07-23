<template>
  <provider-unit-table ref="providerUnitTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerProviderUnit = true" />

    </div>
  </provider-unit-table>
  <v-dialog
    v-model="registerProviderUnit"
    class="z-999"
  >
    <provider-unit-form @close="registerProviderUnit = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useProviderUnitApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerProviderUnit = ref(false);
  const providerUnitTableRef = ref(null);


  const submit = async providerUnit => {
    const success = await showFeedback(() => create(providerUnit));
    if (success) {
      providerUnitTableRef.value?.refetch();
      registerProviderUnit.value = false;
    }
  }
</script>
