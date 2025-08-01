<template>
  <div>
    <patient-search @search-patient="search">
      <slot />
    </patient-search>
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :icon-view="iconView"
      :items="data"
      :loading="loadingList"
      :text-view="textView"
      :total-items="meta.total"
      @update-options="updateOptions"
      @view-item="viewPatient"
    >
      <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template>
    </base-table>
  </div>
  <v-dialog
    v-model="dialogPatientTfdHistory"
    class="z-900"
  >
    <patient-tfd-history :patient-data="patientData" @close="dialogPatientTfdHistory = false" />
  </v-dialog>
</template>

<script setup>
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import debounce from 'lodash/debounce'

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, setInclude, clearFilters } = usePatientApi();
  const { formatDate } = useFormatDate();

  const options = ref({});
  const dialogPatientTfdHistory = ref(false);
  const patientData = ref({});
  const textView = 'Visualizar histórico de viagens do paciente';
  const iconView = 'mdi-text-box-search'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const search = debounce(async v => {
    setFilter('search', v);
    await nextTick()
    refetch();
  }, 500);

  const viewPatient = v => {
    patientData.value = v;
    dialogPatientTfdHistory.value = true;
  };

  watch(
    () => options.value,
    async newOptions => {
      setFilter('has_travel', true)
      setInclude('travels')
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  );


  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Histórico',
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
        title: 'Unidade',
        key: 'health_unit',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Data de Nascimento',
        key: 'birth_date',
        sortable: true,
        align: 'center',

      },
      {
        title: 'ACS',
        key: 'health_agent',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Localidade',
        key: 'neighborhood',
        sortable: true,
        align: 'center',

      },

    ];
    return baseHeaders
  });

  defineExpose({
    setFilter,
    refetch,
    clearFilters,
  });
</script>
