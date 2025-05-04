<template>
<div class="mx-auto">
      <BaseCard title="Insira a sua senha atual para efetuar a exclusão da conta" @close="handleDialogClose">
          <v-card-text>
            <v-form
            >
              <input
              type="text"
              autocomplete="username"
              style="display: none"
            />
              <v-text-field
              v-model="currentPasswordToDelete"
              :type="showPasswordToDelete ? 'text' : 'password'"
              :error-messages="deleteErrors.currentPasswordToDelete"
              autocomplete="current-password"
              label="Senha atual"
              :append-inner-icon="showPasswordToDelete ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              @click:append-inner="showPasswordToDelete = !showPasswordToDelete"
              @keydown.space.prevent
              @blur="validateDeleteField('currentPasswordToDelete')"
              />
            </v-form>
          </v-card-text>
          <div class="flex justify-between mx-2">
            <v-btn
              min-width="150px"
              class="ma-4 bg-red-500 text-white"
              prepend-icon="mdi-delete"
              @click="deleteAccount"
            >
              Excluir
            </v-btn>

            <v-btn
              min-width="150px"
              color="primary"
              class="ma-4"
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
  import * as yup from 'yup'

  const emit = defineEmits(['close'])
  const showPasswordToDelete = ref(false);

  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const {  destroyUser } = useUserApi();
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

    const deleteAccount = handleDeleteSubmit(async (values) => {
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
