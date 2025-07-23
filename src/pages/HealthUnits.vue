<template>
  <health-unit-table ref="healthUnitTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerHealthUnit = true" />
    </div>
  </health-unit-table>
  <v-dialog
    v-model="registerHealthUnit"
    class="z-999"
  >
    <health-unit-form @close="registerHealthUnit = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useHealthUnitApi } from '@/composables/modules/useHealthUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useHealthUnitApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerHealthUnit = ref(false);
  const healthUnitTableRef = ref(null);


  const submit = async healthUnit => {
    const success = await showFeedback(() => create(healthUnit));
    if (success) {
      healthUnitTableRef.value?.refetch();
      registerHealthUnit.value = false;
    }
  }

</script>
