<template>
  <div>
    <provider-unit-search @search-provider-unit="search">
      <slot />
    </provider-unit-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      :newAction="addDoctor"
      :iconNewAction="iconAddDoctor"
      :classNewAction="classAddDoctor"
      :textNewAction="textAddDoctor"
      @delete-item="handleDelete"
      @update-options="updateOptions"
      @view-item="viewProviderUnit"
      @edit-item="handleEdit"
      @new-action="openDoctorManager"
    />
  </div>
  <v-dialog v-model="viewProviderUnitDetails">
    <provider-unit-details :provider-unit-data="providerUnitData" @close="viewProviderUnitDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editProviderUnit"
    class="z-999"
  >
    <provider-unit-form :model-value="selectedProviderUnit" @close="editProviderUnit = false" @save="submit" />
  </v-dialog>

  <v-dialog
    v-model="dialogDoctorManager"
    class="z-999"
  >
    <provider-unit-doctor-manager :model-value="selectedProviderUnit" @close="dialogDoctorManager = false" @save="submitUpdateDoctors"  @update-table="updateTable" />
  </v-dialog>

</template>

<script setup>
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, clearFilters, update, destroy, setInclude } = useProviderUnitApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewProviderUnitDetails = ref(false);
  const providerUnitData = ref({});
  const editProviderUnit = ref(false);
  const dialogDoctorManager = ref(false)
  const selectedProviderUnit = ref({});
  const tooltipTextDelete = 'Não é possível excluir a unidade prestadora enquanto houver solicitações vinculadas a ela.'
  const addDoctor = true;
  const iconAddDoctor = 'mdi-doctor';
  const classAddDoctor = 'text-green-600 bg-white/0 border-0 ml-1 h-full';
  const textAddDoctor = 'Adicionar/Excluir médicos na unidade'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  }

  const handleEdit = providerUnit => {
    selectedProviderUnit.value = providerUnit
    editProviderUnit.value = true
  };

  const updateTable = () => {
    clearFilters();
    refetch();
  }

  const submit = async providerUnit => {
    await showFeedback(() => update(providerUnit.id, providerUnit));
    updateTable();
    editProviderUnit.value = false
  };
  const submitUpdateDoctors = async doctor => {
    await showFeedback(() => update(selectedProviderUnit.value.id, doctor));
    updateTable();
    dialogDoctorManager.value = false
  };

  const handleDelete = async providerUnit => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a Unidade Prestadora <strong>${providerUnit.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(providerUnit)) ;
      updateTable()
    }
  };

  const openDoctorManager = providerUnit => {
    selectedProviderUnit.value = providerUnit
    dialogDoctorManager.value = true
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewProviderUnit = v => {
    providerUnitData.value = v;
    viewProviderUnitDetails.value = true;
  }


  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      setInclude('doctors')
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
        title: 'Unidade Prestadora',
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
