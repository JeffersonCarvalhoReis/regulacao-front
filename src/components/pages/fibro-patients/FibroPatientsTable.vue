<template>
  <base-table
    class="rounted-t-none"
    :headers="headers"
    :items="data"
    :loading="loadingList"
    new-action
    :text-new-action="textNewCard"
    :icon-new-action="iconNewCard"
    :total-items="meta.total"
    @delete-item="handleDelete"
    @edit-item="handleEdit"
    @update-options="updateOptions"
    @new-action="handleAction"
    @view-item="viewPatient"
  >
    <template #item.birth_date="{ item }">
      {{ formatDate(item.birth_date) }}
    </template>
  </base-table>

  <v-dialog v-model="editFibroPatient">
    <FibroPatientsForm
      :model-value="fibroPatientData"
      @close="editFibroPatient = false"
      @save="submit"
    />
  </v-dialog>

  <v-dialog v-model="viwPatientDetails">
    <FibroPatientsDetails
      :patient-data="fibroPatientData"
      @close="viwPatientDetails = false"
    />
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useFibroPatientsApi } from "@/composables/modules/useFibroPatientsModule";
import FibroPatientsForm from "./FibroPatientsForm.vue";

const {
  data,
  loadingList,
  refetch,
  setTableOptions,
  meta,
  setFilter,
  destroy,
  updateWithAttachment,
} = useFibroPatientsApi();
const { showFeedback, confirmModal } = useSweetAlertFeedback();

const { formatDate } = useFormatDate();

const options = ref({});
const fibroPatientData = ref({});
const editFibroPatient = ref(false);
const textNewCard = "Imprimir carteirinha";
const iconNewCard = "mdi-card-account-details";
const viwPatientDetails = ref(false);

const viewPatient = (v) => {
  fibroPatientData.value = v;
  viwPatientDetails.value = true;
};

const updateOptions = (newOptions) => {
  options.value = { ...newOptions };
};

const handleEdit = (patient) => {
  fibroPatientData.value = patient;
  editFibroPatient.value = true;
};
const handleAction = (patient) => {
  window.open(
    `${import.meta.env.VITE_BACKEND_URL}/api/carteirinha/${patient.id}`,
    "_blank"
  );
};

const handleDelete = async (fibroPatient) => {
  const confirm = await confirmModal(
    `Tem certeza que deseja excluir o paciente <strong>${fibroPatient.name}</strong>?`,
    "Atenção"
  );
  if (confirm) {
    await showFeedback(() => destroy(fibroPatient));
    refetch();
  }
};

const submit = async (fibroPatient) => {
  await showFeedback(() => updateWithAttachment(fibroPatient.id, fibroPatient));
  refetch();
  editFibroPatient.value = false;
};

watch(
  () => options.value,
  async (newOptions) => {
    await nextTick();
    setTableOptions(newOptions);
    refetch();
  },
  { deep: true }
);

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Detalhes",
      value: "view",
      align: "left",
      width: "200px",
    },
    {
      title: "Paciente",
      key: "name",
      sortable: true,
      align: "center",
    },
    {
      title: "Data de Nascimento",
      key: "birth_date",
      sortable: true,
      align: "center",
    },
    {
      title: "CPF",
      key: "cpf",
      sortable: true,
      align: "center",
    },
    {
      title: "Ações",
      value: "action",
      align: "center",
      width: "100px",
    },
  ];
  return baseHeaders;
});

defineExpose({
  refetch,
  setFilter,
});
</script>
