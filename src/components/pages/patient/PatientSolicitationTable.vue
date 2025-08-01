<template>
  <div>
    <base-table
      :class-new-action="appointmentClass"
      :edit="false"
      :headers="headers"
      :icon-new-action="appointmentIcon"
      :items="data"
      :loading="loadingList"
      :new-action="appointmentPermission"
      :show-delete="false"
      :text-new-action="appointmentText"
      :total-items="meta.total"
      @new-action="openAppointment"
      @update-options="updateOptions"
      @view-item="viewSolicitation"
    >
      <template #item.solicitation_date="{ item }">
        {{ formatDate(item.solicitation_date) }}
      </template>
      <template #item.is_first_time="{ item }">
        {{ booleanToLabel(item.is_first_time, 'Não', 'Sim') }}
      </template>
      <template #item.is_urgent="{ item }">
        {{ booleanToLabel(item.is_urgent) }}
      </template>
    </base-table>
  </div>
  <v-dialog
    v-model="dialogAppointment"
    class="z-999"
  >
    <appointment-form :solicitation-data="selectedSolicitation" @close="dialogAppointment = false" @save="submitAppointment" />
  </v-dialog>

  <v-dialog v-model="viewSolicitationDetails">
    <solicitation-details :solicitation-data="solicitationData" @close="viewSolicitationDetails = false" />
  </v-dialog>
</template>

<script setup>
  import { useSolicitationApi } from '@/composables/modules/useSolicitationModule';
  import { useAppointmentApi } from '@/composables/modules/useAppointmentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useBooleanLabel } from '@/composables/utils/useBooleanLabel';
  import { useMeStore } from '@/stores/me';

  const props = defineProps({
    patientId: { type: Number, required: true },
    solicitationType: { type: String, default: 'exam' },
  });

  const emit = defineEmits(['submit']);

  const { data, loadingList, refetch, setTableOptions, meta, setFilter } = useSolicitationApi();
  const { create } = useAppointmentApi();
  const { showFeedback } = useSweetAlertFeedback();
  const { formatDate } = useFormatDate();
  const { booleanToLabel } = useBooleanLabel();

  onMounted(async () => {
    await nextTick();
    setFilter('patient_id', props.patientId)
    setFilter('solicitation_type', props.solicitationType)
    setFilter('has_appointment', false)
    refetch()
  })

  const meStore = useMeStore();
  const role = meStore.role;
  const appointmentPermission = ['regulation_officer'].includes(role)
  const options = ref({});
  const viewSolicitationDetails = ref(false);
  const solicitationData = ref({});
  const appointmentIcon = 'mdi-calendar-check'
  const appointmentText = 'Agendar Solicitação'
  const appointmentClass = 'text-green-600 bg-white/0 border-0 ml-1 h-full';
  const dialogAppointment = ref(false);
  const selectedSolicitation = ref({});

  const openAppointment = solicitation => {
    selectedSolicitation.value = solicitation
    dialogAppointment.value = true
  }

  const submitAppointment = async appointment => {
    await showFeedback(() => create(appointment));
    refetch();
    dialogAppointment.value = false;
    emit('submit')
  };

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  }

  const viewSolicitation = v => {
    solicitationData.value = v;
    viewSolicitationDetails.value = true;
  };

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
      {
        title: 'Paciente',
        key: 'patient',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Data da Solicitação',
        key: 'solicitation_date',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Retorno',
        key: 'is_first_time',
        sortable: true,
        align: 'center',

      },
      {
        title: 'Urgência',
        key: 'is_urgent',
        sortable: true,
        align: 'center',
      },
      {
        title: 'Cadastrado por',
        key: 'created_by',
        sortable: true,
        align: 'center',
      },


    ];
    if(appointmentPermission) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        align: 'center',
        width: '100px',
      });
    }
    if(props.solicitationType == 'exam') {
      baseHeaders.splice(2, 0, {
        title: 'Procedimento',
        key: 'procedure',
        sortable: true,
        align: 'center',
      });
    } else if(props.solicitationType == 'consultation') {
      baseHeaders.splice(2, 0, {
        title: 'Especialidade',
        key: 'specialist',
        sortable: true,
        align: 'center',
      });
    }
    return baseHeaders
  });

</script>
