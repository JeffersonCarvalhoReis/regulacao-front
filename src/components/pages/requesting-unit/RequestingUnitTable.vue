<template>
  <div>
    <requesting-unit-search @search-requesting-unit="search">
      <slot />
    </requesting-unit-search>
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
      @update-options="updateOptions"
      @view-item="viewRequestingUnit"
      @edit-item="handleEdit"
    />
  </div>
  <v-dialog v-model="viewRequestingUnitDetails">
    <requesting-unit-details :requesting-unit-data="requestingUnitData" @close="viewRequestingUnitDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editRequestingUnit"
    class="z-999"
  >
    <requesting-unit-form :model-value="selectedRequestingUnit" @close="editRequestingUnit = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useRequestingUnitApi } from '@/composables/modules/useRequestingUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy  } = useRequestingUnitApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewRequestingUnitDetails = ref(false);
  const requestingUnitData = ref({});
  const editRequestingUnit = ref(false);
  const selectedRequestingUnit = ref({});
  const tooltipTextDelete = 'Não é possível excluir a unidade enquanto houver solicitações vinculadas a ela.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = requestingUnit => {
    selectedRequestingUnit.value = requestingUnit
    editRequestingUnit.value = true
  };

  const submit = async requestingUnit => {
    await showFeedback(() => update(requestingUnit.id, requestingUnit));
    refetch();
    editRequestingUnit.value = false
  };

  const handleDelete = async requestingUnit => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a Unidade <strong>${requestingUnit.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(requestingUnit)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewRequestingUnit = v => {
    requestingUnitData.value = v;
    viewRequestingUnitDetails.value = true;
  }

  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  )


  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'left',
        width: '200px',
      },
      {
        title: 'Unidade Solicitante',
        key: 'name',
        sortable: true,
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
