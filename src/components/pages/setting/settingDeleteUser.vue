<template>
  <div class="mx-auto">
    <BaseCard title="Insira a sua senha atual para efetuar a exclusão da conta" @close="handleDialogClose">
      <v-card-text>
        <v-form>
          <input
            autocomplete="username"
            style="display: none"
            type="text"
          >
          <v-text-field
            v-model="currentPasswordToDelete"
            :append-inner-icon="showPasswordToDelete ? 'mdi-eye-off' : 'mdi-eye'"
            autocomplete="current-password"
            :error-messages="deleteErrors.currentPasswordToDelete"
            label="Senha atual"
            :type="showPasswordToDelete ? 'text' : 'password'"
            variant="outlined"
            @blur="validateDeleteField('currentPasswordToDelete')"
            @click:append-inner="showPasswordToDelete = !showPasswordToDelete"
            @keydown.space.prevent
          />
        </v-form>
      </v-card-text>
      <div class="flex justify-between mx-2">
        <v-btn
          class="ma-4 bg-red-500 text-white"
          min-width="150px"
          prepend-icon="mdi-delete"
          @click="deleteAccount"
        >
          Excluir
        </v-btn>

        <v-btn
          class="ma-4"
          color="primary"
          min-width="150px"
          @click="handleDialogClose"
        >
          Voltar
        </v-btn>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useUserApi } from '@/composables/modules/useUserModule';
  import { useField, useForm } from 'vee-validate'
  import { useAuthStore } from '@/stores/authStore';
  import * as yup from 'yup'

  const emit = defineEmits(['close'])
  const showPasswordToDelete = ref(false);
  const authStore = useAuthStore();

  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const { destroyUser } = useUserApi();
  const deleteSchema = yup.object({
    currentPasswordToDelete: yup.string().required('Senha é obrigatória para a exclusão'),
  });

  const {
    handleSubmit: handleDeleteSubmit,
    errors: deleteErrors,
    resetForm: resetDeleteForm,
    validateField: validateDeleteField,
  } = useForm({
    validationSchema: deleteSchema,
  });

  const { value: currentPasswordToDelete } = useField('currentPasswordToDelete')

  const handleDialogClose = () => {
    emit('close')
    resetDeleteForm({ values: { currentPasswordToDelete: '' } });
  };

  const deleteAccount = handleDeleteSubmit(async values => {
    const confirm = await confirmModal('Tem certeza que deseja excluir sua conta?');
    if (!confirm) return;

    const success = await showFeedback(() => destroyUser(values));

    if (success) {
      authStore.hasSession = false;
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  });

</script>
