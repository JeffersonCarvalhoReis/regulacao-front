<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados Pessoais">
          <div>CPF: {{ patientData.cpf }}</div>
          <div>Gênero: {{ genderMap(patientData.gender) }}</div>
          <div>Nome da mãe: {{ patientData.mother_name }}</div>
          <div>CNS: {{ patientData.cns }}</div>
          <div>Data de Nascimento: {{ formatDate(patientData.birth_date) }}</div>
          <div>Idade: {{ calculateAge(patientData.birth_date) }}</div>
          <div v-if="patientData.observation">Obs.: {{ patientData.observation }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Endereço">
          <div>Rua: {{ patientData.street }}</div>
          <div>Bairro: {{ patientData.neighborhood }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Contato">
          <div>Telefone: {{ patientData.phone }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Referências de Saúde">
          <div>PSF: {{ patientData.health_unit }}</div>
          <div>ACS: {{ patientData.health_agent }}</div>
        </InfoGroup>
      </BaseSection>

      <h2 class="text-xl my-2">Histórico do Paciente</h2>
      <base-table
        class="rounted-t-none"
        :headers="headers"
        :items="patientData.transport_schedules"
        hide-default-footer
        @view-item="historyDetails"
      >
        <template #item.medical_appointment.appointment_date="{ item }">
          {{ formatDate(item.medical_appointment.appointment_date) }}
        </template>
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template #item.medical_appointment.companion_name="{ item }">
              {{ item.medical_appointment.companion_name ? item.medical_appointment.companion_name : 'Sem Acompanhante' }}
        </template>
       </base-table>
    </v-card-text>
  </base-card>
  <v-dialog
    v-model="dialogHistoryDetails"
    class="z-999"
  >
  <PatientTfdHistoryDetails :data="selectedItem" @close="dialogHistoryDetails = false" />
  </v-dialog>
</template>

<script setup>
  const props = defineProps({
    patientData: { type: Object, default: () => ({}) },
  });

  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge()

  const emit = defineEmits(['close']);

  const title = 'Histórico de Viagem do Paciente'
  const genderMap = value => {
    const gender = {
      'F': 'Feminino',
      'M': 'Masculino',
    }
    return gender[value] || 'Outro'
  };
  const dialogHistoryDetails = ref(false);
  const selectedItem = ref(null)

  const historyDetails = (v) => {
    selectedItem.value = v
    dialogHistoryDetails.value = true;
  }
   const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'center',
        width: '100px',
      },
      {
        title: 'Data da Viagem',
        sortable: false,
        key: 'date',
        align: 'center',
      },
      {
        title: 'Data da Consulta',
        key: 'medical_appointment.appointment_date',
        sortable: false,
        align: 'center',
      },
      {
        title: 'Cidade',
        key: 'city',
        sortable: false,
        align: 'center',

      },
      {
        title: 'Hospital',
        value: 'medical_appointment.hospital_name',
        sortable: false,
        align: 'center',

      },
      {
        title: 'Acompanhante',
        key: 'medical_appointment.companion_name',
        sortable: false,
        align: 'center',

      }

    ];
    return baseHeaders
  });
</script>
