<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>

        <v-text-field
          v-model="name"
          class="required"
          density="compact"
          :error-messages="errors.name"
          label="Nome"
          placeholder="Nome do Hospital"
          variant="outlined"
        />

        <v-autocomplete
            :key="autocompleteKey"
            v-model="city_id"
            class="required"
            :error-messages="errors.city_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="data"
            label="Cidade"
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
  import { useCityApi } from '@/composables/modules/useCityModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const emit = defineEmits(['close', 'save']);
  const autocompleteKey = ref(0);
  const title = computed(() =>
    isEditing.value ? 'Editar Hospital' : 'Cadastrar Hospital'
  );

  const { data, refetch, params } = useCityApi();

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nome do Hospital é obrigatório'),
    city_id: yup.string().required('Cidade é obrigatória'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
    initialValues:  {
      name: '',
      city_id: null
    }
  });

  const { value: name } = useField('name');
  const { value: city_id } = useField('city_id');

  onMounted( async () => {
    params.value.per_page = -1;
    await nextTick();
    await refetch()

    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
    autocompleteKey.value++
  };
</script>
