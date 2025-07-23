<template>
  <div>
    <procedure-search @search-procedure="search">
      <slot />
    </procedure-search>
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
      @view-item="viewProcedure"
    />
  </div>
  <v-dialog v-model="viewProcedureDetails">
    <procedure-details :procedure-data="procedureData" @close="viewProcedureDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editProcedure"
    class="z-999"
  >
    <procedure-form :model-value="selectedProcedure" @close="editProcedure = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useProcedureApi } from '@/composables/modules/useProcedureModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useMeStore } from '@/stores/me';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useProcedureApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const meStore = useMeStore();
  const role = meStore.role
  const options = ref({});
  const viewProcedureDetails = ref(false);
  const procedureData = ref({});
  const editProcedure = ref(false);
  const selectedProcedure = ref({});
  const tooltipTextDelete = 'Não é possível excluir o procedimento enquanto houver solicitações vinculados a ele.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = procedure => {
    selectedProcedure.value = procedure
    editProcedure.value = true
  };

  const submit = async procedure => {
    await showFeedback(() => update(procedure.id, procedure));
    refetch();
    editProcedure.value = false
  };

  const handleDelete = async procedure => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o procedimento <strong>${procedure.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(procedure)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewProcedure = v => {
    procedureData.value = v;
    viewProcedureDetails.value = true;
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
        title: 'Procedimento',
        key: 'name',
        sortable: true,
        align: 'left',

      },

    ];
    if(role == 'regulation_officer' && (props.edit || props.showDelete)) {
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
