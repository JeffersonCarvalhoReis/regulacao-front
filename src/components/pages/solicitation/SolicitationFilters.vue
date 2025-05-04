<template>
  <base-card :title="title">
    <v-card-text class="flex flex-col gap-2">
      <h2 class="font-bold text-lg">Dados do Patiente</h2>
      <div class="grid grid-cols-2 gap-2">
        <v-autocomplete
            v-model="filterForm.patient_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="patientData"
            label="Paciente"
            variant="outlined"
          />
        <v-select
          v-model="filterForm.gender"
          density="compact"
          item-title="label"
          item-value="value"
          :items="genderOptions"
          label="Gênero"
          variant="outlined"
        />
        <v-text-field
          v-model="filterForm.cns"
          density="compact"
          label="CNS"
          maxlength="18"
          placeholder="Número do cartão do SUS"
          variant="outlined"
          @keypress="onlyNumbers"
          @paste="event => handlePaste(event, formatCns, val => filterForm.cns = val, { maxDigits: 15 })"
          @update:model-value="val => filterForm.cns = formatCns(val)"
        />
        <v-text-field
          v-model="filterForm.cpf"
          density="compact"
          label="CPF"
          maxlength="14"
          placeholder="CPF do paciente"
          variant="outlined"
          @keypress="onlyNumbers"
          @paste="event => handlePaste(event, formatCpf, val => filterForm.cpf = val, { maxDigits: 14 })"
          @update:model-value="val => filterForm.cpf = formatCpf(val)"
        />
      </div>
      <v-divider />
      <h2 class="font-bold text-lg">Data da Solicitação</h2>
        <div class="grid grid-cols-3">
          <v-btn-toggle v-model="dateInterval" mandatory>
            <v-btn color="primary">Data Exata</v-btn>
            <v-btn color="primary">Intervalo de Datas</v-btn>
          </v-btn-toggle>
          <div v-if="dateInterval" class="flex gap-2 col-span-2">
            <base-input-date-picker
              v-model="filterForm.solicitation_date_between[0]"
              label="Início da Data de Solicitação"
            />
            <base-input-date-picker
              v-model="filterForm.solicitation_date_between[1]"
              label="Final da Data de Solicitação"
            />
          </div>
          <div v-else class="flex gap-2">
            <base-input-date-picker
              v-model="filterForm.solicitation_date"
              label="Data de Solicitação"
            />
          </div>
        </div>


        <v-divider />
        <h2 class="font-bold text-lg">Dados da Solicitação</h2>
        <div class="grid grid-cols-2 gap-2">
          <v-select
            v-model="filterForm.is_first_time"
            density="compact"
            item-title="label"
            item-value="value"
            :items="isFirstTimeOptions"
            label="Retorno"
            variant="outlined"
          />
          <v-select
            v-model="filterForm.is_urgent"
            density="compact"
            item-title="label"
            item-value="value"
            :items="isUrgentOptions"
            label="Urgente"
            variant="outlined"
          />

          <v-autocomplete
            v-model="filterForm.specialist_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="specialistData"
            label="Especialidade"
            variant="outlined"
          />
          <v-autocomplete
            v-model="filterForm.procedure_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="procedureData"
            label="Procedimento"
            variant="outlined"
          />
          <v-autocomplete
            v-model="filterForm.requesting_unit_id"
            density="compact"
            item-title="name"
            item-value="id"
            :items="requestingUnitData"
            label="Unidade Solicitante"
            variant="outlined"
          />
          <v-autocomplete
            v-model="filterForm.created_by_id"
            density="compact"
            item-title="user"
            item-value="id"
            :items="userData"
            label="Cadastrado por"
            variant="outlined"
          />
        </div>

    </v-card-text>
    <v-card-actions class="m-4">
      <v-btn
        class="bg-blue-500 hover:bg-blue-700 text-white px-2"
        prepend-icon="mdi-magnify"
        @click="handleClick"
      >
        Buscar
      </v-btn>
    </v-card-actions>
  </base-card>
</template>

<script setup>
  import { useProcedureApi } from '@/composables/modules/useProcedureModule';
  import { useRequestingUnitApi } from '@/composables/modules/useRequestingUnitModule';
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { usePatientApi } from '@/composables/modules/usePatientModule';
  import { useUserApi } from '@/composables/modules/useUserModule';

  const { formatCpf } = useFormatCpf();
  const { formatCns } = useFormatCns();
  const { onlyNumbers, handlePaste } = useOnlyNumbers();

  const { data: procedureData, params: procedureParams, refetch: procedureRefetch } = useProcedureApi();
  const { data: userData, params: userParams, refetch: userRefetch } = useUserApi();
  const { data: requestingUnitData, params: requestingUnitParams, refetch: requestingUnitRefetch } = useRequestingUnitApi();
  const { data: specialistData, params: specialistParams, refetch: specialistRefetch } = useSpecialistApi();
  const { data: patientData, params: patientParams, refetch: patientRefetch } = usePatientApi();

  const isFirstTimeOptions = [
    { label: 'Sim', value: 0 },
    { label: 'Não', value: 1 }
  ];
  const isUrgentOptions = [
    { label: 'Sim', value: 1 },
    { label: 'Não', value: 0 }
  ];

  const emit = defineEmits(['filters']);

  const handleClick = () => {
    emit('filters', filterForm.value)
  }
  onMounted(async () => {
    procedureParams.value.per_page = -1;
    userParams.value.per_page = -1;
    requestingUnitParams.value.per_page = -1;
    specialistParams.value.per_page = -1;
    patientParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      procedureRefetch(),
      userRefetch(),
      requestingUnitRefetch(),
      specialistRefetch(),
      patientRefetch(),
    ]);

  });

  const dateInterval = ref(0)
  const title = 'Busca Avançada de Pacientes';
  const filterForm = ref({
    solicitation_date_between: [null, null],
  });

  const genderOptions = [
    { label: 'Feminino', value: 'F' },
    { label: 'Masculino', value: 'M' },
    { label: 'Outro', value: 'O' },
  ];
  watch(() => filterForm.value.health_unit_id, newValue => {
    delete filterForm.value.health_agent_id
    healthAgentFilter('health_unit_id', newValue);
    healtAgentRefeth()
  });
  watch(() => dateInterval.value, newValue => {
    if(newValue == 1) {
      filterForm.value.solicitation_date_between = [null, null];
      delete filterForm.value.solicitation_date;
    }
    else {
      delete filterForm.value.solicitation_date_between;
    }
  });
</script>

<style lang="scss" scoped>

</style>
