<template>
<BaseCard @close="emit('close')" title="Trocar Data da Viagem do Paciente">
  <v-card-text>
      <BaseSection class="mb-4">
        <InfoGroup title="Dados do Paciente">
          <div>Nome: {{ props.patientData.name }}</div>
          <div>patientData de Nascimento: {{ formatDate(props.patientData.birth_date) }}</div>
          <div>Idade: {{ calculateAge(props.patientData.birth_date) }}</div>
          <div>CPF: {{ props.patientData.cpf }}</div>
          <div>CNS: {{ props.patientData.cns }}</div>
          <div>Nome da Mãe: {{ props.patientData.mother_name }}</div>
          <div v-if="props.patientData.phone">Telefone: {{ props.patientData.phone }}</div>
          <div>Unidade de Saúde: {{ props.patientData.health_unit }}</div>
          <div>Agende de Saúde: {{ props.patientData.health_agent }}</div>
          <div>Endereço: {{ `${props.patientData.street} - ${props.patientData.neighborhood}` }}</div>
        </InfoGroup>
        <InfoGroup v-if="hasCompanion" title="Dados do Acompanhante">
          <div>Nome: {{ props.patientData.companion_name }}</div>
          <div v-if="props.patientData.kinship">Parentesco: {{ props.patientData.kinship }}</div>
          <div>Data de Nascimento: {{ formatDate(props.patientData.companion_birth_date) }}</div>
          <div>Idade: {{ calculateAge(props.patientData.companion_birth_date) }}</div>
          <div>CPF: {{ props.patientData.companion_cpf }}</div>
          <div>CNS: {{ props.patientData.companion_cns }}</div>
          <div>Nome da Mãe: {{ props.patientData.companion_mother_name }}</div>
          <div v-if=" props.patientData.companion_phone">Telefone: {{ props.patientData.companion_phone }}</div>
          <div>Endereço: {{ `${props.patientData.companion_street} - ${props.patientData.companion_neighborhood}` }}</div>
        </InfoGroup>
        <InfoGroup title="Dados da Consulta">
          <div>Local: {{ props.patientData.hospital_name}}</div>
          <div>Data da Consulta: {{ formatDate(props.patientData.appointment_date) }}</div>
          <div>Horário da Consulta: {{ props.patientData.appointment_time }}</div>
          <div v-if="props.patientData.notes">Motivo: <span class="uppercase">{{ props.patientData.notes }}</span></div>
          <div>Prioridade: {{ booleanToLabel(props.patientData.is_priority) }}</div>
        </InfoGroup>
    </BaseSection>
  </v-card-text>
  <v-card-actions class="flex gap-5 mx-4 items-start justify-center">
    <v-autocomplete
      v-model="to_travel_id"
      class="required"
      density="compact"
      :item-title="travelLabel"
      :error-messages="errors.to_travel_id"
      item-value="id"
      :items="data"
      label="Selecione uma Viagem"
      variant="outlined"
    />
    <BaseButtonRegister @register="handleMovePassenger" :button-text="btnText" :button-icon="btnIcon" />
  </v-card-actions>
</BaseCard>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useAddPassengerApi } from '@/composables/modules/useAddPassagerModule';
  import { useTravelApi } from '@/composables/modules/useTravelModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    patientData: { type: Object, required: true },
    travelId: { type: String, required: true}
  })
 const emit = defineEmits(['close', 'reload']);

 const { formatDate } = useFormatDate();
 const { calculateAge } = useCalculateAge();
 const { booleanToLabel } = useBooleanLabel();
 const { data, refetch, params } = useTravelApi();
 const { movePassenger } = useAddPassengerApi();
 const { confirmModal, showFeedback } = useSweetAlertFeedback();
 const hasCompanion = computed(() => !!props.patientData.companion_id);
 const btnIcon = 'mdi-swap-horizontal';
 const btnText = 'Confirmar Nova Data';

 const schema = yup.object({
    to_travel_id: yup.number().required('Seleciona uma Data'),
  });

  const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues:  {
      to_travel_id: null,
      patient_id: props.patientData.id
    }
  });

  const { value: to_travel_id } = useField('to_travel_id');

  const handleMovePassenger = async () => {
    const confirm = await confirmModal(`Confirmar a alteração de data do paciente <strong>${props.patientData.name}</strong>?`, 'Atenção');
    if(confirm) {
      onSubmit();
    }
  }

  const onSubmit =  handleSubmit(async values => {
    await showFeedback(() => movePassenger(props.travelId, values))
    emit('reload', values)
  });

 onMounted(async () => {
  params.value.per_page = 20;
  await nextTick();
  await refetch();
 });

const travelLabel = (travel) => {

  if (!travel || !travel.date || !travel.id) return '';

  const date = formatDate(travel.date);

  return `${date} - Horário: ${travel.time}h - Cidade: ${travel.city} - Motorista: ${travel.driver} - Veículo: ${travel.vehicle}`

}
</script>
