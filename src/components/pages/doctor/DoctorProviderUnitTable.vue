<template>
  <base-table
    class="rounted-t-none"
    :headers="headers"
    :items="providerUnitsReversed"
    :loading="loadingList"
    :show-delete="false"
    :edit="false"
    hide-default-footer
    :newAction="true"
    :iconNewAction="iconRemoveProviderUnit"
    :classNewAction="classRemoveProviderUnit"
    :textNewAction="textRemoveProviderUnit"
    @new-action="handleRemoveProviderUnit"
  />
</template>

<script setup>
import { useDoctorApi } from '@/composables/modules/useDoctorModule';
import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update-table']);

const {  loadingList, refetch, update } = useDoctorApi();
const { showFeedback, confirmModal } = useSweetAlertFeedback();

const iconRemoveProviderUnit = 'mdi-delete';
const classRemoveProviderUnit = 'text-red-600 bg-white/0 border-0  ml-1 h-full';
const textRemoveProviderUnit = 'Remover unidade desse médico';
const providerUnits = ref(props.modelValue.provider_units);
const providerUnitsReversed = computed(() => [...providerUnits.value].reverse());

const removeProviderUnit = async (providerUnit) => {
  providerUnits.value = providerUnits.value.filter(p => p.id !== providerUnit.id);
  const providerUnitsToUpdate = {
    provider_unit_ids: providerUnits.value.map(s => s.id)
  }
  const response = await update(props.modelValue.id,  providerUnitsToUpdate );

  emit('update-table', providerUnitsToUpdate )
  return response;
};

const handleRemoveProviderUnit = async (providerUnit) => {
const confirm = await confirmModal(`Tem certeza que deseja remover a unidade <strong>${providerUnit.name}</strong> do médico <strong>${props.modelValue.name}</strong>?`, 'Atenção');
  if(confirm) {
    await showFeedback(() => removeProviderUnit(providerUnit)) ;
    refetch()
  }
};

const headers = computed( () => {
  const baseHeaders = [
    {
      title: 'Unidade',
      key: 'name',
      sortable: false,
      align: 'left',

    },
    {
      title: 'Remover',
      value: 'action',
      width: '200px',
      align: 'center',
    }

  ];
  return baseHeaders
});

watch(() => props.modelValue, (newVal) => {
  providerUnits.value = newVal.provider_units

  }, { deep: true});
</script>
