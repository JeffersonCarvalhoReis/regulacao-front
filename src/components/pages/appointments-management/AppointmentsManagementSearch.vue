<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <div class="flex flex-col w-full">
        <v-text-field
          v-model="searchAppointment"
          class="max-w-150"
          density="compact"
          hide-details
          label="Buscar Agendamento de Paciente"
          placeholder="Nome, SUS ou CPF"
          variant="outlined"
          @keyup="emit('search-appointment', searchAppointment)"
        />
        <div class="flex gap-4 mt-4">
          <div class="flex basis-100">
            <v-btn flat icon @click="subDay">
              <v-icon>mdi-chevron-left</v-icon>
              <v-tooltip activator="parent">
                Voltar dia
              </v-tooltip>
            </v-btn>
            <base-input-date-picker
              v-model="appointmentDate"
              class-date-picker="absolute translate-x-100 translate-y-10"
              label="Data"
              readonly
              @update:model-value="handleDateChange"
            />
            <v-btn flat icon @click="addDay">
              <v-icon> mdi-chevron-right</v-icon>
              <v-tooltip activator="parent">
                Avançar dia
              </v-tooltip>
            </v-btn>
          </div>

          <v-autocomplete
            v-if="props.isExam"
            v-model="procedure"
            density="compact"
            item-title="name"
            item-value="id"
            :items="procedureSelectData"
            label="Procedimento"
            variant="outlined"
            @update:model-value="emit('search-procedure', procedure)"
          />
          <v-autocomplete
            v-else
            v-model="specialist"
            density="compact"
            item-title="name"
            item-value="id"
            :items="specialistSelectData"
            label="Especialidade"
            variant="outlined"
            @update:model-value="emit('search-specialist', specialist)"
          />
        </div>
      </div>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useProcedureApi } from '@/composables/modules/useProcedureModule';
  import { addDays, subDays } from 'date-fns';

  const props = defineProps({
    isExam: { type: Boolean, default: false },
  })

  const { data: specialistData, params: specialistParams, refetch: specialistFetch } = useSpecialistApi();
  const { data: procedureData, params: procedureParams, refetch: procedureFetch } = useProcedureApi();

  const emit = defineEmits(['search-appointment', 'search-appointment-date', 'search-specialist', 'search-procedure'])

  const searchAppointment = ref(null);
  const appointmentDate = ref('');
  const specialist = ref(null);
  const procedure = ref(null);
  const today = new Date();
  const specialistSelectData = computed(() => [
    { id: null, name: 'Todos' },
    ...(specialistData.value || []),
  ]);

  const procedureSelectData = computed(() => [
    { id: null, name: 'Todos' },
    ...(procedureData.value || []),
  ]);
  const handleDateChange = v => {
    emit('search-appointment-date', v)
  }

  const addDay = () => {
    appointmentDate.value = addDays(appointmentDate.value, 1)
  }
  const subDay = () => {
    appointmentDate.value = subDays(appointmentDate.value, 1)
  }

  watch(() => appointmentDate.value, newValue => {
    emit('search-appointment-date', newValue)
  })

  onMounted( async () => {
    appointmentDate.value = today;
    specialistParams.value.per_page = -1;
    procedureParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      specialistFetch(),
      procedureFetch(),
    ]);

    watch(() => props.isExam ,newValue => {
      if(newValue){
        specialist.value = null
      } else {
        procedure.value = null
      }
    }, { deep: true })

  })

</script>
