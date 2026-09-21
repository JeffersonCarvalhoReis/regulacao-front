<template>
  <schedule-table ref="scheduleTableRef" :edit="true" :show-delete="true">
    <div class="flex flex-wrap gap-2">
      <base-button-register
        @register="registerSchedule = true"
        button-text="Abrir nova agenda"
      />
    </div>
  </schedule-table>
  <v-dialog v-model="registerSchedule" class="z-999">
    <schedule-form @close="registerSchedule = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useScheduleApi } from "@/composables/modules/useScheduleModule";

const { create } = useScheduleApi();
const { showFeedback } = useSweetAlertFeedback();

const registerSchedule = ref(false);
const scheduleTableRef = ref(null);

const submit = async (schedule) => {
  const success = await showFeedback(() => create(schedule));
  if (success) {
    scheduleTableRef.value?.refetch();
    registerSchedule.value = false;
  }
};
</script>
