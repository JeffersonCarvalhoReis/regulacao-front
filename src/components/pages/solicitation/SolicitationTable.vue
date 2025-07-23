<template>
  <div>
    <solicitation-search @search-solicitation="search">
      <slot />
    </solicitation-search>
    <v-tabs
      v-model="tab"
      class="bg-white border-t border-x border-gray-200"
      selected-class="text-blue-800 bg-blue-100"
    >
      <v-tab class="font-bold px-10" value="consultation">
        Consultas
      </v-tab>
      <v-tab class="font-bold  px-10" value="exam">
        Exames
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="consultation">
        <base-table
          class="rounted-t-none"
          :class-new-action="appointmentClass"
          :edit="props.edit"
          :headers="headers"
          :icon-new-action="appointmentIcon"
          :items="data"
          :loading="loadingList"
          :new-action="appointmentPermission"
          :show-delete="props.showDelete"
          :text-new-action="appointmentText"
          :tooltip-text-delete="tooltipTextDelete"
          :total-items="meta.total"
          @delete-item="handleDelete"
          @edit-item="handleEdit"
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
      </v-tabs-window-item>

      <v-tabs-window-item value="exam">
        <base-table
          class="rounted-t-none"
          :class-new-action="appointmentClass"
          :edit="props.edit"
          :headers="headers"
          :icon-new-action="appointmentIcon"
          :items="data"
          :loading="loadingList"
          :new-action="appointmentPermission"
          :show-delete="props.showDelete"
          :text-new-action="appointmentText"
          :tooltip-text-delete="tooltipTextDelete"
          :total-items="meta.total"
          @delete-item="handleDelete"
          @edit-item="handleEdit"
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
      </v-tabs-window-item>
    </v-tabs-window>


  </div>
  <v-dialog v-model="viewSolicitationDetails">
    <solicitation-details :solicitation-data="solicitationData" @close="viewSolicitationDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editSolicitation"
    class="z-999"
  >
    <solicitation-form :model-value="selectedSolicitation" @close="editSolicitation = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogAppointment"
    class="z-999"
  >
    <appointment-form :solicitation-data="selectedSolicitation" @close="dialogAppointment = false" @save="submitAppointment" />
  </v-dialog>
  <v-dialog
    v-model="dialogAppointmentConfirmation"
    class="z-985"
  >
    <appointment-confirmation :appointment-data="appointmentData" @close="dialogAppointmentConfirmation = false" />
  </v-dialog>
</template>

<script setup>
  import { useSolicitationApi } from '@/composables/modules/useSolicitationModule';
  import { useAppointmentApi } from '@/composables/modules/useAppointmentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useBooleanLabel } from '@/composables/utils/useBooleanLabel';
  import { useMeStore } from '@/stores/me';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },

  });
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, destroy, clearFilters, updateWithAttachment } = useSolicitationApi();
  const { create } = useAppointmentApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const { booleanToLabel } = useBooleanLabel();
  const { formatDate } = useFormatDate();

  const meStore = useMeStore();
  const role = meStore.role;
  const appointmentPermission = ['regulation_officer'].includes(role)
  const options = ref({});
  const viewSolicitationDetails = ref(false);
  const editSolicitation = ref(false);
  const dialogAppointment = ref(false);
  const dialogAppointmentConfirmation = ref(false);
  const appointmentData = ref(null);
  const selectedSolicitation = ref({});
  const solicitationData = ref({});
  const tooltipTextDelete = 'Não é possível excluir uma solicitação já agendada.'
  const tab = ref('consultation');
  const appointmentIcon = 'mdi-calendar-check'
  const appointmentText = 'Agendar Solicitação'
  const appointmentClass = 'text-green-600 bg-white/0 border-0 ml-1 h-full';


  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const openAppointment = solicitation => {
    selectedSolicitation.value = solicitation
    dialogAppointment.value = true
  }

  const clearFiltersTab = () => {
    clearFilters();
    setFilter('solicitation_type', tab.value)
    setFilter('has_appointment', false)
  }
  const handleDelete = async solicitation => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a solicitação do paciente <strong>${solicitation.patient}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(solicitation)) ;
      refetch()
    }
  };

  const handleEdit = solicitation => {
    selectedSolicitation.value = solicitation
    editSolicitation.value = true
  };

  const submit = async solicitation => {
    await showFeedback(() => updateWithAttachment(solicitation.id, solicitation));
    refetch();
    editSolicitation.value = false
  };
  const submitAppointment = async appointment => {
    const newAppointmentData = await showFeedback(() => create(appointment));
    refetch();
    dialogAppointment.value = false;
    appointmentData.value = newAppointmentData.data
    dialogAppointmentConfirmation.value = true;
  };

  const search = debounce(async v => {
    setFilter('search', v);
    await nextTick()
    refetch();
  }, 500);

  const viewSolicitation = v => {
    solicitationData.value = v;
    viewSolicitationDetails.value = true;
  };

  const handleWatch = debounce(async () => {
    setFilter('solicitation_type', tab.value)
    setFilter('has_appointment', false)
    await nextTick()
    setTableOptions(options.value)
    refetch()
  }, 100)

  watch(
    [() => options.value, () => tab.value],
    handleWatch,
    { deep: true }
  )

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
      {
        title: 'Ações',
        value: 'action',
        align: 'center',
        width: '100px',
      },

    ];
    if(tab.value == 'exam') {
      baseHeaders.splice(2, 0, {
        title: 'Procedimento',
        key: 'procedure',
        sortable: true,
        align: 'center',
      });
    } else if(tab.value == 'consultation') {
      baseHeaders.splice(2, 0, {
        title: 'Especialidade',
        key: 'specialist',
        sortable: true,
        align: 'center',
      });
    }
    return baseHeaders
  });
  defineExpose({
    setFilter,
    refetch,
    clearFiltersTab,
  });
</script>
