<template>
  <div>
    <patient-search @search-patient="search">
      <slot />
    </patient-search>
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @update-options="updateOptions"
    >
      <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template>
      <template #item.date_of_dead="{ item }">
        {{ formatDate(item.date_of_dead) }}
      </template>
    </base-table>
  </div>
</template>

<script setup>
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  });
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, clearFilters } = usePatientApi();
  const { formatDate } = useFormatDate();

  const options = ref({});

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const search = debounce(async v => {
    setFilter('search', v);
    await nextTick()
    refetch();
  }, 500);

  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      setFilter('is_deceased', 1)
      refetch()
    },
    { deep: true }
  );


  const headers = computed( () => {
    const baseHeaders = [
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
      {
        title: 'Data de Falecimento',
        key: 'date_of_dead',
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
        title: 'Localidade',
        key: 'neighborhood',
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
