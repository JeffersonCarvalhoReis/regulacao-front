<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Solicitação">
          <div class="grid grid-cols-3 gap-x-10">
            <div>
              Paciente:
              {{
                props.modelValue.solicitation?.patient ||
                props.solicitationData.patient
              }}
            </div>
            <div v-if="isExam">
              Exame:
              {{
                props.modelValue.solicitation?.procedure ||
                props.solicitationData.procedure
              }}
            </div>
            <div v-if="!isExam">
              Consulta com
              {{
                props.modelValue.solicitation?.specialist ||
                props.solicitationData.specialist
              }}
            </div>
            <div :class="{ 'text-red-500': isUrgent }">
              Urgência: {{ isEditing ? isUrgentToEditLabel : isUrgentLabel }}
            </div>
            <div>
              Unidade Solicitante:
              {{
                props.modelValue.solicitation?.requesting_unit ||
                props.solicitationData.requesting_unit
              }}
            </div>
            <div>
              Data da Solicitação:
              {{
                formatDate(
                  props.modelValue.solicitation?.solicitation_date ||
                    props.solicitationData.solicitation_date,
                )
              }}
            </div>
            <div>
              Retorno: {{ isEditing ? isReturnToEditLabel : isReturnLabel }}
            </div>
            <div>
              Motivo:
              {{
                props.modelValue.solicitation?.reason ||
                props.solicitationData.reason
              }}
            </div>
          </div>
          <SolicitationRiskClassificationAlert
            v-if="isUrgent"
            :risk-classification-data="
              props.modelValue.solicitation?.risk_classification ||
              props.solicitationData.risk_classification
            "
          />
        </InfoGroup>
      </BaseSection>
      <v-form>
        <h2 class="text-xl font-bold mt-4">Dados do Agendamento</h2>

        <div v-if="canManageSchedules" class="mt-4">
          <v-autocomplete
            v-model="schedule_id"
            clearable
            density="compact"
            :error-messages="errors.schedule_id"
            :items="scheduleOptions"
            :loading="loadingSchedules"
            label="Selecionar uma Agenda Aberta (opcional)"
            no-data-text="Nenhuma agenda aberta encontrada"
            variant="outlined"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :subtitle="item?.subtitle" />
            </template>
          </v-autocomplete>

          <div v-if="schedule_id" class="text-sm text-green-700 -mt-2 mb-2">
            Data, unidade e médico preenchidos automaticamente pela agenda
            selecionada.
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <base-input-date-picker
            v-model="date"
            position="top"
            class-field="required"
            :error-messages="errors.date"
            label="Data"
          />
          <v-text-field
            v-model="time"
            class="required"
            density="compact"
            :error-messages="errors.time"
            label="Escolha um horário"
            maxlength="5"
            prepend-inner-icon="mdi-clock-time-four-outline"
            variant="outlined"
            @keypress="onlyNumbers"
            @update:model-value="onTimeInput"
          />

          <v-autocomplete
            v-model="provider_unit_id"
            class="required"
            density="compact"
            :error-messages="errors.provider_unit_id"
            item-title="name"
            item-value="id"
            :items="providerUnitData"
            label="Unidade prestadora"
            variant="outlined"
          />
          <v-autocomplete
            v-model="doctor_id"
            density="compact"
            :error-messages="errors.doctor_id"
            item-title="name"
            item-value="id"
            :items="doctorData"
            label="Médico responsável"
            variant="outlined"
          />
          <v-select
            v-if="isEditing"
            v-model="status"
            class="col-span-1"
            density="compact"
            :error-messages="errors.status"
            item-title="label"
            item-value="value"
            :items="AppointmentStatus"
            label="Status de Agendamento"
            variant="outlined"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="mx-4 mb-4 flex justify-end">
      <base-button-register
        button-icon="mdi-content-save"
        :button-text="role == 'provider_unit_manager' ? 'Solicitar' : 'Salvar'"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
import { useDoctorApi } from "@/composables/modules/useDoctorModule";
import { useProviderUnitApi } from "@/composables/modules/useProviderUnitModule";
import { useScheduleApi } from "@/composables/modules/useScheduleModule";
import { useBooleanLabel } from "@/composables/utils/useBooleanLabel";
import { useFormatDate } from "@/composables/utils/useFormatDate";
import { useOnlyNumbers } from "@/composables/utils/useOnlyNumbers";
import { useMeStore } from "@/stores/me";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  solicitationData: { type: Object, default: () => ({}) },
});

const meStore = useMeStore();
const role = meStore.role;
const canManageSchedules = computed(() => role === "regulation_officer");

const {
  data: providerUnitData,
  refetch: providerUnitFetch,
  params: providerUnitParams,
} = useProviderUnitApi();
const {
  data: doctorData,
  refetch: doctorFetch,
  params: doctorParams,
} = useDoctorApi();
const {
  data: scheduleData,
  loadingList: loadingSchedules,
  refetch: scheduleFetch,
  params: scheduleParams,
} = useScheduleApi();
const { formatDate } = useFormatDate();
const { onlyNumbers } = useOnlyNumbers();
const { booleanToLabel } = useBooleanLabel();
const isReturnLabel = computed(() =>
  booleanToLabel(props.solicitationData.is_first_time, "Não", "Sim"),
);
const isReturnToEditLabel = computed(() =>
  booleanToLabel(props.modelValue.solicitation.is_first_time, "Não", "Sim"),
);
const isUrgentLabel = computed(() =>
  booleanToLabel(props.solicitationData.is_urgent),
);
const isUrgentToEditLabel = computed(() =>
  booleanToLabel(props.modelValue.solicitation.is_urgent),
);
const isEditing = computed(() => !!props.modelValue?.id);

const isExam = computed(
  () =>
    props.modelValue.solicitation?.solicitation_type ||
    props.solicitationData.solicitation_type === "exam",
);
const isUrgent = computed(
  () =>
    props.modelValue.solicitation?.is_urgent == true ||
    props.solicitationData.is_urgent == true,
);

const onTimeInput = (val) => {
  let digits = val.replace(/\D/g, "");

  if (digits.length > 4) digits = digits.slice(0, 4);

  if (digits.length >= 3) {
    time.value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
  } else {
    time.value = digits;
  }
};
const AppointmentStatus = [
  { value: "scheduled", label: "Agendado" },
  { value: "not-present", label: "Não compareceu" },
  { value: "realized", label: "Realizado" },
  { value: "pending", label: "Pendente" },
];

onMounted(async () => {
  providerUnitParams.value.per_page = -1;
  doctorParams.value.per_page = -1;

  providerUnitParams.value.sort = "name";
  doctorParams.value.sort = "name";

  await nextTick();

  const requests = [providerUnitFetch(), doctorFetch()];

  if (canManageSchedules.value) {
    scheduleParams.value.per_page = -1;
    scheduleParams.value.sort = "date";
    scheduleParams.value["filter[open]"] = 1;

    requests.push(scheduleFetch());
  }

  await Promise.all(requests);

  if (isEditing.value) {
    resetForm({
      values: props.modelValue,
    });
  }
});

const emit = defineEmits(["close", "save"]);

const msgAppointment =
  role == "provider_unit_manager"
    ? "Solicitar Agendamento"
    : "Novo Agendamento";
const title = computed(() =>
  isEditing.value ? "Editar Agendamento" : msgAppointment,
);

const schema = yup.object({
  date: yup.date().required("Data do agendamento é obrigatório"),
  time: yup
    .string()
    .required("Horário é obrigatório")
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
  provider_unit_id: yup.number().required("Unidade prestadora é obrigatório"),
  doctor_id: yup.number().nullable(),
  schedule_id: yup.number().nullable(),
  status: yup.string().nullable(),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    date: null,
    time: "",
    solicitation_id:
      props.modelValue?.solicitation?.id || props.solicitationData?.id,
    provider_unit_id: null,
    doctor_id: null,
    schedule_id: null,
  },
});

const { value: date } = useField("date");
const { value: time } = useField("time");
const { value: provider_unit_id } = useField("provider_unit_id");
const { value: doctor_id } = useField("doctor_id");
const { value: schedule_id } = useField("schedule_id");
const { value: status } = useField("status");

const scheduleOptions = computed(() => {
  if (!canManageSchedules.value) {
    return [];
  }

  return scheduleData.value.map((schedule) => ({
    value: schedule.id,
    title: `${formatDate(schedule.date)} - ${schedule.provider_unit}`,
    subtitle: `${schedule.doctor || "Qualquer médico"} • ${schedule.available_vacancies} vaga(s) disponível(is)`,
  }));
});

const settingFromSchedule = ref(false);

watch(schedule_id, (newScheduleId) => {
  if (!newScheduleId) return;

  const schedule = scheduleData.value.find((s) => s.id === newScheduleId);
  if (!schedule) return;

  settingFromSchedule.value = true;
  date.value = schedule.date;
  provider_unit_id.value = schedule.provider_unit_id;
  doctor_id.value = schedule.doctor_id;
  nextTick(() => {
    settingFromSchedule.value = false;
  });
});

watch([date, provider_unit_id, doctor_id], () => {
  if (settingFromSchedule.value) return;
  if (schedule_id.value) schedule_id.value = null;
});

const onSubmit = handleSubmit((values) => {
  if (role == "provider_unit_manager") values.status = "pending";
  emit("save", values);
});
</script>
