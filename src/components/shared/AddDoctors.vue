<template>
  <base-card title="Adicionar Médicos" @close="emit('close')">
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="doctor_ids"
          density="compact"
          item-title="name"
          item-value="id"
          :items="props.doctorsData"
          label="Médico"
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
    doctorsData: { type: Object, required: true },
  });

  const emit = defineEmits(['save', 'close']);

  const schema = yup.object({
    doctor_ids: yup.array().of(yup.number()).nullable(),
  });

  const { handleSubmit } = useForm({
    validationSchema: schema,
  });

  const { value: doctor_ids } = useField('doctor_ids');

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });


  </script>

  <style lang="scss" scoped>

  </style>
