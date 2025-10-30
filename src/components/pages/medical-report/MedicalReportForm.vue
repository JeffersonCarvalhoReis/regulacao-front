<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <!-- progress + sections -->
      <div class="bg-gray-100 px-6 py-4">
        <div class="flex items-center justify-between mb-2">
          <div
            v-for="(section, index) in sections"
            :key="index"
            class="flex flex-col items-center flex-1"
          >
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform active:scale-95 active:translate-y-0.5',
                index === currentSection
                  ? 'bg-blue-600 text-white hover:outline-2 outline-blue-500'
                  : index < currentSection
                  ? 'bg-green-500 text-white hover:outline-2 outline-blue-500'
                  : 'bg-gray-300 text-gray-600 hover:outline-2 outline-blue-500',
              ]"
              @click="currentSection = index"
            >
              <v-icon :icon="section.icon" size="20" />
            </div>
            <span class="text-xs mt-1 text-center hidden md:block">{{
              section.title
            }}</span>
          </div>
        </div>
        <div class="w-full bg-gray-300 h-2 rounded-full">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{
              width: `${((currentSection + 1) / sections.length) * 100}%`,
            }"
          />
        </div>
      </div>
      <div class="flex justify-between my-2">
        <v-btn
          prepend-icon="mdi-chevron-left"
          :disabled="currentSection === 0"
          @click="previousSection"
          >Anterior</v-btn
        >
        <v-btn
          append-icon="mdi-chevron-right"
          :disabled="currentSection === sections.length - 1"
          @click="nextSection"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >Próximo</v-btn
        >
      </div>

      <v-form ref="vform" class="p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            {{ sections[currentSection].title }}
          </h2>

          <!-- Section 0: Dados do Paciente -->
          <div v-if="currentSection === 0" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-autocomplete
                v-model="patient_id"
                name="patient_id"
                :error-messages="errors.patient_id"
                class="required"
                density="compact"
                item-title="name"
                item-value="id"
                :items="patientData"
                label="Paciente"
                :loading="isLoading"
                variant="outlined"
                @update:search="onSearch"
              />

              <v-text-field
                v-model="patient_cpf"
                density="compact"
                disabled
                :error-messages="errors.patient_cpf"
                label="CPF"
                variant="outlined"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <v-text-field
                v-model="patient_phone"
                density="compact"
                disabled
                label="Telefone"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
              />
              <v-text-field
                v-model="patient_birth_date"
                density="compact"
                disabled
                label="Data de Nascimento"
                type="date"
                variant="outlined"
              />
              <v-select
                v-model="patient_gender"
                density="compact"
                disabled
                item-title="label"
                item-value="value"
                :items="[
                  { label: 'Masculino', value: 'M' },
                  { label: 'Feminino', value: 'F' },
                ]"
                label="Sexo"
                variant="outlined"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="patient_cns"
                density="compact"
                disabled
                label="CNS (Cartão SUS)"
                variant="outlined"
              />
              <v-select
                v-model="patient_race"
                density="compact"
                disabled
                :items="['Branco', 'Preto', 'Pardo', 'Amarelo', 'Indigena']"
                label="Raça/Cor"
                variant="outlined"
              />
            </div>

            <v-text-field
              v-model="patient_mother_name"
              density="compact"
              disabled
              label="Nome da Mãe"
              variant="outlined"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="patient_street"
                density="compact"
                disabled
                label="Endereço (Rua e Número)"
                variant="outlined"
              />
              <v-text-field
                v-model="patient_neighborhood"
                density="compact"
                disabled
                label="Bairro"
                variant="outlined"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="patient_dependency_relation"
                name="patient_dependency_relation"
                :error-messages="errors.patient_dependency_relation"
                density="compact"
                label="Relação de Dependência"
                variant="outlined"
              />
              <v-text-field
                v-model="patient_profession"
                name="patient_profession"
                :error-messages="errors.patient_profession"
                density="compact"
                label="Profissão"
                variant="outlined"
              />
            </div>
          </div>

          <!-- Section 1: Dados do Acompanhante -->
          <div v-if="currentSection === 1" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-autocomplete
                v-model="companion_id"
                name="companion_id"
                :error-messages="errors.companion_id"
                clearable
                density="compact"
                item-title="name"
                item-value="id"
                :items="companionData"
                label="Acompanhante"
                :loading="isLoadingCompanion"
                variant="outlined"
                @update:search="onSearchCompanion"
              />
              <v-text-field
                v-model="companion_cpf"
                density="compact"
                disabled
                label="CPF"
                variant="outlined"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="companion_phone"
                density="compact"
                disabled
                label="Telefone"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
              />
              <v-text-field
                v-model="companion_birth_date"
                density="compact"
                disabled
                label="Data de Nascimento"
                type="date"
                variant="outlined"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="companion_cns"
                density="compact"
                disabled
                label="CNS"
                variant="outlined"
              />
              <v-text-field
                v-model="companion_mother_name"
                density="compact"
                disabled
                label="Nome da Mãe"
                variant="outlined"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="companion_street"
                density="compact"
                disabled
                label="Endereço (Rua e Número)"
                variant="outlined"
              />
              <v-text-field
                v-model="companion_neighborhood"
                density="compact"
                disabled
                label="Bairro"
                variant="outlined"
              />
            </div>
            <v-text-field
              v-model="companion_relation_to_patient"
              name="companion_relation_to_patient"
              :error-messages="errors.companion_relation_to_patient"
              density="compact"
              label="Relação com o Paciente"
              variant="outlined"
            />
          </div>

          <!-- Section 2: Histórico e Exames -->
          <div v-if="currentSection === 2" class="space-y-4">
            <v-textarea
              v-model="history_of_present_illness"
              name="history_of_present_illness"
              :error-messages="errors.history_of_present_illness"
              density="compact"
              label="Histórico da Doença Atual"
              rows="5"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="physical_exam"
              name="physical_exam"
              :error-messages="errors.physical_exam"
              density="compact"
              label="Exame Físico"
              rows="4"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-text-field
              v-model="probable_diagnosis"
              name="probable_diagnosis"
              :error-messages="errors.probable_diagnosis"
              density="compact"
              counter="50"
              maxlength="50"
              label="Diagnóstico Provável"
              variant="outlined"
            />
            <v-text-field
              v-model="icd_code"
              name="icd_code"
              :error-messages="errors.icd_code"
              density="compact"
              label="CID"
              counter="10"
              maxlength="10"
              variant="outlined"
            />
            <v-textarea
              v-model="complementary_exams"
              name="complementary_exams"
              :error-messages="errors.complementary_exams"
              density="compact"
              label="Exame(s) Complementar(es) Realizado(s)"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="treatments_performed"
              name="treatments_performed"
              :error-messages="errors.treatments_performed"
              density="compact"
              label="Tratamento(s) Realizado(s)"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="indicated_treatments_or_exams"
              name="indicated_treatments_or_exams"
              :error-messages="errors.indicated_treatments_or_exams"
              density="compact"
              label="Tratamento/Exame Indicado"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-text-field
              v-model="probable_treatment_duration"
              name="probable_treatment_duration"
              :error-messages="errors.probable_treatment_duration"
              density="compact"
              counter="64"
              maxlength="64"
              label="Duração Provável do Tratamento"
              placeholder="Ex.: 2 semanas; 6 meses"
              variant="outlined"
            />
          </div>

          <!-- Section 3: Justificativas -->
          <div v-if="currentSection === 3" class="space-y-4">
            <v-textarea
              v-model="reason_cannot_perform_locally"
              name="reason_cannot_perform_locally"
              :error-messages="errors.reason_cannot_perform_locally"
              density="compact"
              label="Justificar as Razões que Impossibilitam a Realização do Tratamento/Exame na Localidade"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="reason_urgent_referral"
              name="reason_urgent_referral"
              :error-messages="errors.reason_urgent_referral"
              density="compact"
              label="Justificar em Caso de Necessidade de Encaminhamento Urgente"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="reason_need_followup"
              name="reason_need_followup"
              :error-messages="errors.reason_need_followup"
              density="compact"
              label="Justificar em Caso de Necessidade de Acompanhamento"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
          </div>

          <!-- Section 4: Transporte e Observações -->
          <div v-if="currentSection === 4" class="space-y-4">
            <v-text-field
              v-model="recommended_transport"
              name="recommended_transport"
              :error-messages="errors.recommended_transport"
              density="compact"
              counter="100"
              maxlength="100"
              label="Transporte Recomendável"
              variant="outlined"
            />
            <v-textarea
              v-model="transport_justification"
              name="transport_justification"
              :error-messages="errors.transport_justification"
              density="compact"
              label="Justificar"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <v-textarea
              v-model="other_notes"
              name="other_notes"
              :error-messages="errors.other_notes"
              density="compact"
              label="Outras Observações"
              rows="3"
              counter="800"
              maxlength="800"
              variant="outlined"
            />
            <base-input-date-picker
              v-model="report_date"
              name="report_date"
              :min="sixMonthsAgo"
              :error-messages="errors.report_date"
              label="Data do Laudo"
              position="top"
            />
          </div>
        </div>

        <!-- Navigation -->
        <div
          class="flex pt-6 border-t"
          :class="{
            'justify-between': isActiveTab,
            'justify-end': !isActiveTab,
          }"
        >
          <v-btn
            v-if="isActiveTab"
            prepend-icon="mdi-alert-circle"
            color="error"
            @click="onSubmitClose"
            >Encerrar laudo</v-btn
          >

          <v-btn
            :prepend-icon="isRenew ? 'mdi-autorenew' : 'mdi-content-save'"
            color="success"
            @click="onSubmit"
            >{{ props.isRenew ? "Renovar Laudo" : "Salvar Laudo" }}</v-btn
          >
        </div>
      </v-form>
    </v-card-text>
  </base-card>
</template>

<script setup lang="ts">
import { useCompanionApi } from "@/composables/modules/useCompanionModule";
import { usePatientApi } from "@/composables/modules/usePatientModule";
import debounce from "lodash/debounce";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

/* -------------------------
     Types / Interfaces
     ------------------------- */
interface PersonBase {
  id?: number;
  name?: string;
  cpf?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  cns?: string;
  mother_name?: string;
  street?: string;
  neighborhood?: string;
  observation?: string;
  race?: string;
  patient?: PersonBase;
}

type UseApiReturn<T> = {
  data: Ref<T[]>;
  refetch: () => Promise<void>;
  setFilter?: (k: string, v: unknown) => void;
  isLoading?: Ref<boolean>;
  clearFilters?: () => void;
};

/* -------------------------
     Props / Emits
     ------------------------- */
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  isRenew: { type: Boolean, default: false },
  currentTab: { type: String, default: "" },
});
const emit = defineEmits([
  "close",
  "save",
  "close-report",
  "save-renew",
] as const);

/* -------------------------
     Composables (tipados de forma conservadora)
     ------------------------- */
const {
  data: patientData,
  refetch: patientFetch,
  setFilter: patientFilter,
  isLoading,
  clearFilters,
} = usePatientApi() as UseApiReturn<PersonBase> & { clearFilters?: () => void };

const {
  data: companionData,
  refetch: companionFetch,
  setFilter: companionFilter,
  isLoading: isLoadingCompanion,
  clearFilters: clearFiltersCompanion,
} = useCompanionApi() as UseApiReturn<PersonBase> & {
  clearFilters?: () => void;
};

const isEditing = computed(() => !!props.modelValue?.id);
const isActiveTab = computed(() => props.currentTab === "active");
const title = computed(() =>
  props.isRenew
    ? "Renovar Laudo Médico"
    : isEditing.value
    ? "Editar Laudo Médico"
    : "Cadastrar Laudo Médico"
);
const date = new Date();
date.setMonth(date.getMonth() - 6);
const sixMonthsAgo = date.toISOString().slice(0, 10);
/* -------------------------
     Validação (yup) e Vee-Validate
     ------------------------- */
const schema = yup.object({
  patient_id: yup.number().required("Paciente é obrigatório"),
  patient_profession: yup.string().nullable(),
  patient_dependency_relation: yup.string().nullable(),
  patient_cpf: yup.string().nullable(),
  patient_phone: yup.string().nullable(),
  patient_birth_date: yup.string().nullable(),
  patient_gender: yup.string().nullable(),
  patient_cns: yup.string().nullable(),
  patient_race: yup.string().nullable(),
  patient_mother_name: yup.string().nullable(),
  patient_street: yup.string().nullable(),
  patient_neighborhood: yup.string().nullable(),
  companion_id: yup.number().nullable(),
  companion_relation_to_patient: yup.string().nullable(),
  companion_cpf: yup.string().nullable(),
  companion_phone: yup.string().nullable(),
  companion_birth_date: yup.string().nullable(),
  companion_cns: yup.string().nullable(),
  companion_mother_name: yup.string().nullable(),
  companion_street: yup.string().nullable(),
  companion_neighborhood: yup.string().nullable(),
  history_of_present_illness: yup.string().nullable(),
  physical_exam: yup.string().nullable(),
  probable_diagnosis: yup.string().nullable(),
  icd_code: yup.string().max(32).nullable(),
  complementary_exams: yup.string().nullable(),
  treatments_performed: yup.string().nullable(),
  indicated_treatments_or_exams: yup.string().nullable(),
  probable_treatment_duration: yup.string().max(64).nullable(),
  reason_cannot_perform_locally: yup.string().nullable(),
  reason_urgent_referral: yup.string().nullable(),
  reason_need_followup: yup.string().nullable(),
  recommended_transport: yup.string().max(128).nullable(),
  transport_justification: yup.string().nullable(),
  other_notes: yup.string().nullable(),
  report_date: yup
    .date()
    .required("Data do laudo é obrigatória")
    .min(sixMonthsAgo, "Data do laudo não pode ter mais de 6 meses"),
});

/* -------------------------
     Form setup
     ------------------------- */
const today = new Date().toISOString().slice(0, 10);
const { handleSubmit, errors, resetForm, validate, setFieldValue, values } =
  useForm({
    validationSchema: schema,
    initialValues: {
      patient_id: null,
      patient_profession: "",
      patient_dependency_relation: "",
      companion_id: null,
      companion_relation_to_patient: "",
      history_of_present_illness: "",
      physical_exam: "",
      probable_diagnosis: "",
      icd_code: "",
      complementary_exams: "",
      treatments_performed: "",
      indicated_treatments_or_exams: "",
      probable_treatment_duration: "",
      reason_cannot_perform_locally: "",
      reason_urgent_referral: "",
      reason_need_followup: "",
      recommended_transport: "",
      transport_justification: "",
      other_notes: "",
      report_date: today,
      patient_cpf: "",
      patient_phone: "",
      patient_birth_date: "",
      patient_gender: "",
      patient_race: "",
      patient_cns: "",
      patient_mother_name: "",
      patient_street: "",
      patient_neighborhood: "",
      companion_cpf: "",
      companion_phone: "",
      companion_birth_date: "",
      companion_cns: "",
      companion_mother_name: "",
      companion_street: "",
      companion_neighborhood: "",
    },
  });

/* -------------------------
     Campos do form (useField com genéricos)
     ------------------------- */
const { value: patient_id } = useField<number | null>("patient_id");
const { value: companion_id } = useField<number | null>("companion_id");
const { value: history_of_present_illness } = useField<string | null>(
  "history_of_present_illness"
);
const { value: physical_exam } = useField<string | null>("physical_exam");
const { value: probable_diagnosis } = useField<string | null>(
  "probable_diagnosis"
);
const { value: icd_code } = useField<string | null>("icd_code");
const { value: complementary_exams } = useField<string | null>(
  "complementary_exams"
);
const { value: treatments_performed } = useField<string | null>(
  "treatments_performed"
);
const { value: indicated_treatments_or_exams } = useField<string | null>(
  "indicated_treatments_or_exams"
);
const { value: probable_treatment_duration } = useField<string | null>(
  "probable_treatment_duration"
);
const { value: reason_cannot_perform_locally } = useField<string | null>(
  "reason_cannot_perform_locally"
);
const { value: reason_urgent_referral } = useField<string | null>(
  "reason_urgent_referral"
);
const { value: reason_need_followup } = useField<string | null>(
  "reason_need_followup"
);
const { value: recommended_transport } = useField<string | null>(
  "recommended_transport"
);
const { value: transport_justification } = useField<string | null>(
  "transport_justification"
);
const { value: other_notes } = useField<string | null>("other_notes");
const { value: report_date } = useField<string | null>("report_date");

const { value: patient_cpf } = useField<string | null>("patient_cpf");
const { value: patient_phone } = useField<string | null>("patient_phone");
const { value: patient_birth_date } = useField<string | null>(
  "patient_birth_date"
);
const { value: patient_gender } = useField<string | null>("patient_gender");
const { value: patient_cns } = useField<string | null>("patient_cns");
const { value: patient_race } = useField<string | null>("patient_race");
const { value: patient_mother_name } = useField<string | null>(
  "patient_mother_name"
);
const { value: patient_street } = useField<string | null>("patient_street");
const { value: patient_neighborhood } = useField<string | null>(
  "patient_neighborhood"
);
const { value: patient_profession } = useField<string | null>(
  "patient_profession"
);
const { value: patient_dependency_relation } = useField<string | null>(
  "patient_dependency_relation"
);

const { value: companion_cpf } = useField<string | null>("companion_cpf");
const { value: companion_phone } = useField<string | null>("companion_phone");
const { value: companion_birth_date } = useField<string | null>(
  "companion_birth_date"
);
const { value: companion_cns } = useField<string | null>("companion_cns");
const { value: companion_mother_name } = useField<string | null>(
  "companion_mother_name"
);
const { value: companion_street } = useField<string | null>("companion_street");
const { value: companion_neighborhood } = useField<string | null>(
  "companion_neighborhood"
);
const { value: companion_relation_to_patient } = useField<string | null>(
  "companion_relation_to_patient"
);

/* -------------------------
     UI state / helpers
     ------------------------- */
const dialogPatientForm = ref(false);
const sections = [
  { title: "Dados do Paciente", icon: "mdi-account" },
  { title: "Acompanhante", icon: "mdi-account-group" },
  { title: "Histórico e Exames", icon: "mdi-file-document" },
  { title: "Justificativas", icon: "mdi-alert" },
  { title: "Transporte e Observações", icon: "mdi-calendar" },
];
const currentSection = ref(0);

function fieldToSection(field: string): number {
  if (!field) return 0;
  // paciente
  const patientFields = [
    "patient_id",
    "patient_profession",
    "patient_dependency_relation",
    "patient_cpf",
    "patient_phone",
    "patient_birth_date",
    "patient_gender",
    "patient_cns",
    "patient_race",
    "patient_mother_name",
    "patient_street",
    "patient_neighborhood",
  ];
  if (patientFields.includes(field)) return 0;

  // acompanhante
  const companionFields = [
    "companion_id",
    "companion_relation_to_patient",
    "companion_cpf",
    "companion_phone",
    "companion_birth_date",
    "companion_cns",
    "companion_mother_name",
    "companion_street",
    "companion_neighborhood",
  ];
  if (companionFields.includes(field)) return 1;

  // histórico e exames
  const historyFields = [
    "history_of_present_illness",
    "physical_exam",
    "probable_diagnosis",
    "icd_code",
    "complementary_exams",
    "treatments_performed",
    "indicated_treatments_or_exams",
    "probable_treatment_duration",
  ];
  if (historyFields.includes(field)) return 2;

  // justificativas
  const justificationFields = [
    "reason_cannot_perform_locally",
    "reason_urgent_referral",
    "reason_need_followup",
  ];
  if (justificationFields.includes(field)) return 3;

  // transporte/observações
  const transportFields = [
    "recommended_transport",
    "transport_justification",
    "other_notes",
    "report_date",
  ];
  if (transportFields.includes(field)) return 4;

  return 0;
}

/* -------------------------
     Debounce para autocomplete
     ------------------------- */
const onSearch = debounce(async (v: string) => {
  clearFilters?.();
  const name = (v || "").split("-")[0].trim();
  if (name && patientFilter) patientFilter("name", name);
  await patientFetch();
}, 250);

const onSearchCompanion = debounce(async (v: string) => {
  clearFiltersCompanion?.();
  const name = (v || "").split("-")[0].trim();
  if (name && companionFilter) companionFilter("name", name);
  await companionFetch();
}, 250);

/* -------------------------
     Load lists, find helpers, watches
     ------------------------- */
const loadLists = async () => {
  await Promise.all([patientFetch(), companionFetch()]);
};

const findPatient = (id?: number | null) =>
  (patientData.value || []).find((p) => p.id === id) || null;
const findCompanion = (id?: number | null) =>
  (companionData.value || []).find((c) => c.id === id) || null;

watch(patient_id, async (newId) => {
  if (!newId) {
    setFieldValue("patient_cpf", "");
    setFieldValue("patient_phone", "");
    setFieldValue("patient_birth_date", "");
    setFieldValue("patient_gender", "");
    setFieldValue("patient_race", "");
    setFieldValue("patient_cns", "");
    setFieldValue("patient_mother_name", "");
    setFieldValue("patient_street", "");
    setFieldValue("patient_neighborhood", "");
    return;
  }

  let p = findPatient(newId);
  if (!p) {
    patientFilter?.("id", newId);
    await patientFetch();
    p = findPatient(newId);
  }

  if (p) {
    const patientObj = (p.patient ?? p) as PersonBase;
    setFieldValue("patient_cpf", patientObj.cpf ?? "");
    setFieldValue("patient_phone", patientObj.phone ?? "");
    setFieldValue(
      "patient_birth_date",
      patientObj.birth_date ? patientObj.birth_date.split("T")[0] : ""
    );
    setFieldValue("patient_gender", patientObj.gender ?? "");
    setFieldValue("patient_race", patientObj.race ?? "");
    setFieldValue("patient_cns", patientObj.cns ?? "");
    setFieldValue("patient_mother_name", patientObj.mother_name ?? "");
    setFieldValue("patient_street", patientObj.street ?? "");
    setFieldValue("patient_neighborhood", patientObj.neighborhood ?? "");
  }
});

watch(companion_id, async (newId) => {
  if (!newId) {
    setFieldValue("companion_cpf", "");
    setFieldValue("companion_phone", "");
    setFieldValue("companion_birth_date", "");
    setFieldValue("companion_cns", "");
    setFieldValue("companion_mother_name", "");
    setFieldValue("companion_street", "");
    setFieldValue("companion_neighborhood", "");
    setFieldValue("companion_relation_to_patient", "");
    return;
  }

  let c = findCompanion(newId);
  if (!c) {
    await companionFetch();
    c = findCompanion(newId);
  }
  if (c) {
    setFieldValue("companion_cpf", c.cpf ?? "");
    setFieldValue("companion_phone", c.phone ?? "");
    setFieldValue(
      "companion_birth_date",
      c.birth_date ? c.birth_date.split("T")[0] : ""
    );
    setFieldValue("companion_cns", c.cns ?? "");
    setFieldValue("companion_mother_name", c.mother_name ?? "");
    setFieldValue("companion_street", c.street ?? "");
    setFieldValue("companion_neighborhood", c.neighborhood ?? "");
  }
});

/* -------------------------
     Inicialização / edição
     ------------------------- */
onMounted(async () => {
  await loadLists();

  if (isEditing.value) {
    const m = props.modelValue;

    resetForm({
      values: {
        patient_id: m.patient?.id ?? m.patient_id ?? null,
        companion_id: m.companion?.id ?? m.companion_id ?? null,
        patient_profession: m.patient_profession ?? "",
        patient_dependency_relation: m.patient_dependency_relation ?? "",
        history_of_present_illness: m.history_of_present_illness ?? "",
        physical_exam: m.physical_exam ?? "",
        probable_diagnosis: m.probable_diagnosis ?? "",
        icd_code: m.icd_code ?? "",
        complementary_exams: m.complementary_exams ?? "",
        treatments_performed: m.treatments_performed ?? "",
        indicated_treatments_or_exams: m.indicated_treatments_or_exams ?? "",
        probable_treatment_duration: m.probable_treatment_duration ?? "",
        reason_cannot_perform_locally: m.reason_cannot_perform_locally ?? "",
        reason_urgent_referral: m.reason_urgent_referral ?? "",
        reason_need_followup: m.reason_need_followup ?? "",
        recommended_transport: m.recommended_transport ?? "",
        transport_justification: m.transport_justification ?? "",
        other_notes: m.other_notes ?? "",
        report_date: props.isRenew ? today : m.report_date ?? null,

        // campos do paciente
        patient_cpf: m.patient?.cpf ?? "",
        patient_phone: m.patient?.phone ?? "",
        patient_birth_date: m.patient?.birth_date?.split("T")[0] ?? "",
        patient_gender: m.patient?.gender ?? "",
        patient_race: m.patient?.race ?? "",
        patient_cns: m.patient?.cns ?? "",
        patient_mother_name: m.patient?.mother_name ?? "",
        patient_street: m.patient?.street ?? "",
        patient_neighborhood: m.patient?.neighborhood ?? "",

        // campos do acompanhante
        companion_cpf: m.companion?.cpf ?? "",
        companion_phone: m.companion?.phone ?? "",
        companion_birth_date: m.companion?.birth_date?.split("T")[0] ?? "",
        companion_cns: m.companion?.cns ?? "",
        companion_mother_name: m.companion?.mother_name ?? "",
        companion_street: m.companion?.street ?? "",
        companion_neighborhood: m.companion?.neighborhood ?? "",
        companion_relation_to_patient: m.companion_relation_to_patient ?? "",
      },
    });
  }
});

/* -------------------------
     Build payload / submit
     ------------------------- */
type Payload = Partial<Record<string, unknown>>;

const buildPayload = (vals: Record<string, any>): Payload => {
  const allowed = [
    "patient_id",
    "patient_profession",
    "patient_dependency_relation",
    "companion_id",
    "companion_relation_to_patient",
    "history_of_present_illness",
    "physical_exam",
    "probable_diagnosis",
    "icd_code",
    "complementary_exams",
    "treatments_performed",
    "indicated_treatments_or_exams",
    "probable_treatment_duration",
    "reason_cannot_perform_locally",
    "reason_urgent_referral",
    "reason_need_followup",
    "recommended_transport",
    "transport_justification",
    "other_notes",
    "report_date",
  ];
  const payload: Payload = {};
  for (const k of allowed) {
    if (vals[k] !== null && vals[k] !== undefined && vals[k] !== "")
      payload[k] = vals[k];
  }
  if (payload.patient_id)
    payload.patient_id = Number(payload.patient_id as any);
  if (payload.companion_id)
    payload.companion_id = Number(payload.companion_id as any);
  return payload;
};

const onSubmit = handleSubmit(
  async (vals) => {
    // válido -> constrói payload e emite
    const payload = buildPayload(vals);
    if (!props.isRenew) {
      emit("save", { ...payload, id: props.modelValue?.id ?? null });
    } else {
      emit("save-renew", { ...payload });
    }
  },
  async (e) => {
    const result = await validate();

    if (!result.valid) {
      const firstField = Object.keys(result.errors)[0];
      const targetSection = fieldToSection(firstField);
      currentSection.value = targetSection;

      await nextTick();
      // tente dar focus no elemento pelo atributo name
      const sectionEl = document.getElementById(`section-${targetSection}`);
      if (sectionEl)
        sectionEl.scrollIntoView({ behavior: "smooth", block: "center" });

      // foco no input com name igual ao campo
      await nextTick();
      const input = document.querySelector(
        `[name="${firstField}"]`
      ) as HTMLElement | null;
      if (input && typeof (input as any).focus === "function")
        (input as any).focus();

      return; // interrompe envio
    }
  }
);

const onSubmitClose = () => {
  emit("close-report", props.modelValue);
};
/* -------------------------
     Navegação entre seções
     ------------------------- */
const previousSection = () => {
  if (currentSection.value > 0) currentSection.value -= 1;
};
const nextSection = () => {
  if (currentSection.value < sections.length - 1) currentSection.value += 1;
};
</script>
