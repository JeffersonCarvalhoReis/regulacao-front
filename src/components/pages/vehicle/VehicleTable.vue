<template>
  <div>
    <vehicle-search @search-vehicle="search">
      <slot />
    </vehicle-search>
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
      @edit-item="handleEdit"
    />
  </div>

  <v-dialog
    v-model="editVehicle"
    class="z-999"
  >
    <vehicle-form :model-value="selectedVehicle" @close="editVehicle = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useVehicleApi } from '@/composables/modules/useVehicleModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useVehicleApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const editVehicle = ref(false);
  const selectedVehicle = ref({});
  const tooltipTextDelete = '.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = vehicle => {
    selectedVehicle.value = vehicle
    editVehicle.value = true
  };

  const submit = async vehicle => {
    await showFeedback(() => update(vehicle.id, vehicle));
    refetch();
    editVehicle.value = false
  };

  const handleDelete = async vehicle => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o veículo <strong>${vehicle.vehicle_model}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(vehicle)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('vehicle_model', v);
    await nextTick()
    refetch();
  }, 500);

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
        title: 'Modelo',
        key: 'vehicle_model',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Placa',
        key: 'number_plate',
        sortable: true,
        align: 'center',

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
