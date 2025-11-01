<template>
  <procedure-table ref="procedureTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register
        v-if="['regulation_officer'].includes(role)"
        @register="registerProcedure = true"
      />
    </div>
  </procedure-table>
  <v-dialog v-model="registerProcedure" class="z-999">
    <procedure-form @close="registerProcedure = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useProcedureApi } from "@/composables/modules/useProcedureModule";
import { useMeStore } from "@/stores/me";

const meStore = useMeStore();
const role = computed(() => meStore.role);

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
};
</script>
