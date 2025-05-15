<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="flex justify-end gap-4 mb-4">
          <v-btn
            v-if="!isEditing"
            prepend-icon="mdi-account-box-plus-outline"
            class="rounded-sm text-white hover:bg-blue-700 bg-blue-500"
            @click="dialogPatientForm = true"
            >
            Cadastrar Paciente
            <v-tooltip
            activator="parent"
            >
           Cadastrar novo paciente caso não encontre na lista
            </v-tooltip>
          </v-btn>
          <div v-if="['regulation_officer'].includes(role)">
            <div v-if="solicitation_type == 'consultation'">
              <v-btn
              v-if="!isEditing"
              prepend-icon="mdi-medical-bag"
              class="rounded-sm text-white hover:bg-blue-700 bg-blue-500"
              @click="dialogSpecialistForm = true"
            >
              Cadastrar Especialidade
              <v-tooltip
              activator="parent"
              >
              Clique para cadastrar nova especialidade caso não encontre na lista
              </v-tooltip>
            </v-btn>
            </div>
            <div v-else>
              <v-btn
              v-if="!isEditing"
              prepend-icon="mdi-clipboard-list-outline"
              class="rounded-sm text-white hover:bg-blue-700 bg-blue-500"
              @click="dialogProcedureForm = true"
              >
              Cadastrar Procedimento
              <v-tooltip
              activator="parent"
              >
              Cadastrar novo procedimento caso não encontre na lista
              </v-tooltip>
            </v-btn>
            </div>
          </div>
          <div v-if="['regulation_officer'].includes(role)">
            <v-btn
            v-if="!isEditing"
            prepend-icon="mdi-office-building-plus-outline"
            class="rounded-sm text-white hover:bg-blue-700 bg-blue-500"
            @click="dialogRequestingUnitForm = true"
            >
            Cadastrar Unidade Solicitante

            <v-tooltip
            activator="parent"
            >
            Cadastrar nova unidade solicitante caso não encontre na lista
            </v-tooltip>
          </v-btn>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
            <v-autocomplete
            class="col-span-2 required"
            v-model="patient_id"
            density="compact"
            :error-messages="errors.patient_id"
            :item-title="patientLabel"
            item-value="id"
            :items="patientData"
            label="Paciente"
            variant="outlined"
          />

          <base-input-date-picker
            v-model="solicitation_date"
            :error-messages="errors.solicitation_date"
            label="Data da Solicitação"
          />

          <v-select
            v-model="solicitation_type"
            class="required"
            density="compact"
            :error-messages="errors.solicitation_type"
            item-title="label"
            item-value="value"
            :items="solicitationTypeOptions"
            label="Tipo de Solicitação"
            variant="outlined"
          />
          <v-select
            v-model="is_first_time"
            class="required"
            density="compact"
            :error-messages="errors.is_first_time"
            item-title="label"
            item-value="value"
            :items="isFirstTimeOptions"
            label="Retorno"
            variant="outlined"
          />
          <v-select
            v-model="is_urgent"
            class="required"
            density="compact"
            :error-messages="errors.is_urgent"
            item-title="label"
            item-value="value"
            :items="isUrgentOptions"
            label="Urgente"
            variant="outlined"
          />
          <div
          class="flex items-start gap-1"
          v-if="solicitation_type == 'consultation'"
          >
            <v-autocomplete
            v-model="specialist_id"
            class="required"
            density="compact"
            :error-messages="errors.specialist_id"
            item-title="name"
            item-value="id"
            :items="specialistData"
            label="Especialidade"
            variant="outlined"
          />

          </div>
          <div
          v-else
          class="flex  items-start gap-1"
          >
          <v-autocomplete
            :disabled="!solicitation_type"
            v-model="procedure_id"
            :class="{ 'required': solicitation_type}"
            density="compact"
            :error-messages="errors.procedure_id"
            item-title="name"
            item-value="id"
            :items="procedureData"
            label="Procedimento"
            variant="outlined"
          />
          </div>
          <v-autocomplete
            v-model="requesting_unit_id"
            class="required"
            density="compact"
            :error-messages="errors.requesting_unit_id"
            item-title="name"
            item-value="id"
            :items="requestingUnitData"
            label="Unidade Solicitante"
            variant="outlined"
          />

          <v-file-input
            v-model="attachment"
            density="compact"
            label="Anexo"
            :error-messages="errors.attachment"
            prepend-inner-icon="mdi-paperclip"
            prepend-icon=""
            variant="outlined"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <v-textarea
            class="col-span-3 required"
            density="compact"
            v-model="reason"
            :error-messages="errors.reason"
            label="Motivo"
            variant="outlined"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="flex justify-end items-end mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campos" @clear="clear" />
      <v-spacer />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
    <v-dialog
    class="z-999"
    v-model="dialogPatientForm"
    >
    <patient-form @save="submitNewPatient" @close="dialogPatientForm = false"/>
    </v-dialog>
    <v-dialog
    class="z-999"
    v-model="dialogProcedureForm"
    >
    <procedure-form @save="submitNewProcedure" @close="dialogProcedureForm = false"/>
    </v-dialog>
    <v-dialog
    class="z-999"
    v-model="dialogSpecialistForm"
    >
    <specialist-form @save="submitNewSpecialist" @close="dialogSpecialistForm = false"/>
    </v-dialog>
    <v-dialog
    class="z-999"
    v-model="dialogRequestingUnitForm"
    >
    <requesting-unit-form @save="submitNewRequestingUnit" @close="dialogRequestingUnitForm = false"/>
    </v-dialog>
  </base-card>
</template>

<script setup>
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useProcedureApi } from '@/composables/modules/useProcedureModule';
  import { useRequestingUnitApi } from '@/composables/modules/useRequestingUnitModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useMeStore } from '@/stores/me';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'



  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { data: patientData, refetch: patientFetch, params: patientParams, create: patientCreate } = usePatientApi();
  const { data: specialistData, refetch: specialistFetch, params: specialistParams, create: specialistCreate } = useSpecialistApi();
  const { data: procedureData, refetch: procedureFetch, params: procedureParams, create: procedureCreate } = useProcedureApi();
  const { data: requestingUnitData, refetch: requestingUnitFetch, params: requestingUnitParams, create: requestingUnitCreate } = useRequestingUnitApi();
  const { showFeedback } = useSweetAlertFeedback();
  const { calculateAge } = useCalculateAge();
  const { formatDate } = useFormatDate();

  const meStore = useMeStore();
  const role = meStore.role
  const isEditing = computed(() => !!props.modelValue?.id);
  const dialogPatientForm = ref(false)
  const dialogProcedureForm = ref(false)
  const dialogSpecialistForm = ref(false)
  const dialogRequestingUnitForm = ref(false)
  const patient_age = computed(() => calculateAge(patientData.value.find(v => v.id == patient_id.value)?.birth_date))
  const procedure_max_age = computed(() => procedureData.value.find(v => v.id === procedure_id.value)?.max_age)
  const procedure_min_age = computed(() => procedureData.value.find(v => v.id === procedure_id.value)?.min_age)
  const specialist_max_age = computed(() => specialistData.value.find(v => v.id === specialist_id.value)?.max_age)
  const specialist_min_age = computed(() => specialistData.value.find(v => v.id === specialist_id.value)?.min_age)


  const solicitationTypeOptions = [
    { label: 'Consulta', value: 'consultation' },
    { label: 'Exame', value: 'exam' }
  ];
  const isFirstTimeOptions = [
    { label: 'Sim', value: 0 },
    { label: 'Não', value: 1 }
  ];
  const isUrgentOptions = [
    { label: 'Sim', value: 1 },
    { label: 'Não', value: 0 }
  ];

  const patientLabel = (patient) => {
    if(!patient) return '';

    const date = formatDate(patient.birth_date);
    const age = calculateAge(patient.birth_date);
    return `${patient.name} - DN: ${date} - ${age} anos`

  }

  onMounted(async () => {
    patientParams.value.per_page = -1;
    specialistParams.value.per_page = -1;
    procedureParams.value.per_page = -1;
    requestingUnitParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      patientFetch(),
      specialistFetch(),
      procedureFetch(),
      requestingUnitFetch()]);

    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const emit = defineEmits(['close', 'save']);

  const title = computed(() =>
    isEditing.value ? 'Editar Solicitação' : 'Cadastrar Solicitação'
  )

  const schema = yup.object({
    patient_id: yup.number().required('Paciente é obrigatório'),
    solicitation_type: yup.string().required('Tipo de solicitação é obrigatório'),
    solicitation_date: yup.date().required('Data da solicitação é obrigatório'),
    is_first_time: yup.number().required('Obrigátorio identificar se é retorno'),
    is_urgent: yup.number().required('Obrigátorio identificar se é urgente'),
    reason: yup.string().required('Motivo é obrigatório'),
    attachment: yup
    .mixed()
    .nullable()
    .test('fileSize', 'O arquivo deve ter no máximo 10MB', (value) => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Tipo de arquivo inválido', (value) => {
      if (!value) return true;
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
      ];
      return allowedTypes.includes(value.type);
    }),
    requesting_unit_id: yup.number().required('Unidade solicitante é obrigatório'),
    specialist_id: yup
    .number()
    .nullable()
    .when('solicitation_type', {
      is: 'consultation',
      then: (schema) => schema
      .required('Especialidade é obrigatória')
      .test('check_min_age', `Paciente não tem a idade mínima exigida para essa especialidade (${specialist_min_age.value} anos)`, () => {
        if(patient_age.value != null && specialist_min_age.value != null) {
          return patient_age.value >= specialist_min_age.value;
        }
        return true;
      })
      .test('check_max_age', `Paciente ultrapassou a idade máxima permitida para essa especialidade (${specialist_max_age.value} anos)`, () => {
        if(patient_age.value != null && specialist_max_age.value != null) {
          return patient_age.value <= specialist_max_age.value;
        }
        return true;
      }),
      otherwise: (schema) => schema.nullable()
    })
    ,

  procedure_id: yup
    .number()
    .nullable()
    .when('solicitation_type', {
      is: 'exam',
      then: (schema) => schema
      .required('Procedimento é obrigatório')
      .test('check_min_age', `Paciente não tem a idade mínima exigida para esse procedimento (${procedure_min_age.value} anos)`, () => {
        if(patient_age.value != null && procedure_min_age.value != null) {
          return patient_age.value >= procedure_min_age.value;
        }
        return true;
      })
    .test('check_max_age', `Paciente ultrapassou a idade máxima permitida para esse procedimento (${procedure_max_age.value} anos)`, () => {
        if(patient_age.value != null && procedure_max_age.value != null) {
          return patient_age.value <= procedure_max_age.value;
        }
        return true;
      }),
      otherwise: (schema) => schema.nullable()
    })
   });

   const today = new Date();

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
      attachment: null,
      solicitation_date: today,
    }
  });

  const { value: patient_id } = useField('patient_id');
  const { value: solicitation_type } = useField('solicitation_type');
  const { value: solicitation_date } = useField('solicitation_date');
  const { value: is_first_time } = useField('is_first_time');
  const { value: is_urgent } = useField('is_urgent');
  const { value: reason } = useField('reason');
  const { value: specialist_id } = useField('specialist_id');
  const { value: procedure_id } = useField('procedure_id');
  const { value: requesting_unit_id } = useField('requesting_unit_id');
  const { value: attachment } = useField('attachment');

  const onSubmit = handleSubmit(values => {
    if(values.solicitation_type == 'consultation') delete values.procedure_id
    if(values.solicitation_type == 'exam') delete values.specialist_id
    emit('save', values)
  })

  const submitNewPatient = async val => {
    const success = await showFeedback(() => patientCreate(val));
    if (success) {
      patientFetch(),
      dialogPatientForm.value = false;
    }
  }

  const submitNewSpecialist = async val => {
    const success = await showFeedback(() => specialistCreate(val));
    if (success) {
      specialistFetch(),
      dialogSpecialistForm.value = false;
    }
  }

  const submitNewProcedure = async val => {
    const success = await showFeedback(() => procedureCreate(val));
    if (success) {
      procedureFetch(),
      dialogProcedureForm.value = false;
    }
  }
  const submitNewRequestingUnit = async val => {
    const success = await showFeedback(() => requestingUnitCreate(val));
    if (success) {
      requestingUnitFetch(),
      dialogRequestingUnitForm.value = false;
    }
  }
  watch(() => patient_id.value, () => {
    console.log(patient_age.value)
  })
  const clear = () => {
    resetForm()
  }
</script>
