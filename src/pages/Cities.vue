<template>
  <city-table ref="cityTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerCity = true" />

    </div>
  </city-table>
  <v-dialog
    v-model="registerCity"
    class="z-999"
  >
    <city-form @close="registerCity = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useCityApi } from '@/composables/modules/useCityModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useCityApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerCity = ref(false);
  const cityTableRef = ref(null);


  const submit = async city => {
    const success = await showFeedback(() => create(city));
    if (success) {
      cityTableRef.value?.refetch();
      registerCity.value = false;
    }
  }
</script>
