<template>
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :items="specialistsReversed"
      :loading="loadingList"
      :show-delete="false"
      :edit="false"
      hide-default-footer
      :newAction="true"
      :iconNewAction="iconRemoveSpecialist"
      :classNewAction="classRemoveSpecialist"
      :textNewAction="textRemoveSpecialist"
      @new-action="handleRemoveSpecialist"
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

  const iconRemoveSpecialist = 'mdi-delete';
  const classRemoveSpecialist = 'text-red-600 bg-white border-0';
  const textRemoveSpecialist = 'Remover especialidade desse médico';
  const specialists = ref(props.modelValue.specialists);
  const specialistsReversed = computed(() => [...specialists.value].reverse());

  const removeSpecialist = async (specialist) => {
    specialists.value = specialists.value.filter(s => s.id !== specialist.id);
    const specialistsToUpdate = {
      specialist_ids: specialists.value.map(s => s.id)
    }
    const response = await update(props.modelValue.id,  specialistsToUpdate );
    emit('update-table', specialistsToUpdate )
    return response;
  };

const handleRemoveSpecialist = async (specialist) => {
  const confirm = await confirmModal(`Tem certeza que deseja remover a especialidade <strong>${specialist.name}</strong> do médico <strong>${props.modelValue.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => removeSpecialist(specialist)) ;
      refetch()
    }
  };

  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Especialidade',
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
    specialists.value = newVal.specialists

  }, { deep: true});
</script>
