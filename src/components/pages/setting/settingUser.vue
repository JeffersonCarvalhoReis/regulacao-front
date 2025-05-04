<template>

  <div class="max-w-250 flex flex-col justify-center mx-auto mb-10">
    <v-form
      autocomplete="on"
    >
      <v-card
        flat
        class="border border-gray-200 shadow-sm"
      >
        <v-card-title>
          <h1 class="text-2xl font-bold mb-2">
            <v-icon class="text-blue-500 ml-2">
              mdi-account-cog
            </v-icon>
            Atualizar Credenciais
          </h1>
          <v-divider class="mx-2" />
        </v-card-title>
        <v-card-text class="mt-5">
          <v-row>
            <v-col>
              <v-text-field
                v-model="user"
                label="Usuário"
                :error-messages="updateErrors.user"
                autocomplete="username"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                :error-messages="updateErrors.currentPassword"
                autocomplete="current-password"
                label="Senha atual"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
                @keydown.space.prevent
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="updateErrors.newPassword"
                autocomplete="new-password"
                label="Nova senha"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
                @keydown.space.prevent
              />

              <div class="max-w-100 relative mt-7"
                v-if="newPassword?.length > 0 "
              >
                <div
                class="mt-1 text-sm font-medium absolute bottom-2"
                :class="colorPasswordStrength"
                >
                  Força da senha: {{ textPasswordStrength }}
                </div>
                <!-- Barra visual -->
                <div
                    class="h-2 rounded mt-1 bg-gray-300 absolute max-w-100 w-full bottom-0 z-0"
                />
                <div
                    class="h-2 rounded mt-1 transition-all duration-300 absolute bottom-0 z-10"
                  :class="[colorPasswordBar]"
                />
               </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="passwordConfirm"
                :disabled="!newPassword"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="updateErrors.passwordConfirm"
                autocomplete="new-password"
                label="Confirmar nova senha"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
                @keydown.space.prevent
              />
            </v-col>
          </v-row>
        </v-card-text>
        <div
        class="flex justify-end gap-2 m-6"
        >
          <v-btn
            color="primary"
            type="submit"
            @click="submit"
          >
            Confirmar
          </v-btn>
        </div>
      </v-card>
      <div v-if="!isAdmin">
        <v-divider
          class="my-10"
        />
        <v-card
          class="border border-red-500 shadow-sm"
          flat
        >
          <v-card-title>
            <h2 class="text-red-500">
              Excluir conta
            </h2>
          </v-card-title>
          <v-card-actions class="flex justify-start m-6">
            <v-btn
              class="bg-red-500 text-white"
              prepend-icon="mdi-delete"
              @click="dialogDelete = true"
            >
              Excluir conta Permanentemente
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-form>
    <v-dialog
      v-model="dialogDelete"
      class="z-999"
    >
    <SettingDeleteUser @close="dialogDelete = false" />
    </v-dialog>
  </div>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { usePasswordStrength } from '@/composables/utils/usePasswordStrength';
  import { useUserApi } from '@/composables/modules/useUserModule';
  import { useMeStore } from '@/stores/me';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

const meStore = useMeStore();
const isAdmin = meStore.role === 'admin';
const showPassword = ref(false);
const showCurrentPassword = ref(false);
const dialogDelete = ref(false);

const { showFeedback } = useSweetAlertFeedback();
const { updateUser, getUser } = useUserApi();

const updateSchema = yup.object({
    user: yup.string().required('Usuário é obrigatório'),
    currentPassword: yup
      .string()
      .transform(value => value || null)
      .when('newPassword', {
        is: val => !!val,
        then: schema => schema.required('Senha atual é obrigatória'),
        otherwise: schema => schema.notRequired(),
      }),
    newPassword: yup
      .string()
      .transform(value => value || null)
      .nullable()
      .notRequired()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .matches(/[A-Za-z]/, 'A senha deve conter ao menos uma letra')
      .matches(/[0-9]/, 'A senha deve conter ao menos um número'),
    passwordConfirm: yup
      .string()
      .transform(value => value || null)
      .nullable()
      .when('newPassword', {
        is: val => !!val,
        then: schema => schema
          .required('Confirme a nova senha')
          .oneOf([yup.ref('newPassword')], 'Senhas não coincidem'),
        otherwise: schema => schema.notRequired(),
      }),
  });

  const {
    handleSubmit: handleUpdateSubmit,
    errors: updateErrors,
    resetForm: resetUpdateForm,
    validateField: validateUpdateField,
    setFieldTouched,
  } = useForm({
    validationSchema: updateSchema,
  });


  const { value: user } = useField('user')
  const { value: currentPassword } = useField('currentPassword')
  const { value: passwordConfirm } = useField('passwordConfirm')
  const { value: newPassword } = useField('newPassword')

  const {
    textPasswordStrength,
    colorPasswordStrength,
    colorPasswordBar,
  } = usePasswordStrength(newPassword);

  onMounted( async () => {
    const currentUser = await getUser();
    resetUpdateForm({ values: currentUser })

  });

  const submit = handleUpdateSubmit(  async values => {
    const success = await showFeedback(() => updateUser(values));
    if (success) {
     meStore.user = user.value;
    }

  });

  watch(newPassword, (val) => {
    if (val === '') {
      newPassword.value = null
      passwordConfirm.value = null
    }
    if (val) {
    setFieldTouched('currentPassword', true)
    validateUpdateField('currentPassword')

    setFieldTouched('passwordConfirm', true)
    validateUpdateField('passwordConfirm')
    }
  });
 </script>
