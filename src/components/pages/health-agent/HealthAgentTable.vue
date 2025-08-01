<template>
  <div>
    <health-agent-search @search-health-agent="search">
      <slot />
    </health-agent-search>
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
      @view-item="viewHealthAgent"
    />
  </div>
  <v-dialog v-model="viewHealthAgentDetails">
    <health-agent-details :health-agent-data="healthAgentData" @close="viewHealthAgentDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editHealthAgent"
    class="z-999"
  >
    <health-agent-form :model-value="selectedHealthAgent" @close="editHealthAgent = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useHealthAgentApi } from '@/composables/modules/useHealthAgentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  });

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useHealthAgentApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewHealthAgentDetails = ref(false);
  const healthAgentData = ref({});
  const editHealthAgent = ref(false);
  const selectedHealthAgent = ref({});
  const tooltipTextDelete = 'Não é possível excluir o agente de saúde enquanto houver pacientes vinculados a ele.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = healthAgent => {
    selectedHealthAgent.value = healthAgent
    editHealthAgent.value = true
  };

  const submit = async healthAgent => {
    await showFeedback(() => update(healthAgent.id, healthAgent));
    refetch();
    editHealthAgent.value = false
  };

  const handleDelete = async healthAgent => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o Agente Comunitário de Saúde <strong>${healthAgent.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(healthAgent)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewHealthAgent = v => {
    healthAgentData.value = v;
    viewHealthAgentDetails.value = true;
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
        width: '150px',
      },
      {
        title: 'Agente Comunitário de Saúde',
        key: 'name',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Unidade de Saúde',
        key: 'health_unit',
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
