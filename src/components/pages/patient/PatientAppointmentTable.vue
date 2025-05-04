<template>
  <div>
    <base-table
      :edit="false"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="false"
      :total-items="meta.total"
      @update-options="updateOptions"
      @view-item="viewAppointment"
    >
    <template #item.date="{ item }">
      {{ formatDate(item.date) }}
    </template>
    </base-table>
  </div>
  <v-dialog
    v-model="viewAppointmentDetails"
    class="z-999"
    >
    <appointment-details :appointment-data="appointmentData" @close="viewAppointmentDetails = false" />
  </v-dialog>
</template>

<script setup>
  import { useAppointmentApi } from '@/composables/modules/useAppointmentModule';

  const props = defineProps({
    patientId: { type: Number, required: true },
    solicitationType: { type: String, default: 'exam'},
    appointmentStatus: { type: String, required: true }
  })

  const { data, loadingList, refetch, setTableOptions, meta, setFilter } = useAppointmentApi();
  const { formatDate } = useFormatDate();

  onMounted(() => {
    fetchData()
  });

  const fetchData = async () => {
    await nextTick();
    setFilter('patient_id', props.patientId)
    setFilter('solicitation_type', props.solicitationType)
    setFilter('status', props.appointmentStatus)
    refetch()
  }

  const options = ref({});
  const viewAppointmentDetails = ref(false);
  const appointmentData = ref({});

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  }

  const viewAppointment = v => {
    appointmentData.value = v;
    viewAppointmentDetails.value = true;
  }

  watch(
    () => options.value,
    newOptions => {
      setTableOptions(newOptions)
    },
    { deep: true, immediate: false }
  );

  watch(
    () => props.solicitationType,
    newValue => {
    setFilter('solicitation_type', newValue)
    refetch()
    },
    { deep: true }
  );


  const headers = computed( () => {
        const baseHeaders = [
  {
    title: 'Detalhes',
    value: 'view',
    align: 'center',
    width: '20px',
  },
    // Campos do agendamento
  {
    title: 'Nome do Paciente',
    key: 'patient',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Data do Agendamento',
    key: 'created_at',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Data da Consulta',
    key: 'date',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Hora da Consulta',
    key: 'time',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Unidade Prestadora',
    key: 'provider_unit',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Médico',
    key: 'doctor',
    align: 'center',
    sortable: true,
  },
  {
    title: 'Agendado Por',
    key: 'scheduled_by',
    align: 'center',
    sortable: true,
  },
  ];
  if(props.solicitationType == 'exam') {
      baseHeaders.splice(5, 0, {
      title: 'Procedimento',
      key: 'procedure',
      sortable: true,
      align: 'center',
    });
    } else if(props.solicitationType == 'consultation') {
      baseHeaders.splice(5, 0, {
      title: 'Especialidade',
      key: 'specialist',
      sortable: true,
      align: 'center',
    });
    }
    return baseHeaders;
  });

  defineExpose({
    fetchData
  });
</script>
