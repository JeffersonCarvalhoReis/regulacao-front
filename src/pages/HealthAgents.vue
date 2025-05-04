<template>
  <health-agent-table ref='healthAgentTableRef' :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerHealthAgent = true" />
    </div>
  </health-agent-table>
  <v-dialog
    v-model="registerHealthAgent"
    class="z-999"
  >
    <health-agent-form @close="registerHealthAgent = false"  @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useHealthAgentApi } from '@/composables/modules/useHealthAgentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useHealthAgentApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerHealthAgent = ref(false);
  const healthAgentTableRef = ref(null);


  const submit = async (healthAgent) => {
    const success = await showFeedback(() => create(healthAgent));
    if (success) {
      healthAgentTableRef.value?.refetch();
      registerHealthAgent.value = false;
    }
  }
</script>
