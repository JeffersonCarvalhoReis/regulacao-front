<template>
  <user-table ref="userTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerUser = true" />
    </div>
  </user-table>
  <v-dialog
    v-model="registerUser"
    class="z-999"
  >
    <user-form @close="registerUser = false" @save="submit" />
  </v-dialog>
</template>
<script setup>
  import { useUserApi } from '@/composables/modules/useUserModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useUserApi();
  const { showFeedback } = useSweetAlertFeedback();

  const registerUser = ref(false);
  const userTableRef = ref(null);


  const submit = async user => {
    const success = await showFeedback(() => create(user));
    if (success) {
      userTableRef.value?.refetch();
      registerUser.value = false;
    }
  }
</script>
