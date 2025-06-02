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
          <div>Idade: {{ calculateAge(patientData.birth_date) }} anos</div>
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
      <div v-if="!['tfd'].includes(role)">
        <h2 class="text-xl my-2">Histórico do Paciente</h2>
          <v-tabs
            v-model="tab"
            selected-class="text-blue-800 bg-blue-100 border-b-2 border-blue-800"
            class="border"
          >
          <v-tab class="font-bold px-10" value="solicitations">
            Solicitações
          </v-tab>
          <v-divider vertical />

          <v-tab class="font-bold px-10" value="scheduled">
            Agendados
          </v-tab>
          <v-divider vertical />

          <v-tab class="font-bold px-10" value="realized">
            Realizados
          </v-tab>
          <v-divider vertical />

          <v-tab class="font-bold px-10" value="not-present">
            Não Comparecidos
          </v-tab>
          <v-divider vertical />
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-select
            v-if="tab !== 'solicitations'"
            v-model="solicitationType"
            :items="solicitationTypeOptions"
            :label="tab === 'solicitations' ? 'Tipo de Solicitação' : 'Tipo de Agendamento'"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            class="max-w-100 mt-4"
          />

          <v-tabs-window-item value="solicitations">
            <v-select
              v-model="solicitationType"
              :items="solicitationTypeOptions"
              label="Tipo de Solicitação"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="compact"
              class="max-w-100 mt-4"
            />
            <patient-solicitation-table
              :patient-id="patientData.id"
              :solicitation-type="solicitationType"
              @submit="updateAppointmentTable"
            />
          </v-tabs-window-item>

          <v-tabs-window-item v-for="tabValue in appointmentTabs" :key="tabValue" :value="tabValue">
            <patient-appointment-table
              :patient-id="patientData.id"
              :solicitation-type="solicitationType"
              :appointment-status="tabValue"
              :ref="tabValue === 'scheduled' ? setAppointmentTableRef : undefined"
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card-text>
  </base-card>
</template>

<script setup>
  import { useMeStore } from '@/stores/me';
  const props = defineProps({
    patientData: { type: Object, default: () => ({}) },
  });

  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge()

  const emit = defineEmits(['close']);

  const meStore = useMeStore();
  const role = meStore.role

  const appointmentTableRef = ref(null);
  const title = computed(() => `Paciente: ${props.patientData.name}`);
  const tab = ref();
  const solicitationType = ref('exam');
  const appointmentTabs = ['scheduled', 'realized', 'not-present'];

  const solicitationTypeOptions = [
    { label: 'Consulta', value: 'consultation' },
    { label: 'Exame', value: 'exam' }
  ];

  const genderMap = value => {
    const gender = {
      'F': 'Feminino',
      'M': 'Masculino',
    }
    return gender[value] || 'Outro'
  };

  const setAppointmentTableRef = el => {
    appointmentTableRef.value = el;
  };

  const updateAppointmentTable = () => {
    appointmentTableRef.value?.fetchData();
  };
</script>
