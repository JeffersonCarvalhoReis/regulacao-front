<template>
  <div>
    <driver-search @search-driver="search">
      <slot />
    </driver-search>
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
      @view-item="viewDriver"
    />
  </div>
  <v-dialog v-model="viewDriverDetails">
    <driver-details :driver-data="driverData" @close="viewDriverDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editDriver"
    class="z-999"
  >
    <driver-form :model-value="selectedDriver" @close="editDriver = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useDriverApi } from '@/composables/modules/useDriverModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useDriverApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewDriverDetails = ref(false);
  const driverData = ref({});
  const editDriver = ref(false);
  const selectedDriver = ref({});
  const tooltipTextDelete = '.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = driver => {
    selectedDriver.value = driver
    editDriver.value = true
  };

  const submit = async driver => {
    await showFeedback(() => update(driver.id, driver));
    refetch();
    editDriver.value = false
  };

  const handleDelete = async driver => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o motorista <strong>${driver.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(driver)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewDriver = v => {
    driverData.value = v;
    viewDriverDetails.value = true;
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
        title: 'Motorista',
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
