<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex flex-col gap-2">
        <base-input-date-picker
          v-model="date"
          class-field="required"
          :error-messages="errors.date"
          label="Data da Agenda"
        />
        <v-autocomplete
          v-model="provider_unit_id"
          class="required"
          density="compact"
          :error-messages="errors.provider_unit_id"
          item-title="name"
          item-value="id"
          :items="providerUnitData"
          label="Unidade prestadora"
          variant="outlined"
        />
        <v-autocomplete
          v-model="doctor_id"
          clearable
          density="compact"
          :error-messages="errors.doctor_id"
          item-title="name"
          item-value="id"
          :items="doctorData"
          label="Médico responsável (opcional)"
          variant="outlined"
        />
        <v-text-field
          v-model.number="vacancies"
          class="required"
          density="compact"
          :error-messages="errors.vacancies"
          label="Quantidade de vagas"
          min="1"
          type="number"
          variant="outlined"
        />
        <div v-if="isEditing" class="text-sm text-gray-500">
          Vagas já utilizadas: {{ props.modelValue.used_vacancies }} / {{ props.modelValue.vacancies }}
        </div>
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
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { data: providerUnitData, refetch: providerUnitRefetch, params: providerUnitParams } = useProviderUnitApi();
  const { data: doctorData, refetch: doctorRefetch, params: doctorParams } = useDoctorApi();

  const emit = defineEmits(['close', 'save']);

  const isEditing = computed(() => !!props.modelValue?.id);
  const title = computed(() =>
    isEditing.value ? 'Editar Agenda' : 'Cadastrar Agenda'
  );

  const schema = yup.object({
    date: yup.date().required('Data da agenda é obrigatória'),
    provider_unit_id: yup.number().required('Unidade prestadora é obrigatória'),
    doctor_id: yup.number().nullable(),
    vacancies: yup
      .number()
      .typeError('Informe uma quantidade válida')
      .required('Quantidade de vagas é obrigatória')
      .min(1, 'A agenda deve ter ao menos 1 vaga'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
      date: null,
      provider_unit_id: null,
      doctor_id: null,
      vacancies: null,
    },
  });

  const { value: date } = useField('date');
  const { value: provider_unit_id } = useField('provider_unit_id');
  const { value: doctor_id } = useField('doctor_id');
  const { value: vacancies } = useField('vacancies');

  onMounted(async () => {
    providerUnitParams.value.per_page = -1;
    doctorParams.value.per_page = -1;
    providerUnitParams.value.sort = 'name';
    doctorParams.value.sort = 'name';
    await nextTick();
    await Promise.all([providerUnitRefetch(), doctorRefetch()]);

    if (isEditing.value) {
      resetForm({ values: props.modelValue });
    }
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
  };
</script>
