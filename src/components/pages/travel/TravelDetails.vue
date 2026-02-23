<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <div class="flex gap-4 justify-end mb-2 flex-wrap">
        <BaseButtonRegister
          button-icon="mdi-bus-stop"
          button-text="Controle de Embarque"
          @register="dialogExportCheckIn = true"
        />
        <BaseButtonRegister
          button-icon="mdi-account"
          button-text="Controle de Passageiros"
          @register="dialogPassengerControl = true"
        />
        <BaseButtonRegister
          button-icon="mdi-home"
          button-text="Controle de Diárias"
          @register="dialogPassengerDailyControl = true"
        />
        <BaseButtonRegister
          button-icon="mdi-file-document-multiple"
          button-text="Todos os BPA"
          @register="handleOpenAllBPA"
        />
      </div>
      <BaseSection>
        <InfoGroup class="pt-2" title="Partida">
          <div>Data: {{ formatDate(props.travelData.date) }}</div>
          <div>Hora: {{ props.travelData.time }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup class="pt-2" title="Destino">
          <div>
            Cidade:
            <span :class="textTransform">{{ props.travelData.city }}</span>
          </div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup class="pt-2" title="Informações Sobre a Viagem">
          <div>
            Motorista:
            <span :class="textTransform">{{ props.travelData.driver }}</span>
          </div>
          <div>
            Veículo:
            <span :class="textTransform">{{ props.travelData.vehicle }}</span>
          </div>
          <div>
            Quantidade de passageiros:
            {{ props.travelData.quantity_passengers }}
          </div>
          <div>Quantidade de assentos ocupados: {{ occupiedSeats() }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
    <h2 class="mx-5 text-xl capitalize">passageiros</h2>
    <base-table
      class="rounted-t-none m-5"
      :class-new-action="changeTravelClass"
      :deletable="true"
      :headers="headers"
      :hide-default-footer="true"
      :icon-new-action="changeTravelIcon"
      :items="props.travelData.patients"
      new-action
      :text-new-action="changeTravelText"
      @delete-item="handleRemovePassenger"
      @edit-item="handleEditPassengers"
      @new-action="handlChangeTravel"
      @view-item="handleView"
    >
      <template #item.name="{ item }">
        {{ `${item.name}${ageStringLabel(item.birth_date)}` }}
      </template>
      <template #item.companion_name="{ item }">
        <div>
          <div>
            {{
              item.companion
                ? `${item.companion.name + (item.kinship ? " - " + item.kinship : "")}`
                : "Sem Acompanhante"
            }}
          </div>
          <div v-for="(extra, i) in item.extra_companions" :key="i">
            {{
              `${extra.companion?.name} ${extra.kinship ? " - " + extra.kinship : ""}`
            }}
          </div>
        </div>
      </template>
      <template #item.appointment_date="{ item }">
        {{ formatDate(item.appointment_date) }}
      </template>
      <template #item.appointment_time="{ item }">
        <span class="lowercase">{{ `${item.appointment_time}h` }}</span>
      </template>
      <template #item.command="{ item }">
        <v-tooltip text="Ver Comanda">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-ita-green bg-white/0 border-0 ml-1 h-full"
              divided
              icon
              variant="outlined"
              @click="handleOpenCommand(item)"
            >
              <v-icon> mdi-text-box</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <template #item.bpa="{ item }">
        <v-tooltip text="Ver BPA">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="text-ita-blue bg-white/0 border-0 ml-1 h-full"
              divided
              icon
              variant="outlined"
              @click="handleOpenBPA(item)"
            >
              <v-icon> mdi-file-document-multiple</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </base-table>
  </base-card>
  <v-dialog v-model="dialogEditPassengers" class="z-999">
    <TravelAddPassengerForm
      :model-value="selectedPassengers"
      :travel-data="props.travelData"
      @close="dialogEditPassengers = false"
      @save="updatePassengers"
    />
  </v-dialog>
  <v-dialog v-model="passengerDetails" class="z-999">
    <TravelPassengerDetails
      :data="selectedPassengers"
      @close="passengerDetails = false"
    />
  </v-dialog>
  <v-dialog v-model="dialogExportCheckIn">
    <TravelPassengerCheckInList
      :data="props.travelData"
      @close="dialogExportCheckIn = false"
    />
  </v-dialog>
  <v-dialog v-model="dialogPassengerControl">
    <TravelPassengerControl
      :data="props.travelData"
      @close="dialogPassengerControl = false"
    />
  </v-dialog>
  <v-dialog v-model="dialogPassengerDailyControl">
    <TravelPassengerDailyControl
      :data="props.travelData"
      @close="dialogPassengerDailyControl = false"
    />
  </v-dialog>
  <v-dialog v-model="dialogChangeTravel" class="z-999">
    <TravelChangePassengerDate
      :patient-data="selectedPassengers"
      :travel-id="props.travelData.id"
      @close="dialogChangeTravel = false"
      @reload="handleReload"
    />
  </v-dialog>
  <v-dialog v-model="dialogCommand" class="z-999">
    <TravelPassengerCommand
      :patient-data="selectedPassengers"
      @close="dialogCommand = false"
    />
  </v-dialog>
  <v-dialog v-model="dialogBPA" class="z-999">
    <BpaFormWrapper
      :model-value="bpaValue"
      :travel-id="props.travelData.id"
      :mode="bpaMode"
      @close="dialogBPA = false"
    />
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useAddPassengerApi } from "@/composables/modules/useAddPassagerModule";
import TravelChangePassengerDate from "./TravelChangePassengerDate.vue";
import TravelPassengerCheckInList from "./TravelPassengerCheckInList.vue";
import TravelPassengerCommand from "./TravelPassengerCommand.vue";
import TravelPassengerControl from "./TravelPassengerControl.vue";
import TravelPassengerDetails from "./TravelPassengerDetails.vue";

const props = defineProps({
  travelData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "refresh"]);
const { formatDate } = useFormatDate();
const { showFeedback, confirmModal } = useSweetAlertFeedback();
const { updateCompanion, destroy: removePassenger } = useAddPassengerApi();
const { ageLabel } = useCalculateAge();

const title = "Viagem Agendada";
const textTransform = "uppercase";
const selectedPassengers = ref({});
const dialogEditPassengers = ref(false);
const passengerDetails = ref(false);
const dialogExportCheckIn = ref(false);
const dialogPassengerControl = ref(false);
const dialogPassengerDailyControl = ref(false);
const dialogChangeTravel = ref(false);
const dialogCommand = ref(false);
const dialogBPA = ref(false);
const bpaMode = ref("single");
const bpaValue = ref({});
const changeTravelIcon = "mdi-swap-horizontal";
const changeTravelClass = "text-ita-yellow bg-white/0 border-0 ml-1 h-full";
const changeTravelText = "Trocar Data da Viagem";

const ageStringLabel = (date) => {
  const stringLabel = ageLabel(date);
  if (!stringLabel) return "";
  return ` - ${stringLabel}`;
};

const occupiedSeats = () => {
  const patients = props.travelData.patients;
  let infant = 0;

  patients.forEach((patient) => {
    const result = ageLabel(patient.birth_date);
    if (result == "Criança de colo") infant++;
  });
  return props.travelData.quantity_passengers - infant;
};

const handleView = (v) => {
  passengerDetails.value = true;
  selectedPassengers.value = v;
};
const handlChangeTravel = (v) => {
  dialogChangeTravel.value = true;
  selectedPassengers.value = v;
};
const handleEditPassengers = async (value) => {
  dialogEditPassengers.value = true;
  selectedPassengers.value = value;
};
const handleReload = () => {
  emit("refresh", props.travelData.id);
  dialogChangeTravel.value = false;
};

const handleOpenCommand = (v) => {
  dialogCommand.value = true;
  selectedPassengers.value = v;
};

const handleOpenBPA = (v) => {
  dialogBPA.value = true;
  bpaValue.value = v;
  bpaMode.value = "single";
};
const handleOpenAllBPA = () => {
  dialogBPA.value = true;
  bpaValue.value = props.travelData.patients;
  bpaMode.value = "multiple";
};

const updatePassengers = async (values) => {
  await showFeedback(() => updateCompanion(props.travelData.id, values));
  dialogEditPassengers.value = false;
  emit("refresh", props.travelData.id);
};

const handleRemovePassenger = async (values) => {
  const data = {
    patient_id: values.id,
    companion_id: values.companion_id,
  };
  const confirm = await confirmModal(
    `Tem certeza que deseja excluir o paciente <strong>${values.name}</strong> dessa viagem??`,
    "Atenção",
  );
  if (confirm) {
    await showFeedback(() => removePassenger(props.travelData.id, data));
    emit("refresh", props.travelData.id);
  }
};

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Detalhes",
      value: "view",
      align: "left",
      width: "100px",
    },
    {
      title: "Nome",
      key: "name",
      sortable: false,
      align: "left",
    },
    {
      title: "Acompanhante",
      key: "companion_name",
      sortable: false,
      align: "left",
    },
    {
      title: "Data da Consulta",
      key: "appointment_date",
      sortable: false,
      align: "center",
    },
    {
      title: "Horário da Consulta",
      key: "appointment_time",
      sortable: false,
      align: "center",
    },
    {
      title: "Comanda",
      key: "command",
      sortable: false,
      align: "center",
    },
    {
      title: "BPA",
      key: "bpa",
      sortable: false,
      align: "center",
    },
    {
      title: "Ações",
      value: "action",
      width: "200px",
      align: "center",
    },
  ];

  return baseHeaders;
});
</script>

<style lang="scss" scoped></style>
