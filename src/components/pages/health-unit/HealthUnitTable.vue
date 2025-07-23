<template>
  <div>
    <health-unit-search @search-health-unit="search">
      <slot />
    </health-unit-search>
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
      @view-item="viewHealthUnit"
    />
  </div>
  <v-dialog v-model="viewHealthUnitDetails">
    <health-unit-details :health-unit-data="healthUnitData" @close="viewHealthUnitDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editHealthUnit"
    class="z-999"
  >
    <health-unit-form :model-value="selectedHealthUnit" @close="editHealthUnit = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useHealthUnitApi } from '@/composables/modules/useHealthUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  });

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useHealthUnitApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewHealthUnitDetails = ref(false);
  const healthUnitData = ref({});
  const editHealthUnit = ref(false);
  const selectedHealthUnit = ref({});
  const tooltipTextDelete = 'Não é possível excluir a unidade de saúde enquanto houver agentes de saúde vinculados a ela.'


  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = healthUnit => {
    selectedHealthUnit.value = healthUnit
    editHealthUnit.value = true
  };

  const submit = async healthUnit => {
    await showFeedback(() => update(healthUnit.id, healthUnit));
    refetch();
    editHealthUnit.value = false
  };

  const handleDelete = async healthUnit => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a Unidade de Saúde <strong>${healthUnit.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(healthUnit)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewHealthUnit = v => {
    healthUnitData.value = v;
    viewHealthUnitDetails.value = true;
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
        align: 'left',
        width: '200px',
      },
      {
        title: 'Unidade de Saúde',
        key: 'name',
        sortable: true,
        align: 'left',
      },
      {
        title: 'CNES da Unidade',
        key: 'cnes',
        sortable: false,
        align: 'left',
      },

    ];
    if(props.edit || props.showDelete) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        width: '200px',
        align: 'center',
      });
    }
    return baseHeaders
  });

  defineExpose({
    refetch,
  });
</script>
