<template>
  <base-card title="Adicionar Unidades" @close="emit('close')">
    <v-card-text>
      <v-form>
        <v-autocomplete
          v-model="provider_unit_ids"
          density="compact"
          item-title="name"
          item-value="id"
          :items="props.providerUnitsData"
          label="Unidades"
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
    providerUnitsData: { type: Object, required: true },
  });

  const emit = defineEmits(['save', 'close']);

  const schema = yup.object({
    provider_unit_ids: yup.array().of(yup.number()).nullable(),
  });

  const { handleSubmit } = useForm({
    validationSchema: schema,
  });

  const { value: provider_unit_ids } = useField('provider_unit_ids');

  const onSubmit = handleSubmit(values => {
    emit('save', values);
    emit('close');
  });


  </script>

  <style lang="scss" scoped>

  </style>
