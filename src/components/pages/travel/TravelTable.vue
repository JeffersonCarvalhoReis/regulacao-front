<template>
  <div>
    <travel-search @search-travel="search">
      <slot />
    </travel-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      new-action
      :icon-new-action="iconAddPassenger"
      :text-new-action="textAddPassenger"
      @delete-item="handleDelete"
      @update-options="updateOptions"
      @view-item="viewTravel"
      @edit-item="handleEdit"
      @new-action="handleAddPassenger"
    >
    <template #item.date="{ item }">
          {{ formatDate(item.date) }}
    </template>
  </base-table>
  </div>
  <v-dialog v-model="viewTravelDetails"
  class="z-990"
  >
    <travel-details
      :travel-data="selectedTravel"
      @close="viewTravelDetails = false"
      @refresh="refreshPassengers"
      />
  </v-dialog>

  <v-dialog
    v-model="editTravel"
    class="z-999"
  >
    <travel-form :model-value="selectedTravel" @close="editTravel = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogAddPassenger"
    class="z-999"
  >
    <travel-add-passenger-form
      :travel-data="selectedTravel"
      @close="dialogAddPassenger = false"
      @save="submitPassenger"
     />
  </v-dialog>
</template>

<script setup>
  import { useTravelApi } from '@/composables/modules/useTravelModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useAddPassengerApi } from '@/composables/modules/useAddPassagerModule';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, getById, setInclude, setFilter, update, destroy } = useTravelApi();
  const { addPassenger } = useAddPassengerApi();
  const { formatDate } = useFormatDate();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewTravelDetails = ref(false);
  const editTravel = ref(false);
  const selectedTravel = ref({});
  const tooltipTextDelete = 'Não é possível excluir viagem enquanto houver passageiros.'
  const dialogAddPassenger = ref(false)
  const textAddPassenger = 'Adicionar passageiros'
  const iconAddPassenger = 'mdi-account-multiple-plus'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = travel => {
    selectedTravel.value = travel
    editTravel.value = true
  };

  const handleAddPassenger = async (travel) => {
    dialogAddPassenger.value = true
    refreshPassengers(travel.id)
  }

  const refreshPassengers = async (travelId) => {
    setInclude('companion_patient_travel')
    const travelData = await getById(travelId);
    refetch()
    selectedTravel.value = travelData
  }

  const submit = async travel => {
    await showFeedback(() => update(travel.id, travel));
    refetch();
    editTravel.value = false
  };

  const submitPassenger = async passenger => {
    await showFeedback(() => addPassenger(selectedTravel.value.id, passenger));
    refetch();
    dialogAddPassenger.value = false
  }

  const handleDelete = async travel => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a viagem do dia <strong>${formatDate(travel.date)}</strong>? com o motorista  <strong>${travel.driver}</strong>`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(travel)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('', v);
    await nextTick()
    refetch();
  }, 500);

  const viewTravel = async travel => {
    const travelData = await getById(travel.id);
    selectedTravel.value = travelData
    viewTravelDetails.value = true;
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
        width: '50px',
      },
      {
        title: 'Data da Viagem',
        key: 'date',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Horário da Viagem',
        key: 'time',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Motorista',
        key: 'driver',
        sortable: true,
        align: 'left',

      },
            {
        title: 'Veículo',
        key: 'vehicle',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Vagas Restante',
        key: 'remaining_seats',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Vagas Prioritarias Restante',
        key: 'remaining_priority_seats',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Cidade',
        key: 'city',
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
