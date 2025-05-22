<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="grid grid-cols-3 gap-x-2">
          <v-text-field
            v-model="name"
            :error-messages="errors.name"
            class="col-span-2 required"
            density="compact"
            label="Nome"
            placeholder="Nome do agente"
            variant="outlined"
          />

          <v-autocomplete
            v-model="health_unit_id"
            :error-messages="errors.health_unit_id"
            class="required"
            density="compact"
            item-title="name"
            item-value="id"
            :items="data"
            label="Unidade de Saúde"
            variant="outlined"
          />

        </div>
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
  import { useHealthUnitApi } from '@/composables/modules/useHealthUnitModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { data, refetch, params } = useHealthUnitApi();
  const emit = defineEmits(['close', 'save']);
  const title = computed(() =>
    isEditing.value ? 'Editar Agente Comunitário de Saúde' : 'Cadastrar Agente Comunitário de Saúde'
  );

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nome do Agente é obrigatório'),
    health_unit_id: yup.string().required('Unidade de saúde é obrigatório'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: health_unit_id } = useField('health_unit_id');

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
  };
</script>

<style lang="scss" scoped>

</style>
