<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex flex-col gap-4">
        <v-text-field
          v-model="name"
          class="required"
          density="compact"
          :error-messages="errors.name"
          label="Nome"
          placeholder="Nome do Médico"
          variant="outlined"
        />
        <v-autocomplete
          v-model="specialist_ids"
          density="compact"
          :error-messages="errors.specialist_ids"
          item-title="name"
          item-value="id"
          :items="specialistData"
          label="Espcialidades"
          multiple
          variant="outlined"
        />
        <v-autocomplete
          v-model="provider_unit_ids"
          density="compact"
          :error-messages="errors.provider_unit_ids"
          item-title="name"
          item-value="id"
          :items="proivderUnitData"
          label="Unidades que presta serviços"
          multiple
          variant="outlined"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear button-text="Limpar Campos" @clear="clear" />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const { data: proivderUnitData, refetch: refetchProviderUnit, params: paramsProviderUnit } = useProviderUnitApi();
  const { data: specialistData, refetch: refetchSpecialist, params: paramsSpecialist } = useSpecialistApi();

  const emit = defineEmits(['close', 'save']);
  const title = 'Cadastrar Médico'

  const schema = yup.object({
    name: yup.string().required('Nome da especialidade é obrigatório'),
    provider_unit_ids: yup.array().of(yup.number()).nullable(),
    specialist_ids: yup.array().of(yup.number()).nullable(),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: provider_unit_ids } = useField('provider_unit_ids');
  const { value: specialist_ids } = useField('specialist_ids');


  onMounted( async () => {
    paramsProviderUnit.value.per_page = -1;
    paramsSpecialist.value.per_page = -1;
    await nextTick();
    refetchProviderUnit();
    refetchSpecialist();
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
  };
</script>
