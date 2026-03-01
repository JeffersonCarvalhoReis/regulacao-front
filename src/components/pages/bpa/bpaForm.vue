<template>
  <div class="a4-page">
    <div>
      <img src="@/assets/images/bpa-header.png" alt="Cabeçalho do BPA" />
    </div>
    <div class="border-2 mt-1">
      <div class="uppercase bg-blue-800 text-white text-center">
        Identificação do estabelecimento de saúde
      </div>
      <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
        <v-text-field
          v-model="form.establishment.name"
          readonly
          class="col-span-4"
          density="compact"
          label="Nome do Estabelecimento de Saúde"
          variant="outlined"
        />
        <v-text-field
          readonly
          v-model="form.establishment.cnes"
          density="compact"
          label="CNES"
          variant="outlined"
        />
      </div>
      <div class="uppercase bg-blue-800 text-white text-center">
        Identificação do Profissional
      </div>
      <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
        <v-text-field
          v-model="form.professional.cns"
          readonly
          class="col-span-2"
          density="compact"
          label="CNS"
          variant="outlined"
        />
        <v-text-field
          v-model="form.professional.name"
          readonly
          class="col-span-3"
          density="compact"
          label="Nome do Profissional"
          variant="outlined"
        />
        <v-text-field
          v-model="form.professional.cbo"
          readonly
          class="col-span-3"
          density="compact"
          label="CBO"
          variant="outlined"
        />
        <v-text-field
          v-model="form.professional.competence"
          readonly
          class="col-span-2"
          density="compact"
          label="Mês/Ano"
          variant="outlined"
        />
      </div>
      <div class="uppercase bg-blue-800 text-white text-center">
        1 - Identificação do Paciente
      </div>
      <div class="grid grid-cols-6 gap-x-2 mx-2 mt-4">
        <v-text-field
          v-model="form.patient.cns"
          readonly
          class="col-span-3"
          density="compact"
          label="Cartão Nacional de Saúde (CNS)"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.name"
          readonly
          class="col-span-3"
          density="compact"
          label="Nome do Paciente"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.gender"
          readonly
          density="compact"
          label="Gênero"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.birth_date"
          readonly
          density="compact"
          label="Data de Nascimento"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.nacionality"
          readonly
          density="compact"
          label="Nacionalidade"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.race"
          readonly
          density="compact"
          label="Raça/Cor"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.cep"
          readonly
          density="compact"
          label="CEP"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.ibge_code"
          readonly
          density="compact"
          label="Cód. IBGE Município"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.street"
          readonly
          class="col-span-3"
          density="compact"
          label="Endereço"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.neighborhood"
          readonly
          class="col-span-2"
          density="compact"
          label="Bairro"
          maxlength="100"
          variant="outlined"
        />
        <v-text-field
          v-model="form.patient.phone"
          readonly
          density="compact"
          label="Telefone de Contato"
          maxlength="100"
          variant="outlined"
        />
      </div>
      <div class="uppercase bg-blue-800 text-white text-center mb-4">
        Procedimento Realizado
      </div>

      <div v-for="(proc, index) in procedures" :key="'patient-' + index">
        <div class="grid grid-cols-6 gap-x-2 mx-2">
          <base-input-date-picker
            v-model="proc.date"
            label="Data do Atendimento"
            position="top"
            @change="handleFieldBlur(proc, patientBpaId)"
          />

          <v-autocomplete
            v-model="proc.procedure_selected"
            :items="proceduresPatient"
            item-title="name"
            return-object
            class="col-span-2"
            density="compact"
            label="Procedimento"
            variant="outlined"
            @update:modelValue="onProcedureSelected(proc, patientBpaId)"
          />
          <v-autocomplete
            v-model="proc.procedure_selected"
            :items="proceduresPatient"
            item-title="code"
            return-object
            class="col-span-2"
            density="compact"
            label="Código do Procedimento"
            variant="outlined"
            @update:modelValue="onProcedureSelected(proc, patientBpaId)"
          />
          <div>
            <div class="flex flex-row justify-end">
              <v-text-field
                v-model="proc.quantity"
                density="compact"
                label="Qtde."
                maxlength="100"
                variant="outlined"
                type="number"
                inputmode="numeric"
                @blur="handleFieldBlur(proc, patientBpaId)"
              />
              <v-tooltip text="Remover procedimento">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    v-if="index > 0"
                    icon="mdi-delete-outline"
                    variant="text"
                    color="red-darken-2"
                    @click="removeProcedure(proc, index, procedures)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Adicionar novo procedimento">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    v-if="index === 0"
                    icon="mdi-plus-box-outline"
                    variant="text"
                    color="blue-darken-3"
                    @click="addProcedure"
                  />
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div v-for="(comp, index) in companions" :key="index">
        <div v-if="index === 1" class="page-break" />

        <div class="uppercase bg-blue-800 text-white text-center">
          {{ index + 2 }} - Identificação do Acompanhante
        </div>
        <div class="grid grid-cols-6 gap-x-2 mx-2 mt-4">
          <v-text-field
            v-model="comp.cns"
            readonly
            class="col-span-3"
            density="compact"
            label="Cartão Nacional de Saúde (CNS)"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.name"
            readonly
            class="col-span-3"
            density="compact"
            label="Nome do Paciente"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.gender"
            readonly
            density="compact"
            label="Gênero"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.birth_date"
            readonly
            density="compact"
            label="Data de Nascimento"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="form.patient.nacionality"
            readonly
            density="compact"
            label="Nacionalidade"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.race"
            readonly
            density="compact"
            label="Raça/Cor"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="form.patient.cep"
            readonly
            density="compact"
            label="CEP"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="form.patient.ibge_code"
            readonly
            density="compact"
            label="Cód. IBGE Município"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.street"
            readonly
            class="col-span-3"
            density="compact"
            label="Endereço"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.neighborhood"
            readonly
            class="col-span-2"
            density="compact"
            label="Bairro"
            maxlength="100"
            variant="outlined"
          />
          <v-text-field
            v-model="comp.phone"
            readonly
            density="compact"
            label="Telefone de Contato"
            maxlength="100"
            variant="outlined"
          />
        </div>
        <div class="uppercase bg-blue-800 text-white text-center">
          Procedimento Realizado
        </div>
        <div
          v-for="(proc, procIndex) in comp.procedures"
          :key="'comp-proc-' + index + '-' + procIndex"
        >
          <div class="grid grid-cols-6 gap-x-2 mx-2 mt-4">
            <base-input-date-picker
              v-model="proc.date"
              label="Data do Atendimento"
              position="top"
              @change="
                handleFieldBlur(
                  proc,
                  index === 0 ? companionBpaId : extraCompanionBpaId,
                )
              "
            />
            <v-autocomplete
              v-model="proc.procedure_selected"
              :items="proceduresCompanion"
              item-title="name"
              return-object
              class="col-span-2"
              density="compact"
              label="Procedimento"
              variant="outlined"
              @update:modelValue="
                onProcedureSelected(
                  proc,
                  index === 0 ? companionBpaId : extraCompanionBpaId,
                )
              "
            />
            <v-autocomplete
              v-model="proc.procedure_selected"
              :items="proceduresCompanion"
              item-title="code"
              return-object
              class="col-span-2"
              density="compact"
              label="Código do Procedimento"
              variant="outlined"
              @update:modelValue="
                onProcedureSelected(
                  proc,
                  index === 0 ? companionBpaId : extraCompanionBpaId,
                )
              "
            />

            <div class="flex flex-row justify-end">
              <v-text-field
                v-model="proc.quantity"
                density="compact"
                label="Qtde."
                maxlength="100"
                variant="outlined"
                type="number"
                inputmode="numeric"
                @blur="
                  handleFieldBlur(
                    proc,
                    index === 0 ? companionBpaId : extraCompanionBpaId,
                  )
                "
              />
              <v-tooltip text="Remover procedimento">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    v-if="procIndex > 0"
                    icon="mdi-delete-outline"
                    variant="text"
                    color="red-darken-2"
                    @click="removeProcedure(proc, procIndex, comp.procedures)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Adicionar novo procedimento">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    v-if="procIndex === 0"
                    icon="mdi-plus-box-outline"
                    variant="text"
                    color="blue-darken-3"
                    @click="addProcedureToCompanion(index)"
                  />
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div v-if="props.mode !== 'single'" class="page-number">
        {{ currentPage }}
      </div>
    </div>
    <div class="page-break" />
  </div>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="2500"
    location="bottom center"
    class="mb-10"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useBpaApi } from "@/composables/modules/useBpaModule";
import { useBpaProcedureApi } from "@/composables/modules/useBpaProcedureModule";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  travelId: { type: [String, Number], default: "" },
  currentPage: { type: Number, default: 1 },
  mode: { type: String, default: "single" },
});

const { refetch, data, setFilter } = useBpaApi();
const {
  refetch: fetchCompanion,
  data: dataCompanion,
  setFilter: setFilterCompanion,
} = useBpaApi();
const {
  refetch: fetchExtraCompanion,
  data: dataExtraCompanion,
  setFilter: setFilterExtraCompanion,
} = useBpaApi();

const { create, update, destroy } = useBpaProcedureApi();
const { confirmModal, showFeedback, showFeedbackLoading } =
  useSweetAlertFeedback();
const { formatDate } = useFormatDate();

const companions = ref([]);
const procedures = ref([]);
const patientBpaId = ref(null);
const companionBpaId = ref(null);
const extraCompanionBpaId = ref(null);
const originalProcedures = ref(new Map());

const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

const form = reactive({
  establishment: { name: "", cnes: "" },
  professional: { cns: "", name: "", cbo: "", competence: "" },
  patient: {
    cns: "",
    name: "",
    gender: "",
    birth_date: "",
    race: "",
    street: "",
    neighborhood: "",
    phone: "",
    cep: "",
    ibge_code: "",
    nacionality: "",
  },
});

const proceduresPatient = [
  {
    name: "TRANSPORTE",
    code: "0803010125",
  },
  {
    name: "PERNOITE",
    code: "0803010010",
  },
  {
    name: "ALIMENTAÇÃO",
    code: "0803010028",
  },
];
const proceduresCompanion = [
  {
    name: "TRANSPORTE",
    code: "0803010109",
  },
  {
    name: "PERNOITE",
    code: "0803010044",
  },
  {
    name: "ALIMENTAÇÃO",
    code: "0803010052",
  },
];

async function loadAll() {
  await refetch();
  if (props.modelValue.companion?.id) {
    await fetchCompanion();
  }

  if (props.modelValue.extra_companions?.length) {
    await fetchExtraCompanion();
  }
}
function showSnackbar(message, color = "success") {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
}
onMounted(async () => {
  setFilter("travel_id", props.travelId);
  setFilter("attendable_type", "patient");
  setFilter("attendable_id", props.modelValue.id);

  if (props.modelValue.companion?.id) {
    setFilterCompanion("travel_id", props.travelId);
    setFilterCompanion("attendable_type", "companion");
    setFilterCompanion("attendable_id", props.modelValue.companion?.id);
  }

  if (props.modelValue.extra_companions?.length) {
    setFilterExtraCompanion("travel_id", props.travelId);
    setFilterExtraCompanion("attendable_type", "companion");
    setFilterExtraCompanion(
      "attendable_id",
      props.modelValue.extra_companions[0].companion.id,
    );
  }
  await showFeedbackLoading(() => loadAll());
});

watch(
  () => props.modelValue,
  (patient) => {
    if (!patient) return;

    form.patient.cns = patient.cns ?? "";
    form.patient.name = patient.name?.toUpperCase() ?? "";
    form.patient.gender = formatGender(patient.gender);
    form.patient.birth_date = formatDate(patient.birth_date) ?? "";
    form.patient.race = patient.race?.toUpperCase() ?? "";
    form.patient.street = patient.street?.toUpperCase() ?? "";
    form.patient.neighborhood = patient.neighborhood?.toUpperCase() ?? "";
    form.patient.phone = patient.phone ?? "";
    form.patient.nacionality = import.meta.env.VITE_NACIONALITY ?? "";
    form.patient.ibge_code = import.meta.env.VITE_IBGE_CODE ?? "";
    form.patient.cep = import.meta.env.VITE_CEP ?? "";
  },
  { immediate: true },
);

watch(data, (value) => {
  if (!value?.length) return;
  hydratePatientBpa(value[0]);
});

watch(dataCompanion, (value) => {
  if (!value?.length) return;
  hydrateCompanion(value[0]);
});

watch(dataExtraCompanion, (value) => {
  if (!value?.length) return;
  hydrateExtraCompanion(value[0]);
});
async function reloadProcedures() {
  companions.value = [];
  await Promise.all([refetch(), fetchCompanion(), fetchExtraCompanion()]);
}
function formatCompetence(value) {
  if (!value || value.length !== 6) return "";
  return `${value.slice(4, 6)}/${value.slice(0, 4)}`;
}

function formatGender(gender) {
  const mapping = {
    M: "MASCULINO",
    F: "FEMININO",
    O: "OUTRO",
  };
  return mapping[gender] || gender?.toUpperCase();
}

function createEmptyProcedure(defaultDate = procedures.value[0]?.date ?? null) {
  return {
    id: null,
    date: defaultDate,
    procedure_selected: null,
    procedure_name: "",
    procedure_code: "",
    quantity: 1,
    _deleted: false,
    _saving: false,
  };
}

function hydratePatientBpa(bpa) {
  patientBpaId.value = bpa.id;

  form.establishment.name = bpa.health_unit?.name?.toUpperCase() ?? "";
  form.establishment.cnes = bpa.health_unit?.cnes ?? "";

  form.professional.cns = bpa.professional?.cns ?? "";
  form.professional.name = bpa.professional?.name?.toUpperCase() ?? "";
  form.professional.cbo = bpa.professional?.cbo ?? "";
  form.professional.competence = formatCompetence(bpa.competence);

  procedures.value =
    bpa.procedures?.map((proc) => mapProcedure(proc, bpa.id)) ?? [];
}

function hydrateCompanion(bpa) {
  companionBpaId.value = bpa.id;

  const companionObj = buildCompanionObject(
    props.modelValue.companion,
    bpa,
    companionBpaId.value,
  );

  const existingIndex = companions.value.findIndex(
    (c) => c.cns === companionObj.cns,
  );

  if (existingIndex !== -1) {
    companions.value[existingIndex] = companionObj;
  } else {
    companions.value.push(companionObj);
  }
}
function hydrateExtraCompanion(bpa) {
  extraCompanionBpaId.value = bpa.id;

  const extraObj = buildCompanionObject(
    props.modelValue.extra_companions[0].companion,
    bpa,
    extraCompanionBpaId.value,
  );

  const existingIndex = companions.value.findIndex(
    (c) => c.cns === extraObj.cns,
  );

  if (existingIndex !== -1) {
    companions.value[existingIndex] = extraObj;
  } else {
    companions.value.push(extraObj);
  }
}

function buildCompanionObject(source, bpa, bpaId) {
  return {
    cns: source.cns ?? "",
    name: source.name?.toUpperCase() ?? "",
    gender: formatGender(source.gender),
    birth_date: formatDate(source.birth_date) ?? "",
    race: source.race?.toUpperCase() ?? "",
    street: source.street?.toUpperCase() ?? "",
    neighborhood: source.neighborhood?.toUpperCase() ?? "",
    phone: source.phone ?? "",
    procedures:
      bpa.procedures?.map((proc) =>
        mapProcedure(proc, bpaId, proceduresCompanion),
      ) ?? [],
  };
}

function mapProcedure(proc, bpaId, items = proceduresPatient) {
  const selected = items.find((p) => p.code === proc.procedure.code);

  const formatted = {
    id: proc.id,
    date: proc.date,
    procedure_selected: selected ?? null,
    procedure_name: proc.procedure.name?.toUpperCase(),
    procedure_code: proc.procedure.code,
    quantity: proc.quantity,
  };

  originalProcedures.value.set(`${bpaId}-${proc.id}`, { ...formatted });

  return formatted;
}
function hasChanged(proc, bpaId) {
  if (!proc.id) return true;

  const original = originalProcedures.value.get(`${bpaId}-${proc.id}`);
  if (!original) return true;

  return (
    proc.date !== original.date ||
    proc.procedure_name !== original.procedure_name ||
    String(proc.procedure_code) !== String(original.procedure_code) ||
    Number(proc.quantity) !== Number(original.quantity)
  );
}

async function onProcedureSelected(proc, bpaRef) {
  const bpaId = unref(bpaRef);
  if (!bpaId || !proc.procedure_selected) return;

  proc.procedure_name = proc.procedure_selected.name.toUpperCase();
  proc.procedure_code = proc.procedure_selected.code;

  if (proc.date && proc.quantity) {
    await saveProcedure(proc, bpaId);
  }
}

function buildPayload(proc, bpaId) {
  return {
    bpa_id: bpaId,
    date: proc.date,
    procedure_name: proc.procedure_name,
    procedure_code: proc.procedure_code,
    quantity: Number(proc.quantity),
  };
}
async function saveProcedure(proc, bpaId) {
  if (proc._deleted) return;

  if (proc.id && !hasChanged(proc, bpaId)) return;

  proc._saving = true;

  const payload = buildPayload(proc, bpaId);

  try {
    if (proc.id) {
      const response = await update(proc.id, payload);
      showSnackbar(response.message);
    } else {
      const response = await create(payload);

      if (proc._deleted && response?.id) {
        await destroy(response.id);
        return;
      }

      if (response?.data?.id) {
        proc.id = response.data.id;
      }
      showSnackbar(response.message);
    }

    originalProcedures.value.set(`${bpaId}-${proc.id}`, { ...proc });
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      Object.values(error?.response?.data?.errors ?? {})?.flat()?.[0] ||
      "Erro inesperado.";

    showSnackbar(backendMessage, "error");
  } finally {
    proc._saving = false;
  }
}
function handleFieldBlur(proc, bpaRef) {
  const bpaId = unref(bpaRef);
  if (!bpaId) return;

  if (proc.date && proc.procedure_selected && proc.quantity) {
    saveProcedure(proc, bpaId);
  }
}

async function removeProcedure(proc, index, list) {
  proc._deleted = true;

  if (!proc.id) {
    list.splice(index, 1);
    return;
  }

  const confirm = await confirmModal(
    "Realmente deseja excluir esse procedimento?",
    "Atenção",
  );

  if (!confirm) {
    proc._deleted = false;
    return;
  }

  await showFeedback(() => destroy(proc));

  list.splice(index, 1);
}
function addProcedure() {
  procedures.value.push(createEmptyProcedure());
}

function addProcedureToCompanion(index) {
  companions.value[index]?.procedures.push(createEmptyProcedure());
}
</script>
<style scoped>
.a4-page {
  min-height: auto;
  width: 270mm;
  position: relative;
  margin-bottom: 20px;
}
.page-number {
  position: absolute;
  top: 1.8px;
  right: 2px;
  font-size: 16px;
  border-bottom: 2px solid;
  border-left: 2px solid;
  width: 24px;
  text-align: center;
}
</style>
