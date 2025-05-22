<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="name"
          :error-messages="errors.name"
          class="required"
          density="compact"
          label="Nome"
          placeholder="Nome da Especialidade"
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
          <div class="flex gap-4">
            <v-text-field
            v-model="min_age"
            :error-messages="errors.min_age"
            label="Idade Mínima(opcional)"
            placeholder="Idade em anos"
            variant="outlined"
            density="compact"
            @keypress="onlyNumbers"
          />
          <v-text-field
            v-model="max_age"
            :error-messages="errors.max_age"
            label="Idade Máxima(opcional)"
            placeholder="Idade em anos"
            variant="outlined"
            density="compact"
            @keypress="onlyNumbers"
          />
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
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { data, refetch, params } = useDoctorApi();
  const { onlyNumbers } = useOnlyNumbers();

  const emit = defineEmits(['close', 'save']);
  const title = computed(() =>
    isEditing.value ? 'Editar Especialidade' : 'Cadastrar Especialidade'
  );

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nome da especialidade é obrigatório'),
    doctor_ids: yup.array().of(yup.number()).nullable(),
    min_age: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .nullable()
    .test('min-less-than-max', 'Idade mínima não pode ser maior que a máxima', function (min_age) {
      const { max_age } = this.parent;
      if (min_age != null && max_age != null) {
        return min_age <= max_age;
      }
      return true; // se algum for nulo, ignora a validação
    }),

  max_age: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .nullable()
    .test('max-greater-than-min', 'Idade máxima não pode ser menor que a mínima', function (max_age) {
      const { min_age } = this.parent;
      if (min_age != null && max_age != null) {
        return max_age >= min_age;
      }
      return true; // se algum for nulo, ignora a validação
    })
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: doctor_ids } = useField('doctor_ids');
  const { value: min_age} = useField('min_age');
  const { value: max_age} = useField('max_age');


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
