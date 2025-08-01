<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="grid grid-cols-3 gap-x-4">
        <v-text-field
          v-model="vehicle_model"
          class="required col-span-2"
          density="compact"
          :error-messages="errors.vehicle_model"
          label="Veículo"
          placeholder="Nome do modelo do veículo"
          variant="outlined"
        />
        <v-text-field
          v-model="number_plate"
          density="compact"
          :error-messages="errors.number_plate"
          label="Placa"
          placeholder="Placa do veículo"
          variant="outlined"
        /></v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campo" @clear="clear" />
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
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const emit = defineEmits(['close', 'save']);
  const title = computed(() =>
    isEditing.value ? 'Editar Veículo' : 'Cadastrar Veículo'
  );

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    number_plate: yup.string().nullable(),
    vehicle_model: yup.string().required('Nome do modelo do veículo é obrigatório'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: number_plate } = useField('number_plate');
  const { value: vehicle_model } = useField('vehicle_model');

  onMounted(() => {
    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
  };
</script>
