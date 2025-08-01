<template>
  <h1 class="text-2xl font-bold mb-5">Definições do BPA</h1>
  <v-card>
    <v-card-text>
      <h2 class="text-xl font-bold">Dados do Estabelecimento de Saúde</h2>
      <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
        <v-text-field
          v-model="health_unit_name"
          class="col-span-4 not-allowed"
          density="compact"
          label="Nome do Estabelecimento de Saúde"
          maxlength="100"
          messages="Estabelecimento de Saúde não pode ser alterado"
          readonly
          variant="outlined"
        />
        <v-text-field
          v-model="health_unit_cnes"
          class="not-allowed"
          density="compact"
          label="CNES"
          maxlength="100"
          readonly
          variant="outlined"
        />
      </div>
      <h2 class="text-xl font-bold mt-4">Profissional Padrão</h2>
      <div class="flex gap-x-2 mx-2 mt-4">
        <v-autocomplete
          v-model="professional"
          density="compact"
          item-title="name"
          item-value="id"
          :items="data"
          label="Nome do Profissional"
          variant="outlined"
        />
        <v-text-field
          v-model="cns"
          class="not-allowed"
          density="compact"
          label="Cartão Nacional de Saúde (CNS)"
          maxlength="100"
          readonly
          variant="outlined"
        />
        <v-text-field
          v-model="cbo"
          class="not-allowed"
          density="compact"
          label="CBO"
          maxlength="100"
          readonly
          variant="outlined"
        />
      </div>
      <base-button-register
        button-icon="mdi-doctor"
        button-text="Cadastrar Novo Profissional"
        @register="dialogBpadoctor = true"
      />
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="dialogBpadoctor"
    class="z-999"
  >
    <BpaDoctorTable @close="dialogBpadoctor = false" @update="getBpaDoctors" />
  </v-dialog>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useBpaDoctorApi } from '@/composables/modules/useBpaDoctor';
  import { useMeStore } from '@/stores/me';

  const dialogBpadoctor = ref(false)
  const health_unit_name = computed(() => meStore.health_unit)
  const health_unit_cnes = computed(() => meStore.health_unit_cnes)
  const professional = ref(null);
  const professionalData = computed(() => data.value.find(v => v.id == professional.value))
  const cbo = computed(() => professionalData.value?.cbo);
  const cns = computed(() => professionalData.value?.cns);
  const emit = defineEmits(['close']);

  const { showFeedback } = useSweetAlertFeedback();
  const { create, data, refetch, params } = useBpaDoctorApi();
  const meStore = useMeStore();

  const save = async values => {

    await showFeedback(() => create(values))
  }
  const getBpaDoctors = async () => {
    params.value.per_page = -1;
    await nextTick();
    refetch()
  }
  onMounted( async () => {
    meStore.getMe();
    await getBpaDoctors();
  })


</script>

<style lang="scss" scoped>
:deep(.not-allowed .v-field__input) {
  cursor: not-allowed
}

</style>
