<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex gap-4">
        <v-text-field
          v-model="name"
          class="required"
          density="compact"
          :error-messages="errors.name"
          label="Nome"
          placeholder="Nome da unidade de saúde"
          variant="outlined"
        />
        <v-text-field
          v-model="cnes"
          density="compact"
          :error-messages="errors.cnes"
          label="CNES"
          placeholder="CNES da Unidade"
          type="number"
          variant="outlined"
        />
      </v-form>
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
    isEditing.value ? 'Editar Unidade de Saúde' : 'Cadastrar Unidade de Saúde'
  );

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nome da unidade é obrigatório'),
    cnes: yup.string().nullable(),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: cnes } = useField('cnes')

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
