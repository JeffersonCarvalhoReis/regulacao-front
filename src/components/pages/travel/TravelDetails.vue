<template>
<base-card :title="title" @close="emit('close')">
  <v-card-text>
      <BaseSection>
          <InfoGroup title="Partida" class="pt-2">
          <div>Data: {{ formatDate(props.travelData.date) }}</div>
          <div>Hora: {{ props.travelData.time }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Destino" class="pt-2">
          <div>Cidade: <span :class="textTransform">{{ props.travelData.city }}</span></div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup  title="Informações Sobre a Viagem" class="pt-2">
          <div>Motorista: <span :class="textTransform">{{ props.travelData.driver }}</span></div>
          <div>Veículo: <span :class="textTransform">{{ props.travelData.vehicle }}</span></div>
          <div>Vagas Restantes: {{ props.travelData.remaining_seats }}</div>
          <div>Vagas Prioritárias Restantes: {{ props.travelData.remaining_priority_seats }}</div>
          <div v-if="props.travelData.remaining_seats + props.travelData.remaining_priority_seats < 1" class="text-red-500 text-uppercase">
            Viagem lotada
          </div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
    <h2 class="mx-5 text-xl capitalize">passageiros</h2>
    <base-table
      class="rounted-t-none m-5"
      :headers="headers"
      :items="props.travelData.patients"
      :hideDefaultFooter="true"
      @edit-item="handleEditPassengers"
      @delete-item="handleRemovePassenger"
    >
    <template #item.date="{ item }">
          {{ formatDate(item.date) }}
    </template>
    <template #item.companion_name="{ item }">
          {{ item.companion_name ?? 'Sem Acompanhante' }}
    </template>
  </base-table>
  </base-card>
  <v-dialog
    v-model="dialogEditPassengers"
    class="z-999"
  >
  <TravelAddPassengerForm
    :model-value="selectedPassengers"
    :travel-data="props.travelData"
    @close="dialogEditPassengers = false"
    @save="updatePassengers"
     />
  </v-dialog>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useAddPassengerApi } from '@/composables/modules/useAddPassagerModule';

  const props = defineProps({
    travelData: { type: Object, default: () => ({}) },
  })
  const emit = defineEmits(['close', 'refresh'])
  const { formatDate } = useFormatDate();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const { updateCompanion, destroy: removePassenger } = useAddPassengerApi();

  const title = 'Viagem Agendada'
  const textTransform = 'uppercase'
  const selectedPassengers = ref({})
  const dialogEditPassengers = ref(false)

  const handleEditPassengers = async (value) => {
    dialogEditPassengers.value = true;
    selectedPassengers.value = value;
  }

  const updatePassengers = async values => {
    await showFeedback(() => updateCompanion(props.travelData.id, values))
    dialogEditPassengers.value = false;
    emit('refresh', props.travelData.id)
  }

  const handleRemovePassenger = async (values) => {
    const data = {
      patient_id: values.id,
      companion_id: values.companion_id
    }
    const confirm = await confirmModal(`Tem certeza que deseja excluir o paciente <strong>${values.name}</strong> dessa viagem??`, 'Atenção');
    if(confirm) {
      await showFeedback(() => removePassenger(props.travelData.id, data)) ;
      emit('refresh', props.travelData.id)
    }
  }

  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'left',
        width: '200px',
      },
      {
        title: 'Nome',
        key: 'name',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Acompanhante',
        key: 'companion_name',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Ações',
        value: 'action',
        width: '200px',
        align: 'center',
      }

    ];

    return baseHeaders
  });

</script>

<style lang="scss" scoped>

</style>
