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
          <v-text-field
            v-model="proc.date"
            density="compact"
            label="Data do Atendimento"
            maxlength="100"
            variant="outlined"
            @blur="handleFieldBlur(proc, patientBpaId)"
          />
          <v-text-field
            v-model="proc.procedure_name"
            class="col-span-2"
            density="compact"
            label="Procedimento"
            maxlength="100"
            variant="outlined"
            @blur="handleFieldBlur(proc, patientBpaId)"
          />
          <v-text-field
            v-model="proc.procedure_code"
            class="col-span-2"
            density="compact"
            label="Código do Procedimento"
            maxlength="100"
            variant="outlined"
            type="number"
            inputmode="numeric"
            @blur="handleFieldBlur(proc, patientBpaId)"
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
            <v-text-field
              v-model="proc.date"
              density="compact"
              label="Data do Atendimento"
              maxlength="100"
              variant="outlined"
              @blur="
                handleFieldBlur(
                  proc,
                  index === 0 ? companionBpaId : extraCompanionBpaId,
                )
              "
            />
            <v-text-field
              v-model="proc.procedure_name"
              class="col-span-2"
              density="compact"
              label="Procedimento"
              maxlength="100"
              variant="outlined"
              @blur="
                handleFieldBlur(
                  proc,
                  index === 0 ? companionBpaId : extraCompanionBpaId,
                )
              "
            />
            <v-text-field
              v-model="proc.procedure_code"
              class="col-span-2"
              density="compact"
              label="Código do Procedimento"
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
const { confirmModal, showFeedback } = useSweetAlertFeedback();
const { formatDate } = useFormatDate();

const companions = ref([]);
const procedures = ref([]);
const patientBpaId = ref(null);
const companionBpaId = ref(null);
const extraCompanionBpaId = ref(null);
const originalProcedures = ref(new Map());

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

onMounted(() => {
  setFilter("travel_id", props.travelId);
  setFilter("attendable_type", "patient");
  setFilter("attendable_id", props.modelValue.id);
  refetch();

  if (props.modelValue.companion?.id) {
    setFilterCompanion("travel_id", props.travelId);
    setFilterCompanion("attendable_type", "companion");
    setFilterCompanion("attendable_id", props.modelValue.companion?.id);
    fetchCompanion();
  }

  if (props.modelValue.extra_companions?.length) {
    setFilterExtraCompanion("travel_id", props.travelId);
    setFilterExtraCompanion("attendable_type", "companion");
    setFilterExtraCompanion(
      "attendable_id",
      props.modelValue.extra_companions[0].companion.id,
    );
    fetchExtraCompanion();
  }
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

function formatToApiDate(date) {
  if (!date) return null;
  const [day, month, year] = date.split("/");
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function createEmptyProcedure(defaultDate = procedures.value[0].date) {
  return {
    date: defaultDate,
    procedure_name: "",
    procedure_code: "",
    quantity: 1,
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
    procedures: bpa.procedures?.map((proc) => mapProcedure(proc, bpaId)) ?? [],
  };
}

function mapProcedure(proc, bpaId) {
  const formatted = {
    id: proc.id,
    date: formatDate(proc.date),
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
    formatToApiDate(proc.date) !== formatToApiDate(original.date) ||
    proc.procedure_name !== original.procedure_name ||
    String(proc.procedure_code) !== String(original.procedure_code) ||
    Number(proc.quantity) !== Number(original.quantity)
  );
}

function buildPayload(proc, bpaId) {
  return {
    bpa_id: bpaId,
    date: formatToApiDate(proc.date),
    procedure_name: proc.procedure_name,
    procedure_code: proc.procedure_code,
    quantity: Number(proc.quantity),
  };
}

async function saveProcedure(proc, bpaId) {
  if (proc.id && !hasChanged(proc, bpaId)) return;

  const payload = buildPayload(proc, bpaId);

  if (proc.id) {
    await showFeedback(() => update(proc.id, payload));
    await reloadProcedures();
  } else {
    const response = await showFeedback(() => create(payload));
    if (response?.id) proc.id = response.id;
    await reloadProcedures();
  }

  originalProcedures.value.set(`${bpaId}-${proc.id}`, { ...proc });
}

function handleFieldBlur(proc, bpaRef) {
  const bpaId = unref(bpaRef);
  if (!bpaId) return;

  if (
    proc.date &&
    proc.procedure_name &&
    proc.procedure_code &&
    proc.quantity
  ) {
    saveProcedure(proc, bpaId);
  }
}

async function removeProcedure(proc, index, list) {
  if (!proc.id) {
    list.splice(index, 1);
    return;
  }
  const confirm = await confirmModal(
    "Realmente deseja excluir esse procedimento?",
    "Atenção",
  );

  if (!confirm) return;
  if (proc.id) {
    await showFeedback(() => destroy(proc));
  }

  list.splice(index, 1);
  await reloadProcedures();
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
