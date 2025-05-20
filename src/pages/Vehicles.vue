<template>
  <vehicle-table ref='vehicleTableRef' :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerVehicle = true" />
    </div>
  </vehicle-table>
  <v-dialog
    v-model="registerVehicle"
    class="z-999"
  >
    <vehicle-form @close="registerVehicle = false"  @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useVehicleApi } from '@/composables/modules/useVehicleModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useVehicleApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerVehicle = ref(false);
  const vehicleTableRef = ref(null);


  const submit = async (vehicle) => {
    const success = await showFeedback(() => create(vehicle));
    if (success) {
      vehicleTableRef.value?.refetch();
      registerVehicle.value = false;
    }
  }
</script>
