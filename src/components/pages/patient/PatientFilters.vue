<template>
  <base-card :title="title">
    <v-card-text class="flex flex-col gap-2">
      <h2 class="font-bold text-lg">Dados Pessoais</h2>
      <div class="grid grid-cols-2 gap-2">
        <v-text-field
          v-model="filterForm.name"
          density="compact"
          label="Nome"
          maxlength="100"
          placeholder="Nome completo do paciente"
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
          v-model="filterForm.mother_name"
          density="compact"
          label="Nome da Mãe"
          maxlength="100"
          placeholder="Nome completo da mãe"
          variant="outlined"
        />
        <v-text-field
          v-model="filterForm.observation"
          density="compact"
          label="Observação"
          maxlength="100"
          placeholder="Buscar por palavra-chave em observação"
          variant="outlined"
        />
      </div>
      <v-divider />
      <h2 class="font-bold text-lg">Data de Nascimento</h2>
      <div class="grid grid-cols-3">
        <v-btn-toggle v-model="dateInterval" mandatory>
          <v-btn color="primary">Data Exata</v-btn>
          <v-btn color="primary">Intervalo de Datas</v-btn>
        </v-btn-toggle>
        <div v-if="dateInterval" class="flex gap-2 col-span-2">
          <base-input-date-picker
            v-model="filterForm.birth_date_between[0]"
            label="Início da Data de Nascimento"
          />
          <base-input-date-picker
            v-model="filterForm.birth_date_between[1]"
            label="Final da Data de Nascimento"
          />
        </div>
        <div v-else class="flex gap-2">
          <base-input-date-picker
            v-model="filterForm.birth_date"
            label="Data de Nascimento"
          />
        </div>
      </div>

      <v-divider />
      <h2 class="font-bold text-lg">Documentos</h2>
      <div class="grid grid-cols-2 gap-2">
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
      <h2 class="font-bold text-lg">Endereço</h2>
      <div class="grid grid-cols-2 gap-2">
        <v-text-field
          v-model="filterForm.street"
          density="compact"
          label="Rua"
          maxlength="100"
          placeholder="Nome da rua ou logradouro e número"
          variant="outlined"
        />
        <v-text-field
          v-model="filterForm.neighborhood"
          density="compact"
          label="Bairro"
          maxlength="100"
          placeholder="Bairro ou zona"
          variant="outlined"
        />
      </div>
      <v-divider />
      <h2 class="font-bold text-lg">Refências de Saúde</h2>
      <div class="grid grid-cols-2 gap-2">
        <v-autocomplete
          v-model="filterForm.health_unit_id"
          density="compact"
          item-title="name"
          item-value="id"
          :items="healthUnitData"
          label="Unidade de Saúde"
          variant="outlined"
        />
        <v-autocomplete
          v-model="filterForm.health_agent_id"
          density="compact"
          item-title="name"
          item-value="id"
          :items="healthAgentData"
          label="Agente Comunitário de Saúde"
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
  import { useHealthAgentApi } from '@/composables/modules/useHealthAgentModule';
  import { useHealthUnitApi } from '@/composables/modules/useHealthUnitModule';

  const { formatCpf } = useFormatCpf();
  const { formatCns } = useFormatCns();
  const { onlyNumbers, handlePaste } = useOnlyNumbers();
  const { data: healthAgentData, params: healthAgentParams, refetch: healtAgentRefeth, setFilter: healthAgentFilter } = useHealthAgentApi();
  const { data: healthUnitData, params: healthUnitParams, refetch: healthUnitRefetch } = useHealthUnitApi();

  const emit = defineEmits(['filters']);

  const handleClick = () => {
    emit('filters', filterForm.value)
  }
  onMounted(async () => {
    healthAgentParams.value.per_page = -1;
    healthUnitParams.value.per_page = -1;
    await nextTick();
    healtAgentRefeth();
    healthUnitRefetch();
  });

  const dateInterval = ref(0)
  const title = 'Busca Avançada de Pacientes';
  const filterForm = ref({
    birth_date_between: [null, null],
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
      filterForm.value.birth_date_between = [null, null];
      delete filterForm.value.birth_date;
    }
    else {
      delete filterForm.value.birth_date_between;
    }
  });
</script>

<style lang="scss" scoped>

</style>
