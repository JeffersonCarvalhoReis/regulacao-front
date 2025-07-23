<template>
  <base-card title="Adicionar Médicos" @close="emit('close')">
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="specialist_ids"
          density="compact"
          item-title="name"
          item-value="id"
          :items="specialists"
          label="Especialidades"
          multiple
          variant="outlined"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
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
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup'

  const props = defineProps({
    specialistsData: { type: Object, required: true },
  });

  const specialists = ref(props.specialistsData)


  const emit = defineEmits(['save', 'close']);

  const schema = yup.object({
    specialist_ids: yup.array().of(yup.number()).nullable(),
  });

  const { handleSubmit } = useForm({
    validationSchema: schema,
  });

  const { value: specialist_ids } = useField('specialist_ids');

  const onSubmit = handleSubmit(values => {
    emit('save', values);
    emit('close')
  });

  watch(() => props.specialistsData, newValue => {
    specialists.value = newValue
  },{ deep: true })

  </script>
