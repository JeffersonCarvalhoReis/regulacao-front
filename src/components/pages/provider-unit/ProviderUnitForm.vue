<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex flex-col gap-2">
        <v-text-field
          v-model="name"
          :error-messages="errors.name"
          density="compact"
          label="Nome"
          placeholder="Nome da Unidade Prestadora"
          variant="outlined"
        />
        <v-text-field
          v-model="localization"
          :error-messages="errors.localization"
          density="compact"
          label="Localização ou ponto referência"
          placeholder="Nome da Unidade Prestadora"
          variant="outlined"
        />
        <v-autocomplete
        v-if="!isEditing"
        v-model="doctor_ids"
        multiple
        density="compact"
        item-title="name"
        item-value="id"
        :items="data"
        label="Médicos"
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
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { data, refetch, params } = useDoctorApi();

  const emit = defineEmits(['close', 'save']);
  const title = computed(() =>
    isEditing.value ? 'Editar Unidade Prestadora' : 'Cadastrar Unidade Prestadora'
  );

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nome da unidade é obrigatório'),
    localization: yup.string().nullable(),
    doctor_ids: yup.array().of(yup.number()).nullable()
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: localization } = useField('localization');
  const { value: doctor_ids } = useField('doctor_ids');


  onMounted( async () => {
    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    };
    params.value.per_page = -1;
    await nextTick();
    refetch();
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
  };
</script>
