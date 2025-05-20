<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Viagem">
          <div>Data da viagem: <span class="content"> {{ formatDate(props.data.date) }}</span></div>
          <div>Horário da viagem: <span class="content"> {{ props.data.time }}</span></div>
          <div>Destino: <span class="content"> {{ props.data.city }}</span></div>
          <div>Mortorista: <span class="content"> {{ props.data.driver }}</span></div>
          <div>Veículo: <span class="content"> {{ props.data.vehicle }}</span></div>
        </InfoGroup>
        <v-divider vertical />
          <InfoGroup title="Dados da consulta">
          <div>Paciente: <span class="content"> {{ props.data.medical_appointment.patient_name }}</span></div>
          <div>Acompanhante: <span class="content"> {{ props.data.medical_appointment.companion_name ?? 'Sem Acompanhante' }}</span></div>
          <div v-if="props.data.medical_appointment.companion_name  && props.data.medical_appointment.kinship">
            Parentesco do Acompanhante: <span class="content"> {{ props.data.medical_appointment.kinship }} </span>
          </div>
          <div>Hospital: <span class="content"> {{ props.data.medical_appointment.hospital_name }}</span></div>
          <div>Data da Consulta: <span class="content"> {{ formatDate(props.data.medical_appointment.appointment_date) }}</span></div>
          <div>Horário do Exame: <span class="content"> {{ props.data.medical_appointment.appointment_time }} </span></div>
          <div>Prioridade: <span class="content"> {{ props.data.medical_appointment.priority ? 'Sim' : 'Não' }}</span></div>
          <div v-if="props.data.medical_appointment.notes">Observações: <span class="content"> {{ props.data.medical_appointment.notes }}</span></div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>

</template>

<script setup>
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
  });

  const { formatDate } = useFormatDate();

  const emit = defineEmits(['close']);

  const title = 'Detalhes da Viagem'
</script>
<style scoped>

.content {
  @apply capitalize
}
</style>
