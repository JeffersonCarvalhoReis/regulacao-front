<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex flex-col gap-4">
        <v-text-field
          v-model="user"
          :error-messages="errors.user"
          autocomplete="username"
          density="compact"
          label="Usuário"
          placeholder="Nome do Usuário"
          variant="outlined"
        />

        <v-text-field
          v-model="password"
          :error-messages="errors.password"
          autocomplete="new-password"
          density="compact"
          :type="showPassword ? 'text' : 'password'"
          :label="isEditing ? 'Nova senha' : 'Senha'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          variant="outlined"
          @click:append-inner="showPassword = !showPassword"
          @keydown.space.prevent
        />
        <div class="max-w-100 relative mt-2"
          v-if="password?.length > 0 "
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
        <v-text-field
          v-model="passwordConfirm"
          :error-messages="errors.passwordConfirm"
          autocomplete="new-password"
          :disabled="!password"
          density="compact"
          :type="showPassword ? 'text' : 'password'"
          :label="isEditing ? 'Confirmar nova senha' : 'Confirmar senha'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          variant="outlined"
          @click:append-inner="showPassword = !showPassword"
          @keydown.space.prevent
        />

        <v-select
          v-model="role"
          :items="roles"
          :error-messages="errors.role"
          density="compact"
          item-title="name"
          item-value="value"
          label="Função"
          variant="outlined"
        />
          <v-autocomplete
            v-model="health_unit_id"
            :error-messages="errors.health_unit_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="healthUnitData"
            label="Unidade de Saúde"
            variant="outlined"
          />
        <v-autocomplete
            v-if="role == 'provider_unit_manager'"
            v-model="provider_unit_id"
            :error-messages="errors.provider_unit_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="providerUnitData"
            label="Unidade Prestadora"
            variant="outlined"
          />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campos" @clear="clear" />
      <v-spacer />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
  import { useRoles } from '@/composables/utils/useRoles';
  import { usePasswordStrength } from '@/composables/utils/usePasswordStrength';
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useHealthUnitApi } from '@/composables/modules/useHealthUnitModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  });

  const { data: providerUnitData, refetch: providerUnitFetch, params: providerUnitParams } = useProviderUnitApi();
  const { data: healthUnitData , refetch: healthUnitFetch, params: healthUnitParams } = useHealthUnitApi();

  const emit = defineEmits(['close', 'save']);
  const showPassword = ref(false)
  const title = computed(() =>
    isEditing.value ? 'Editar Usuário' : 'Cadastrar Usuário'
  );

  const { roles } = useRoles();
  const isEditing = computed(() => !!props.modelValue?.id);
  const schema = computed(() =>
  yup.object({
    user: yup.string().required('Usuário é obrigatório'),
    health_unit_id: yup.string().nullable(),
    provider_unit_id: yup
        .number()
        .when('role', {
          is: 'provider_unit_manager',
          then: (schema) => schema.required('Unidade Prestadora é obrigatória'),
          otherwise: (schema) => schema.nullable()
        }),

    password: isEditing.value
      ? yup
          .string()
          .min(8, 'A senha deve ter no mínimo 8 caracteres')
          .matches(/[A-Za-z]/, 'A senha deve conter ao menos uma letra')
          .matches(/[0-9]/, 'A senha deve conter ao menos um número')
          .notRequired()
      : yup
          .string()
          .required('Senha é obrigatória')
          .min(8, 'A senha deve ter no mínimo 8 caracteres')
          .matches(/[A-Za-z]/, 'A senha deve conter ao menos uma letra')
          .matches(/[0-9]/, 'A senha deve conter ao menos um número'),

      passwordConfirm: yup.string().when('password', ([password], schema) => {
        if (!password) {
          return schema.notRequired();
        }

        return schema
          .required('Confirme a senha')
          .oneOf([yup.ref('password')], 'As senhas não coincidem');
      }),

      role: yup.string().required('Função é obrigatória'),
    })
  );

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: user } = useField('user')
  const { value: password } = useField('password')
  const { value: passwordConfirm } = useField('passwordConfirm')
  const { value: role } = useField('role')
  const { value: provider_unit_id } = useField('provider_unit_id')
  const { value: health_unit_id } = useField('health_unit_id')

  const {
    textPasswordStrength,
    colorPasswordStrength,
    colorPasswordBar,
  } = usePasswordStrength(password)


  onMounted(async () => {
    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
    providerUnitParams.value.per_page = -1;
    healthUnitParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      providerUnitFetch(),
      healthUnitFetch()
    ])
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
  };

</script>
