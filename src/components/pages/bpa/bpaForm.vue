<template>
  <BaseCard
    class="max-w-[1050px] min-w-[1050px]"
    title="Gerar BPA"
    @close="emit('close')"
  >
    <div class="flex justify-end gap-4 m-4">
      <v-btn
        color="success"
        :loading="clickPrint"
        prepend-icon="mdi-printer"
        @click="handleExportToPDF"
      >
        Imprimir
        <v-tooltip activator="parent">Imprimir</v-tooltip>
      </v-btn>
    </div>
    <div class="p-5">
      <div ref="printSection" class="text-blue-900">
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
            Identificação do Paciente
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
                        @click="
                          removeProcedure(proc, index, patientBpaId, procedures)
                        "
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
            <div class="uppercase bg-blue-800 text-white text-center">
              Identificação do Acompanhante
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
                        @click="
                          removeProcedure(
                            index === 0 ? companionBpaId : extraCompanionBpaId,
                            procIndex,
                            comp.procedures,
                          )
                        "
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
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useBpaApi } from "@/composables/modules/useBpaModule";
import { useBpaProcedureApi } from "@/composables/modules/useBpaProcedureModule";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  travelId: { type: [String, Number], default: "" },
});

const { refetch, data, setFilter } = useBpaApi();
const { create, update, destroy } = useBpaProcedureApi();
const { confirmModal, showFeedback } = useSweetAlertFeedback();
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

const { formatDate } = useFormatDate();

const { exportToImagePDF, clickPrint } = useExportToPdf();

const printSection = ref(null);
const companions = ref([]);
const procedures = ref([]);
const patientBpaId = ref(null);
const companionBpaId = ref(null);
const extraCompanionBpaId = ref(null);
const originalProcedures = ref(new Map());

const times = 1;
const pages = 1;
const topMargin = 10;
const pixelRatio = 2;

const handleExportToPDF = () => {
  exportToImagePDF(printSection.value, times, pages, topMargin, pixelRatio);
};
const emit = defineEmits(["close"]);

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
  procedures: {},
});

onMounted(() => {
  setFilter("travel_id", props.travelId);
  setFilter("attendable_type", "patient");
  setFilter("attendable_id", props.modelValue.id);
  refetch();
  if (props.modelValue.companion_id) {
    setFilterCompanion("travel_id", props.travelId);
    setFilterCompanion("attendable_type", "companion");
    setFilterCompanion("attendable_id", props.modelValue.companion_id);
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

function formatCompetence(value) {
  if (!value || value.length !== 6) return "";

  const year = value.slice(0, 4);
  const month = value.slice(4, 6);

  return `${month}/${year}`;
}

watch(data, (value) => {
  if (!value?.length) return;
  const bpa = value[0];

  patientBpaId.value = value[0].id;

  form.establishment.name = bpa.health_unit?.name.toUpperCase() ?? "";
  form.establishment.cnes = bpa.health_unit?.cnes ?? "";

  form.professional.cns = bpa.professional?.cns ?? "";
  form.professional.name = bpa.professional?.name.toUpperCase() ?? "";
  form.professional.cbo = bpa.professional?.cbo ?? "";
  form.professional.competence = formatCompetence(bpa.competence);
  procedures.value =
    bpa.procedures.map((proc) => {
      const formatted = {
        id: proc.id,
        date: formatDate(proc.date),
        procedure_name: proc.procedure.name,
        procedure_code: proc.procedure.code,
        quantity: proc.quantity,
      };
      const key = `${bpa.id}-${proc.id}`;
      originalProcedures.value.set(key, { ...formatted });

      return formatted;
    }) || [];
});

function hasChanged(proc, bpaId) {
  if (!proc.id) return true;

  const key = `${bpaId}-${proc.id}`;
  const original = originalProcedures.value.get(key);
  if (!original) return true;

  return (
    formatToApiDate(proc.date) !== formatToApiDate(original.date) ||
    proc.procedure_name !== original.procedure_name ||
    String(proc.procedure_code) !== String(original.procedure_code) ||
    Number(proc.quantity) !== Number(original.quantity)
  );
}

const formatGender = (gender) => {
  const mapping = {
    M: "MASCULINO",
    F: "FEMININO",
    O: "OUTRO",
  };

  return mapping[gender] || gender.toUpperCase();
};
function createEmptyProcedure() {
  return {
    date: formatDate(data.value[0].procedures[0]?.date) || "",
    name: "",
    code: "",
    quantity: "",
  };
}

function addProcedureToCompanion(index) {
  const companion = companions.value[index];
  if (!companion.procedures) {
    companion.procedures = [];
  }
  companion.procedures.push(createEmptyProcedure());
}

function addProcedure() {
  procedures.value.push(createEmptyProcedure());
}

function formatToApiDate(date) {
  if (!date) return null;

  const [day, month, year] = date.split("/");

  if (!day || !month || !year) return null;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
  const payload = buildPayload(proc, bpaId);

  if (proc.id && !hasChanged(proc, bpaId)) {
    return;
  }

  if (proc.id) {
    await showFeedback(() => update(proc.id, payload));

    const key = `${bpaId}-${proc.id}`;
    originalProcedures.value.set(key, { ...proc });
  } else {
    const response = await showFeedback(() => create(payload));
    if (response?.id) {
      proc.id = response.id;

      const key = `${bpaId}-${proc.id}`;
      originalProcedures.value.set(key, { ...proc });
    }
  }
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
  const confirm = await confirmModal(
    "Realmente deseja excluir esse procedimento?",
    "Atenção",
  );

  if (!confirm) return;

  if (!proc.id)
    return await Promise.all(fetchCompanion(), refetch(), fetchExtraCompanion);

  if (proc) {
    await showFeedback(() => destroy(proc));
  }
  await refetch();
  list.splice(index, 1);
}

watch(
  () => props.modelValue,
  (patient) => {
    if (!patient) return;

    form.patient.cns = patient.cns ?? "";
    form.patient.name = patient.name.toUpperCase() ?? "";
    form.patient.gender = formatGender(patient.gender);
    form.patient.birth_date = formatDate(patient.birth_date) ?? "";
    form.patient.race = patient.race.toUpperCase() ?? "";
    form.patient.street = patient.street.toUpperCase() ?? "";
    form.patient.neighborhood = patient.neighborhood.toUpperCase() ?? "";
    form.patient.phone = patient.phone ?? "";
    form.patient.nacionality = import.meta.env.VITE_NACIONALITY ?? "";
    form.patient.ibge_code = import.meta.env.VITE_IBGE_CODE ?? "";
    form.patient.cep = import.meta.env.VITE_CEP ?? "";
  },
  { immediate: true },
);

watch(dataCompanion, (value) => {
  if (!value?.length) return;

  companionBpaId.value = value[0].id;

  companions.value = [
    {
      cns: props.modelValue.companion_cns ?? "",
      name: props.modelValue.companion_name?.toUpperCase() ?? "",
      gender: formatGender(props.modelValue.companion_gender),
      birth_date: formatDate(props.modelValue.companion_birth_date) ?? "",
      race: props.modelValue.companion_race?.toUpperCase() ?? "",
      street: props.modelValue.companion_street?.toUpperCase() ?? "",
      neighborhood:
        props.modelValue.companion_neighborhood?.toUpperCase() ?? "",
      phone: props.modelValue.companion_phone ?? "",
      procedures:
        value[0]?.procedures?.map((proc) => {
          const formatted = {
            id: proc.id,
            date: formatDate(proc.date),
            procedure_name: proc.procedure.name.toUpperCase(),
            procedure_code: proc.procedure.code,
            quantity: proc.quantity,
          };

          const key = `${companionBpaId.value}-${proc.id}`;
          originalProcedures.value.set(key, { ...formatted });

          return formatted;
        }) ?? [],
    },
  ];
});

watch(dataExtraCompanion, (value) => {
  if (!value?.length) return;

  extraCompanionBpaId.value = value[0].id;

  companions.value.push({
    cns: props.modelValue.extra_companions[0]?.companion.cns ?? "",
    name:
      props.modelValue.extra_companions[0]?.companion.name.toUpperCase() ?? "",
    gender: formatGender(
      props.modelValue.extra_companions[0]?.companion.gender,
    ),
    birth_date:
      formatDate(props.modelValue.extra_companions[0]?.companion.birth_date) ??
      "",
    race:
      props.modelValue.extra_companions[0]?.companion.race.toUpperCase() ?? "",
    street:
      props.modelValue.extra_companions[0]?.companion.street.toUpperCase() ??
      "",
    neighborhood:
      props.modelValue.extra_companions[0]?.companion.neighborhood.toUpperCase() ??
      "",
    phone: props.modelValue.extra_companions[0]?.companion.phone ?? "",
    procedures: value[0].procedures.map((proc) => {
      const formatted = {
        id: proc.id,
        date: formatDate(proc.date),
        procedure_name: proc.procedure.name.toUpperCase(),
        procedure_code: proc.procedure.code,
        quantity: proc.quantity,
      };

      const key = `${extraCompanionBpaId.value}-${proc.id}`;
      originalProcedures.value.set(key, { ...formatted });

      return formatted;
    }),
  });
});
</script>

<style scoped></style>
