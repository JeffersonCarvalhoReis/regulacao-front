<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection class="my-2">
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

      <v-form class="grid grid-cols-2 gap-x-4">
        <PatientInput
          :key="autocompleteKey"
          v-model="patient_id"
          class="required"
          :error-messages="errors.patient_id"
          :is-editing="isEditing"
          :model-value="props.modelValue?.id"
          :is-clearable="true"
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="hospital_id"
          class="required"
          density="compact"
          :error-messages="errors.hospital_id"
          item-title="name"
          item-value="id"
          :items="hospitalData"
          label="Hospital"
          variant="outlined"
        />

        <CompanionInput
          :key="autocompleteKey"
          v-model="companion_id"
          :error-messages="errors.companion_id"
          :is-editing="isEditing"
          :model-value="props.modelValue.companion_id"
          :is-clearable="true"
        />

        <v-text-field
          v-model="kinship"
          density="compact"
          :disabled="!companion_id"
          :error-messages="errors.kinship"
          label="Parentesco"
          variant="outlined"
        />
        <div
          v-for="(companion, index) in companions"
          :key="index"
          class="col-span-2 grid grid-cols-2 gap-x-4"
        >
          <CompanionInput
            :key="autocompleteKey"
            v-model="companion.companion.id"
            :error-messages="errors[`companions.${index}.companion.id`]"
            :is-editing="isEditing"
            :model-value="companion.companion.id"
            :is-clearable="true"
          />

          <!-- wrapper flex: campo ocupa todo espaço, botão fica apenas com a largura do ícone -->
          <div class="flex items-start gap-x-2">
            <!-- campo ocupa todo o espaço disponível -->
            <div class="flex-1">
              <v-text-field
                v-model="companion.kinship"
                class="w-full"
                density="compact"
                :disabled="!companion.companion.id"
                :error-messages="errors[`companions.${index}.kinship`]"
                label="Parentesco"
                variant="outlined"
              />
            </div>

            <!-- botão com largura fixa para ficar só o ícone -->
            <div class="flex items-center">
              <v-btn
                v-if="companions.length > 0"
                aria-label="Remover acompanhante"
                class="text-red-600 bg-white/0 w-10 h-10 p-0"
                icon="mdi-delete"
                variant="text"
                @click="removeCompanion(index)"
              />
            </div>
          </div>
        </div>
        <!-- Botão de adicionar -->
        <v-btn
          v-if="companions.length < 1"
          class="w-full justify-start items-center pl-2 text-ita-blue"
          prepend-icon="mdi-plus"
          variant="text"
          @click="addCompanion"
        >
          Adicionar outro acompanhante
        </v-btn>
        <v-spacer v-if="companions.length < 1" />
        <base-input-date-picker
          :position="position"
          v-model="appointment_date"
          class-field="required"
          :error-messages="errors.appointment_date"
          label="Data da consulta"
          W
        />
        <v-text-field
          v-model="appointment_time"
          class="required"
          density="compact"
          :error-messages="errors.appointment_time"
          label="Horário da consulta"
          maxlength="5"
          prepend-inner-icon="mdi-clock-time-four-outline"
          variant="outlined"
          @keypress="onlyNumbers"
          @update:model-value="onTimeInput"
        />
        <v-text-field
          v-model="notes"
          density="compact"
          :error-messages="errors.notes"
          label="Motivo"
          variant="outlined"
        />
        <v-checkbox
          v-model="is_priority"
          color="primary"
          density="compact"
          label="Prioridade"
          :messages="priorityText"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear
        v-if="!isEditing"
        button-text="Limpar Campo"
        @clear="clear"
      />
      <v-spacer />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
import { useHospitalApi } from "@/composables/modules/useHospitalModule";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  travelData: { type: Object, default: () => ({}) },
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "save"]);
const autocompleteKey = ref(0);
const textTransform = "uppercase";
const patientData = computed(() => props.travelData.patients);
const currentHospitalCity = ref(null);
const position = ref("center-right");
const priorityText = ref("");
const title = computed(() =>
  isEditing.value ? "Editar Passageiros" : "Cadastrar Passageiros",
);

const {
  data: hospitalData,
  refetch: hospitalFetch,
  params: hospitalParams,
  clearFilters,
} = useHospitalApi();

const { formatDate } = useFormatDate();
const { calculateAge, ageLabel } = useCalculateAge();
const { onlyNumbers } = useOnlyNumbers();
const isEditing = computed(() => !!props.modelValue?.id);

const schema = yup.object({
  patient_id: yup.string().required("Paciente é obrigatório"),
  hospital_id: yup.string().required("Hospital é obrigatório"),
  appointment_date: yup.date().required("Data do agendamento é obrigatório"),
  appointment_time: yup
    .string()
    .required("Horário da consulta é obrigatório")
    .test("dynamic-time-validation", "Horário inválido", (value) => {
      if (!value) return false;
      if (!/^\d{0,2}:?\d{0,2}$/.test(value)) return false;

      const [h, m = ""] = value.split(":");

      if (h.length > 0) {
        const hour = parseInt(h);
        if (isNaN(hour)) return false;
        if (h.length === 1 && hour > 2) return false;
        if (h.length === 2 && hour > 23) return false;
      }

      if (m.length > 0) {
        const minute = parseInt(m);
        if (isNaN(minute)) return false;
        if (m.length === 1 && minute > 5) return false;
        if (m.length === 2 && minute > 59) return false;
      }

      return true;
    }),
  companion_id: yup.string().nullable(),
  kinship: yup.string().nullable(),
  companions: yup.array().of(
    yup.object({
      companion: yup.object({
        id: yup.string().nullable(),
      }),
      kinship: yup.string().nullable(),
    }),
  ),
  notes: yup.string().nullable(),
});

const { handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    patient_id: null,
    companions: [],
    appointment_date: null,
    appointment_time: "",
    is_priority: false,
    hospital_id: null,
    notes: "",
  },
});

const { value: patient_id } = useField("patient_id");
const { value: hospital_id } = useField("hospital_id");
const { value: is_priority } = useField("is_priority");
const { value: appointment_date } = useField("appointment_date");
const { value: appointment_time } = useField("appointment_time");
const { value: notes } = useField("notes");
const { value: companions } = useField("companions");
const { value: companion_id } = useField("companion_id");
const { value: kinship } = useField("kinship");

const addCompanion = async () => {
  companions.value.push({ companion: { id: null }, kinship: "" });
};

const removeCompanion = (index) => {
  companions.value.splice(index, 1);
};

const onTimeInput = (val) => {
  let digits = val.replace(/\D/g, "");

  if (digits.length > 4) digits = digits.slice(0, 4);

  if (digits.length >= 3) {
    appointment_time.value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
  } else {
    appointment_time.value = digits;
  }
};
const occupiedSeats = () => {
  const patients = props.travelData.patients ?? [];
  let infant = 0;

  patients.forEach((patient) => {
    const result = ageLabel(patient.birth_date);
    if (result === "Criança de colo") infant++;
  });

  return (props.travelData.quantity_passengers ?? 0) - infant;
};

watch(
  patient_id,
  (newId) => {
    if (!newId) return;

    const selectedPatient = patientData.value.find((p) => p.id === newId);
    if (!selectedPatient || !selectedPatient.birth_date) return;

    const ageString = calculateAge(selectedPatient.birth_date);

    const match = ageString.match(/^(\d+)/);
    const ageInYears = match ? parseInt(match[1]) : 0;

    if (isEditing.value) return;

    if (ageInYears >= 60) {
      is_priority.value = true;
      priorityText.value = "Paciente com mais de 60 anos";
    }
  },
  { immediate: false },
);

watch(
  () => props.travelData.city_id,
  async (newValue) => {
    currentHospitalCity.value = newValue;
    hospitalParams.value.per_page = -1;
    hospitalParams.value.filter = { city_id: currentHospitalCity.value };

    await nextTick();
    hospitalFetch();
  },
  { immediate: true },
);

onMounted(async () => {
  hospitalParams.value.per_page = -1;
  await nextTick();

  if (isEditing.value) {
    setValues({
      patient_id: props.modelValue.id,
      kinship: props.modelValue?.kinship,
      companion_id: props.modelValue?.companion_id,
      notes: props.modelValue?.notes,
      appointment_date: props.modelValue?.appointment_date,
      appointment_time: props.modelValue?.appointment_time,
      is_priority: props.modelValue?.is_priority,
      hospital_id: props.modelValue?.hospital_id,
      companions: props.modelValue?.extra_companions,
    });
  }
});

onUnmounted(() => {
  clearFilters;
});
const onSubmit = handleSubmit((values) => {
  const list = Array.isArray(values.companions) ? [...values.companions] : [];
  if (values.companion_id) {
    const first = {
      companion: { id: values.companion_id },
      kinship: values.kinship ?? "",
    };

    const filtered = list.filter(
      (c) => c?.companion?.id !== values.companion_id,
    );

    filtered.unshift(first);

    const payload = {
      ...values,
      companions: filtered,
    };

    delete payload.companion_id;
    delete payload.kinship;

    emit("save", payload);
    return;
  }

  const payload = {
    ...values,
    companions: list,
  };
  delete payload.companion_id;
  delete payload.kinship;

  emit("save", payload);
});

const clear = () => {
  resetForm();
  autocompleteKey.value++;
};
</script>
