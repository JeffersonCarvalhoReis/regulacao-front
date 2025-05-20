<template>
  <div>
    <patient-search @search-patient="search">
      <slot />
    </patient-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
      @view-item="viewPatient"
    >
    <template #item.birth_date="{ item }">
      {{ formatDate(item.birth_date) }}
    </template>
  </base-table>
  </div>
  <v-dialog
   v-model="viewPatientProfile"
   class="z-900"
   >
    <patient-profile :patient-data="patientData" @close="viewPatientProfile = false" />
  </v-dialog>

  <v-dialog
    v-model="editPatient"
    class="z-999"
  >
    <companion-form :model-value="selectedPatient" @close="editPatient = false" @save="submit" />
  </v-dialog>

</template>

<script setup>
  import { useCompanionApi } from '@/composables/modules/useCompanionModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  });
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, destroy, clearFilters, update } = useCompanionApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const { formatDate } = useFormatDate();

  const options = ref({});
  const viewPatientProfile = ref(false);
  const editPatient = ref(false);
  const selectedPatient = ref({});
  const patientData = ref({});
  const tooltipTextDelete = 'Não é possível excluir o paciente enquanto houver solicitações vinculadas a ele.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleDelete = async compnion => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o acompanhante <strong>${compnion.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(compnion)) ;
      refetch()
    }
  };

  const handleEdit = patient => {
    selectedPatient.value = patient
    editPatient.value = true
  };

  const submit = async patient => {
    await showFeedback(() => update(patient.id, patient));
    refetch();
    editPatient.value = false
  };

  const search = debounce(async v => {
    setFilter('search', v);
    await nextTick()
    refetch();
  }, 500);

  const viewPatient = v => {
    patientData.value = v;
    viewPatientProfile.value = true;
  };

  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  );


  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'center',
        width: '100px',
      },
      {
        title: 'Paciente',
        key: 'name',
        sortable: true,
        align: 'center',

      },
      {
        title: 'CNS',
        key: 'cns',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Data de Nascimento',
        key: 'birth_date',
        sortable: true,
        align: 'center',

      },

    ];
    if(props.edit || props.showDelete) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        align: 'center',
        width: '100px',
      });
    }
    return baseHeaders
  });

  defineExpose({
    setFilter,
    refetch,
    clearFilters,
  });
</script>
