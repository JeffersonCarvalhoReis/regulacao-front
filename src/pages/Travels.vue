<template>
  <travel-table ref="travelTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerTravel = true" />
    </div>
  </travel-table>
  <v-dialog v-model="registerTravel" class="z-999">
    <travel-form @close="registerTravel = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useTravelApi } from "@/composables/modules/useTravelModule";

const { create } = useTravelApi();
const { showFeedback } = useSweetAlertFeedback();

const registerTravel = ref(false);
const travelTableRef = ref(null);

const submit = async (travel) => {
  const success = await showFeedback(() => create(travel));
  if (success) {
    travelTableRef.value?.refetch();
    registerTravel.value = false;
  }
};
</script>
