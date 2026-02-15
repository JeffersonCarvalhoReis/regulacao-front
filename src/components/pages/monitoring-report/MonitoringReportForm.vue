<template>
  <base-card
    title="Cadastrar Relatório de Acompanhamento"
    @close="emit('close')"
  >
    <v-card-text>
      <v-form>
        <!-- Seletores -->
        <div class="grid grid-cols-1 gap-2 mb-4">
          <div class="flex gap-2">
            <PatientInput
              v-model="patient_id"
              :error-messages="errors.patient_id"
              :is-editing="isEditing"
              :is-clearable="true"
              :is-required="true"
            />
            <base-button-register
              button-icon="mdi-account-box-plus-outline"
              button-text="Novo"
              @register="dialogPatientForm = true"
            >
              <v-tooltip activator="parent">
                Cadastrar novo paciente caso não encontre na lista
              </v-tooltip>
            </base-button-register>
          </div>
          <div class="flex gap-2">
            <companion-input
              v-model="companion_id"
              :error-messages="errors.companion_id"
              :is-editing="isEditing"
              :is-clearable="true"
            />

            <base-button-register
              button-icon="mdi-account-box-plus-outline"
              button-text="Novo"
              @register="dialogCompanionForm = true"
            >
              <v-tooltip activator="parent">
                Cadastrar novo acompanhanete caso não encontre na lista
              </v-tooltip>
            </base-button-register>
          </div>
          <div>
            <v-text-field
              v-model="unit_name"
              :error-messages="errors.unit_name"
              :is-clearable="true"
              name="unit_name"
              label="Nome da Unidade"
              density="compact"
              variant="outlined"
              maxlength="45"
            ></v-text-field>
          </div>
        </div>
        <v-dialog v-model="dialogPatientForm" class="z-999">
          <patient-form
            @close="dialogPatientForm = false"
            @save="submitNewPatient"
          />
        </v-dialog>
        <v-dialog v-model="dialogCompanionForm" class="z-999">
          <companion-form
            @close="dialogCompanionForm = false"
            @save="submitNewCompanion"
          />
        </v-dialog>

        <!-- Dados do Paciente -->
        <v-divider class="my-3" />
        <h3 class="text-sm font-semibold mb-2">Dados do Paciente</h3>

        <div class="grid grid-cols-3 gap-2">
          <div>Nome: {{ form.patient_name }}</div>
          <div>CPF: {{ form.patient_cpf }}</div>
          <div>CNS: {{ form.patient_cns }}</div>
          <div>Telefone: {{ form.patient_phone }}</div>

          <div>
            Endereço:
            {{ form.patient_street }} - {{ form.patient_neighborhood }}
          </div>
        </div>

        <!-- Dados do Acompanhante -->
        <v-divider class="my-3" />
        <div v-if="companion_id">
          <h3 class="text-sm font-semibold mb-2">Dados do Acompanhante</h3>

          <div class="grid grid-cols-3 gap-2">
            <div>Nome: {{ form.companion_name }}</div>
            <div>CPF: {{ form.companion_cpf }}</div>
            <div>CNS: {{ form.companion_cns }}</div>
            <div>Telefone: {{ form.companion_phone }}</div>

            <div>
              Endereço:
              {{ form.companion_street }} - {{ form.companion_neighborhood }}
            </div>
          </div>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="flex justify-end">
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { computed, onMounted, reactive } from "vue";
import * as yup from "yup";

import CompanionInput from "@/components/shared/CompanionInput.vue";
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useCompanionApi } from "@/composables/modules/useCompanionModule";
import { usePatientApi } from "@/composables/modules/usePatientModule";

/* props / emits */
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "save"]);

const dialogPatientForm = ref(false);
const dialogCompanionForm = ref(false);

/* yup schema */
const schema = yup.object({
  patient_id: yup.number().required("Paciente é obrigatório"),

  companion_id: yup.number().nullable(),
  unit_name: yup.string().nullable(),
});

/* vee-validate */
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    patient_id: null,
    companion_id: null,
    unit_name: null,
  },
});

const { value: patient_id } = useField("patient_id");
const { value: companion_id } = useField("companion_id");
const { value: unit_name } = useField("unit_name");

/* APIs */
const {
  refetch: patientFetch,
  create: patientCreate,
  getById: patientGet,
} = usePatientApi();

const {
  refetch: companionFetch,
  create: companionCreate,
  getById: companionGet,
} = useCompanionApi();

const { showFeedback } = useSweetAlertFeedback();

/* estado */
const isEditing = computed(() => !!props.modelValue?.id);

const form = reactive({
  patient_id: props.modelValue.patient_id ?? null,
  companion_id: props.modelValue.companion_id ?? null,
  patient_name: props.modelValue.patient_name ?? "",
  patient_cpf: props.modelValue.patient_cpf ?? "",
  patient_phone: props.modelValue.patient_phone ?? "",
  patient_cns: props.modelValue.patient_cns ?? "",
  patient_street: props.modelValue.patient_street ?? "",
  patient_neighborhood: props.modelValue.patient_neighborhood ?? "",

  companion_name: props.modelValue.companion_name ?? "",
  companion_cpf: props.modelValue.companion_cpf ?? "",
  companion_phone: props.modelValue.companion_phone ?? "",
  companion_cns: props.modelValue.companion_cns ?? "",
  companion_street: props.modelValue.companion_street ?? "",
  companion_neighborhood: props.modelValue.companion_neighborhood ?? "",
});

/* lifecycle */
onMounted(() => {
  patientFetch();
  companionFetch();

  if (isEditing.value) {
    resetForm({
      values: {
        patient_id: props.modelValue.patient_id ?? null,
        companion_id: props.modelValue.companion_id ?? null,
        unit_name: props.modelValue.unit_name ?? null,
      },
    });
  }
});

const fillPatient = (patient) => {
  form.patient_name = patient.name?.toUpperCase() ?? "";
  form.patient_cpf = patient.cpf ?? "";
  form.patient_phone = patient.phone ?? "";
  form.patient_cns = patient.cns ?? "";
  form.patient_street = patient.street?.toUpperCase() ?? "";
  form.patient_neighborhood = patient.neighborhood?.toUpperCase() ?? "";
};

const clearPatient = () => {
  form.patient_name = "";
  form.patient_cpf = "";
  form.patient_phone = "";
  form.patient_cns = "";
  form.patient_street = "";
  form.patient_neighborhood = "";
};

const fillCompanion = (companion) => {
  form.companion_name = companion.name?.toUpperCase() ?? "";
  form.companion_cpf = companion.cpf ?? "";
  form.companion_phone = companion.phone ?? "";
  form.companion_cns = companion.cns ?? "";
  form.companion_street = companion.street?.toUpperCase() ?? "";
  form.companion_neighborhood = companion.neighborhood?.toUpperCase() ?? "";
};

const clearCompanion = () => {
  form.companion_name = "";
  form.companion_cpf = "";
  form.companion_phone = "";
  form.companion_cns = "";
  form.companion_street = "";
  form.companion_neighborhood = "";
};

watch(patient_id, async (id) => {
  if (!id) {
    clearPatient();
    return;
  }

  const patient = await patientGet(id);
  if (!patient) {
    clearPatient();
    return;
  }

  fillPatient(patient);
});

const submitNewPatient = async (val) => {
  const success = await showFeedback(() => patientCreate(val));

  if (success) {
    await patientFetch();

    dialogPatientForm.value = false;
  }
};

const submitNewCompanion = async (val) => {
  const success = await showFeedback(() => companionCreate(val));
  if (success) {
    await companionFetch();

    dialogCompanionForm.value = false;
  }
};

watch(companion_id, async (id) => {
  if (!id) {
    clearCompanion();
    return;
  }

  const companion = await companionGet(id);
  if (!companion) {
    clearCompanion();
    return;
  }

  fillCompanion(companion);
});

/* submit */
const onSubmit = handleSubmit((values) => {
  emit("save", values);
});
</script>
