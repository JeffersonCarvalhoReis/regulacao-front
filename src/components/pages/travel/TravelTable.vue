<template>
  <div>
    <travel-search @search-travel="search" ref="travelSearchRef">
      <slot />
    </travel-search>
    <div class="text-left mt-4">
      <base-button-filter
        button-icon="mdi-text-box"
        button-text="Nova Comanda"
        @filters="dialogNewCommand = true"
      />
    </div>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :icon-new-action="iconAddPassenger"
      :items="data"
      :loading="loadingList"
      new-action
      :show-delete="props.showDelete"
      :text-new-action="textAddPassenger"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @new-action="handleAddPassenger"
      @update-options="updateOptions"
      @view-item="viewTravel"
    >
      <template #item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
    </base-table>
  </div>
  <v-dialog v-model="viewTravelDetails" class="z-990">
    <travel-details
      :travel-data="selectedTravel"
      @close="viewTravelDetails = false"
      @refresh="refreshPassengers"
    />
  </v-dialog>

  <v-dialog v-model="editTravel" class="z-999">
    <travel-form
      :model-value="selectedTravel"
      @close="editTravel = false"
      @save="submit"
    />
  </v-dialog>
  <v-dialog v-model="dialogAddPassenger" class="z-999">
    <travel-add-passenger-form
      :travel-data="selectedTravel"
      @close="dialogAddPassenger = false"
      @save="submitPassenger"
    />
  </v-dialog>
  <v-dialog v-model="dialogNewCommand">
    <travel-passenger-command
      :new-command="true"
      @close="dialogNewCommand = false"
    />
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useAddPassengerApi } from "@/composables/modules/useAddPassagerModule";
import { useTravelApi } from "@/composables/modules/useTravelModule";
import debounce from "lodash/debounce";

const props = defineProps({
  edit: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
});
const {
  data,
  loadingList,
  refetch,
  setTableOptions,
  meta,
  getById,
  setInclude,
  setFilter,
  update,
  destroy,
} = useTravelApi();
const { addPassenger } = useAddPassengerApi();
const { formatDate } = useFormatDate();
const { showFeedback, confirmModal, showFeedbackLoading } =
  useSweetAlertFeedback();

const options = ref({});
const viewTravelDetails = ref(false);
const editTravel = ref(false);
const selectedTravel = ref({});
const tooltipTextDelete =
  "Não é possível excluir viagem enquanto houver passageiros.";
const dialogAddPassenger = ref(false);
const dialogNewCommand = ref(false);
const travelSearchRef = ref(null);
const textAddPassenger = "Adicionar passageiros";
const iconAddPassenger = "mdi-account-multiple-plus";

const updateOptions = (newOptions) => {
  options.value = { ...newOptions };
};

const handleEdit = (travel) => {
  selectedTravel.value = travel;
  editTravel.value = true;
};
const refreshAll = async () => {
  await refetch();
  await travelSearchRef.value?.refreshTravelDates();
};

const handleAddPassenger = async (travel) => {
  dialogAddPassenger.value = true;
  refreshPassengers(travel.id);
};

const refreshPassengers = async (travelId) => {
  setInclude("companion_patient_travel", "companion_patient_travel_multi");
  const travelData = await getById(travelId);
  refreshAll();
  selectedTravel.value = travelData;
};

const submit = async (travel) => {
  await showFeedback(() => update(travel.id, travel));
  refreshAll();
  editTravel.value = false;
};

const submitPassenger = async (passenger) => {
  await showFeedback(() => addPassenger(selectedTravel.value.id, passenger));
  refreshAll();
  dialogAddPassenger.value = false;
};

const handleDelete = async (travel) => {
  const confirm = await confirmModal(
    `Tem certeza que deseja excluir a viagem do dia <strong>${formatDate(travel.date)}</strong>? com o motorista  <strong>${travel.driver}</strong>`,
    "Atenção",
  );
  if (confirm) {
    await showFeedback(() => destroy(travel));
    refreshAll();
  }
};

const search = debounce(async (v) => {
  setFilter("", v);
  await nextTick();
  refreshAll();
}, 500);

const viewTravel = async (travel) => {
  const travelData = await showFeedbackLoading(() => getById(travel.id));
  selectedTravel.value = travelData;
  viewTravelDetails.value = true;
};

watch(
  () => options.value,
  async (newOptions) => {
    await nextTick();
    setTableOptions(newOptions);
    refreshAll();
  },
  { deep: true },
);

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Detalhes",
      value: "view",
      align: "left",
      width: "50px",
    },
    {
      title: "Data da Viagem",
      key: "date",
      sortable: true,
      align: "left",
    },
    {
      title: "Horário da Viagem",
      key: "time",
      sortable: true,
      align: "left",
    },
    {
      title: "Motorista",
      key: "driver",
      sortable: true,
      align: "left",
    },
    {
      title: "Veículo",
      key: "vehicle",
      sortable: true,
      align: "left",
    },
    {
      title: "Quantidade de Passageiros",
      key: "quantity_passengers",
      sortable: false,
      align: "left",
    },
    {
      title: "Cidade",
      key: "city",
      sortable: true,
      align: "left",
    },
  ];
  if (props.edit || props.showDelete) {
    baseHeaders.push({
      title: "Ações",
      value: "action",
      width: "200px",
      align: "center",
    });
  }
  return baseHeaders;
});

defineExpose({
  refetch,
});
</script>
