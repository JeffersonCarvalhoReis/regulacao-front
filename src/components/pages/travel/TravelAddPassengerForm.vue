<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection class="my-2">
        <InfoGroup title="Partida" class="pt-2">
          <div>Data: {{ formatDate(props.travelData.date) }}</div>
          <div>Hora: {{ props.travelData.time }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Destino" class="pt-2">
          <div>Cidade: <span :class="textTransform">{{ props.travelData.city }}</span></div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup  title="Informações Sobre a Viagem" class="pt-2">
          <div>Motorista: <span :class="textTransform">{{ props.travelData.driver }}</span></div>
          <div>Veículo: <span :class="textTransform">{{ props.travelData.vehicle }}</span></div>
          <div>Vagas Restantes: {{ props.travelData.remaining_seats }}</div>
          <div>Vagas Prioritárias Restantes: {{ props.travelData.remaining_priority_seats }}</div>
          <div v-if="props.travelData.remaining_seats + props.travelData.remaining_priority_seats < 1" class="text-red-500 text-uppercase">
            Viagem lotada
          </div>
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
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="companion_id"
          :error-messages="errors.companion_id"
          density="compact"
          item-title="name"
          item-value="id"
          :items="companionData"
          label="Acompanhante"
          variant="outlined"
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="hospital_id"
          :error-messages="errors.hospital_id"
          class="required"
          density="compact"
          item-title="name"
          item-value="id"
          :items="hospitalData"
          label="Hospital"
          variant="outlined"
        />
        <v-text-field
          v-model="kinship"
          :disabled="!companion_id"
          density="compact"
          variant="outlined"
          label="Parentesco do acompanhante com o paciente"
          :error-messages="errors.kinship"
        />
        <base-input-date-picker
          v-model="appointment_date"
          class-date-picker="absolute right-[-175px] top-[-175px]"
          :error-messages="errors.appointment_date"
          class-field="required"
          label="Data da consulta"
        />
        <v-text-field
          v-model="appointment_time"
          class="required"
          density="compact"
          variant="outlined"
          label="Horário da consulta"
          @update:model-value="onTimeInput"
          @keypress="onlyNumbers"
          :error-messages="errors.appointment_time"
          maxlength="5"
          prepend-inner-icon="mdi-clock-time-four-outline"
        />
        <v-text-field
          v-model="notes"
          density="compact"
          variant="outlined"
          label="Motivo"
          :error-messages="errors.notes"
        />
        <v-checkbox
          v-model="is_priority"
          label="Prioridade"
          color="primary"
          density="compact"
          :messages="priorityText"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campo" @clear="clear" />
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
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import { useCompanionApi } from '@/composables/modules/useCompanionModule';
  import { useHospitalApi } from '@/composables/modules/useHospitalModule';
  import { usePatientLabel } from '@/composables/utils/usePatientLabel';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    travelData: { type: Object, default: () => ({}) },
    modelValue: { type: Object, default: () => ({}) },
  })


  const emit = defineEmits(['close', 'save']);
  const autocompleteKey = ref(0);
  const textTransform = 'uppercase';
  const currentHospitalCity = ref(null)
  const priorityText = ref('')
  const title = computed(() =>
    isEditing.value ? 'Editar Passageiros' : 'Cadastrar Passageiros'
  );

  const { data: companionData, refetch: companionFetch, params: companionParams } = useCompanionApi();
  const { data: hospitalData, refetch: hospitalFetch, params: hospitalParams, setFilter, clearFilters } = useHospitalApi();
  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge();
  const { onlyNumbers } = useOnlyNumbers();
  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    patient_id: yup.string().required('Paciente é obrigatório'),
    hospital_id: yup.string().required('Hospital é obrigatório'),
    appointment_date: yup.date().required('Data do agendamento é obrigatório'),
    appointment_time: yup
        .string()
        .required('Horário da consulta é obrigatório')
        .test('dynamic-time-validation', 'Horário inválido', value => {
          if (!value) return false;
          if (!/^\d{0,2}:?\d{0,2}$/.test(value)) return false;

          const [h, m = ''] = value.split(':');

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
    kinship: yup.string().nullable(),
    notes: yup.string().nullable(),
    companion_id: yup.string().nullable(),

  });

  const { handleSubmit, errors, resetForm, setValues  } = useForm({
    validationSchema: schema,
    initialValues:  {
      patient_id: null,
      companion_id: null,
      appointment_date: null,
      appointment_time: '',
      is_priority: false,
      hospital_id: null,
      kinship: '',
      notes: ''
    }
  });

  const { value: patient_id } = useField('patient_id');
  const { value: companion_id } = useField('companion_id');
  const { value: hospital_id } = useField('hospital_id');
  const { value: is_priority } = useField('is_priority');
  const { value: appointment_date } = useField('appointment_date');
  const { value: appointment_time } = useField('appointment_time');
  const { value: kinship } = useField('kinship');
  const { value: notes } = useField('notes');

  const onTimeInput = (val) => {
  let digits = val.replace(/\D/g, '')

  if (digits.length > 4) digits = digits.slice(0, 4)

  if (digits.length >= 3) {
      appointment_time.value = `${digits.slice(0, 2)}:${digits.slice(2)}`
    } else {
      appointment_time.value = digits
    }
  };

  watch(patient_id, (newId) => {
  if (!newId) return;

  const selectedPatient = patientData.value.find(p => p.id === newId);
  if (!selectedPatient || !selectedPatient.birth_date) return;

  const age = calculateAge(selectedPatient.birth_date);

  if(isEditing.value) return;

  if (age >= 60 ) {
    is_priority.value = true;
    priorityText.value = 'Paciente com mais de 60 anos'
  }
},{ immediate: false});

watch(() => props.travelData.city_id, async (newValue) => {
   currentHospitalCity.value = newValue
    hospitalParams.value.per_page = -1;
    hospitalParams.value.filter = { 'city_id': currentHospitalCity.value }

    await nextTick();
    await hospitalFetch()
},{ immediate: true })

  onMounted( async () => {
    companionParams.value.per_page = -1;
    hospitalParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      companionFetch(),
    ])

  if (isEditing.value) {
    setValues({
        patient_id: props.modelValue.id,
        companion_id: props.modelValue?.companion_id,
        kinship: props.modelValue?.kinship,
        notes: props.modelValue?.notes,
        appointment_date: props.modelValue?.appointment_date,
        appointment_time: props.modelValue?.appointment_time,
        is_priority: props.modelValue?.is_priority,
        hospital_id: props.modelValue?.hospital_id,
      })
    }
  });

      onUnmounted(() => {
      clearFilters
    })
  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
    autocompleteKey.value++
  };
</script>
