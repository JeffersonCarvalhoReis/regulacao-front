<template>
<base-card :title="title" @close="emit('close')">
  <v-card-text>
    <div class="flex gap-4 justify-end mb-2">
      <BaseButtonRegister button-text="Controle de Embarque" button-icon="mdi-bus-stop" @register="dialogExportCheckIn = true"/>
      <BaseButtonRegister button-text="Controle de Passageiros" button-icon="mdi-account" @register="dialogPassengerControl = true"/>
      <BaseButtonRegister button-text="Controle de Diárias" button-icon="mdi-home" @register="dialogPassengerDailyControl = true"/>
    </div>
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
          <div>Quantidade de passageiros: {{ props.travelData.quantity_passengers }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
    <h2 class="mx-5 text-xl capitalize">passageiros</h2>
    <base-table
      class="rounted-t-none m-5"
      :headers="headers"
      :items="props.travelData.patients"
      :hideDefaultFooter="true"
      :deletable="true"
      new-action
      :icon-new-action="changeTravelIcon"
      :class-new-action="changeTravelClass"
      :text-new-action="changeTravelText"
      @new-action="handlChangeTravel"
      @edit-item="handleEditPassengers"
      @delete-item="handleRemovePassenger"
      @view-item="handleView"
    >
    <template #item.companion_name="{ item }">
          {{ item.companion_name ? item.companion_name : 'Sem Acompanhante' }}
    </template>
    <template #item.appointment_date="{ item }">
      {{ formatDate(item.appointment_date) }}
    </template>
        <template #item.appointment_time="{ item }">
    <span class="lowercase">{{ `${item.appointment_time}h` }}</span>
    </template>
    <template #item.command="{ item }">
        <v-tooltip
          text="Ver Comanda"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-ita-green bg-white/0 border-0 ml-1 h-full"
              divided
              variant="outlined"
              icon
              @click="handleOpenCommand(item)"
            >
              <v-icon> mdi-text-box</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
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
  <v-dialog
    v-model="passengerDetails"
    class="z-999"
  >
    <TravelPassengerDetails @close="passengerDetails = false" :data="selectedPassengers"/>
  </v-dialog>
  <v-dialog
    v-model="dialogExportCheckIn"
  >
  <TravelPassengerCheckInList  @close="dialogExportCheckIn = false" :data="props.travelData" />
  </v-dialog>
    <v-dialog
    v-model="dialogPassengerControl"
  >
  <TravelPassengerControl  @close="dialogPassengerControl = false" :data="props.travelData" />
  </v-dialog>
    <v-dialog
    v-model="dialogPassengerDailyControl"
  >
  <TravelPassengerDailyControl @close="dialogPassengerDailyControl = false" :data="props.travelData" />
  </v-dialog>
  <v-dialog
    v-model="dialogChangeTravel"
    class="z-999"
  >
  <TravelChangePassengerDate @close="dialogChangeTravel = false" :patientData="selectedPassengers" :travelId="props.travelData.id" @reload=" handleReload" />
  </v-dialog>
  <v-dialog
    v-model="dialogCommand"
    class="z-999"
  >
  <TravelPassengerCommand @close="dialogCommand = false" :patientData="selectedPassengers"  />
  </v-dialog>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useAddPassengerApi } from '@/composables/modules/useAddPassagerModule';
  import TravelPassengerDetails from './TravelPassengerDetails.vue';
  import TravelPassengerCheckInList from './TravelPassengerCheckInList.vue';
  import TravelPassengerControl from './TravelPassengerControl.vue';
  import TravelChangePassengerDate from './TravelChangePassengerDate.vue';
import TravelPassengerCommand from './TravelPassengerCommand.vue';

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
  const dialogEditPassengers = ref(false);
  const passengerDetails = ref(false);
  const dialogExportCheckIn = ref(false);
  const dialogPassengerControl = ref(false);
  const dialogPassengerDailyControl = ref(false);
  const dialogChangeTravel = ref(false);
  const dialogCommand = ref(false);
  const changeTravelIcon = 'mdi-swap-horizontal';
  const changeTravelClass = 'text-ita-yellow bg-white/0 border-0 ml-1 h-full';
  const changeTravelText = 'Trocar Data da Viagem'

  const handleView = (v) => {
    passengerDetails.value = true
    selectedPassengers.value = v
  }
  const handlChangeTravel = (v) => {
    dialogChangeTravel.value = true;
    selectedPassengers.value = v
  }
  const handleEditPassengers = async (value) => {
    dialogEditPassengers.value = true;
    selectedPassengers.value = value;
  }
  const handleReload = () => {
    emit('refresh', props.travelData.id);
    dialogChangeTravel.value = false;
  }

  const handleOpenCommand = (v) => {
    dialogCommand.value = true;
    selectedPassengers.value = v
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
        width: '100px',
      },
      {
        title: 'Nome',
        key: 'name',
        sortable: false,
        align: 'left',

      },
      {
        title: 'Acompanhante',
        key: 'companion_name',
        sortable: false,
        align: 'left',

      },
      {
        title: 'Data da Consulta',
        key: 'appointment_date',
        sortable: false,
        align: 'center',
      },
      {
        title: 'Horário da Consulta',
        key: 'appointment_time',
        sortable: false,
        align: 'center',
      },
      {
        title: 'Comanda',
        key: 'command',
        sortable: false,
        align: 'center',
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
