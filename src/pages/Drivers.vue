<template>
  <driver-table ref="driverTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerDriver = true" />

    </div>
  </driver-table>
  <v-dialog
    v-model="registerDriver"
    class="z-999"
  >
    <driver-form @close="registerDriver = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useDriverApi } from '@/composables/modules/useDriverModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useDriverApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerDriver = ref(false);
  const driverTableRef = ref(null);


  const submit = async driver => {
    const success = await showFeedback(() => create(driver));
    if (success) {
      driverTableRef.value?.refetch();
      registerDriver.value = false;
    }
  }
</script>
