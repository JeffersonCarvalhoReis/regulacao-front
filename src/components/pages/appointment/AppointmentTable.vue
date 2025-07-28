<template>
  <div>
    <appointment-search @search-appointment="search" @search-appointment-status="searchStatus">
      <slot />
    </appointment-search>
    <div class="text-right ">
      <v-btn class="m-2 bg-ita-green hover:bg-green-600 text-white" prepend-icon="mdi-microsoft-excel" @click="handleExportAppointments">
        Exportar Planilha

      </v-btn>
    </div>
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
          :class-new-action="appointmentConfirmationClass"
          :edit="props.edit"
          :headers="headers"
          :icon-delete="iconDelete"
          :icon-new-action="appointmentConfirmationIcon"
          :items="data"
          :loading="loadingList"
          new-action
          :show-delete="props.showDelete"
          :text-delete="textDelete"
          :text-new-action="appointmentConfirmationText"
          :tooltip-text-delete="tooltipTextDelete"
          :total-items="meta.total"
          @delete-item="handleDelete"
          @edit-item="handleEdit"
          @new-action="openAppointmentConfirmation"
          @update-options="updateOptions"
          @view-item="viewAppointment"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.action="{ item }">
            <v-btn-group
              divided
              variant="outlined"
            >
              <v-tooltip
                text="Aceitar"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-green-500 border-0 ml-1 h-full"
                    flat
                    icon
                    @click="confirmAppointment(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip
                text="Recusar"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-red-500 border-0 ml-1 h-full"
                    flat
                    icon
                    @click="handleDelete(item)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-btn-group>
          </template>
        </base-table>

      </v-tabs-window-item>

      <v-tabs-window-item value="exam">
        <base-table
          class="rounted-t-none"
          :class-new-action="appointmentConfirmationClass"
          :edit="props.edit"
          :headers="headers"
          :icon-delete="iconDelete"
          :icon-new-action="appointmentConfirmationIcon"
          :items="data"
          :loading="loadingList"
          new-action
          :show-delete="props.showDelete"
          :text-delete="textDelete"
          :text-new-action="appointmentConfirmationText"
          :tooltip-text-delete="tooltipTextDelete"
          :total-items="meta.total"
          @delete-item="handleDelete"
          @edit-item="handleEdit"
          @new-action="openAppointmentConfirmation"
          @update-options="updateOptions"
          @view-item="viewAppointment"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.action="{ item }">
            <v-btn-group
              divided
              variant="outlined"
            >
              <v-tooltip
                text="Aceitar"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-green-500 border-0 ml-1 h-full"
                    flat
                    icon
                    @click="confirmAppointment(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip
                text="Recusar"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-red-500 border-0 ml-1 h-full"
                    flat
                    icon
                    @click="handleDelete(item)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-btn-group>
          </template>
        </base-table>
      </v-tabs-window-item>
    </v-tabs-window>


  </div>
  <v-dialog v-model="viewAppointmentDetails">
    <appointment-details :appointment-data="appointmentData" @close="viewAppointmentDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editAppointment"
    class="z-999"
  >
    <appointment-form :model-value="selectedAppointment" @close="editAppointment = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogAppointmentConfirmation"
    class="z-985"
  >
    <appointment-confirmation :appointment-data="appointmentData" @close="dialogAppointmentConfirmation = false" />
  </v-dialog>
</template>

<script setup>
  import { useAppointmentApi } from '@/composables/modules/useAppointmentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useAppointmentExportApi } from '@/composables/modules/useAppointmentExportModule';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },

  });

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, destroy, clearFilters, setSort, update } = useAppointmentApi();
  const { setFilter: filterExport, exportAppointments, setSort: sortExport, clearFilters: clearFiltersExport } = useAppointmentExportApi();
  const { showFeedback, confirmModal, showFeedbackLoading } = useSweetAlertFeedback();
  const { formatDate } = useFormatDate();
  const options = ref({});
  const viewAppointmentDetails = ref(false);
  const editAppointment = ref(false);
  const selectedAppointment = ref({});
  const appointmentData = ref({});
  const tab = ref('consultation');
  const textDelete = 'Cancelar';
  const iconDelete = 'mdi-cancel';
  const tooltipTextDelete = 'Não é possivel cancelar agendamentos já realizados';
  const appointmentConfirmationIcon = ref('mdi-receipt-text-outline');
  const appointmentConfirmationClass = ref('text-green-600 bg-white/0 border-0 ml-1 h-full');
  const appointmentConfirmationText = ref('Visualizar Comprovante');
  const dialogAppointmentConfirmation = ref(false);

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const clearFiltersTab = () => {
    clearFilters();
    clearFiltersExport();
    setFilter('solicitation_type', tab.value)
    filterExport('solicitation_type', tab.value)
    setSort('-updated_at')
    sortExport('-updated_at')
  }

  const confirmAppointment = async appointment => {
    const confirm = await confirmModal(`Confirmar agendamento de <strong>${appointment.patient}</strong>?`, 'Confirmação', 'question', 'bg-green-500 text-white shadow-sm', 'bg-red-500 text-white shadow-sm');
    if(confirm) {
      appointment.status = 'scheduled';
      await showFeedback(() => update(appointment.id, appointment));
      refetch();
    }
  }

  const handleExportAppointments = async () => {
    await showFeedbackLoading(() => exportAppointments())
  }

  const handleDelete = async appointment => {
    const confirm = await confirmModal(`Tem certeza que deseja cancelar o agendamento do paciente <strong>${appointment.patient}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(appointment)) ;
      refetch()
    }
  };

  const handleEdit = appointment => {
    selectedAppointment.value = appointment
    editAppointment.value = true
  };

  const submit = async appointment => {
    await showFeedback(() => update(appointment.id, appointment));
    refetch();
    editAppointment.value = false
  };

  const search = debounce(async v => {
    setFilter('search', v);
    filterExport('search', v)
    await nextTick()
    refetch();
  }, 500);
  const searchStatus = async v => {
    setFilter('status', v);
    filterExport('status', v);
    await nextTick()
    refetch();
  };

  const viewAppointment = v => {
    appointmentData.value = v;
    viewAppointmentDetails.value = true;
  };

  const handleWatch = debounce(async () => {
    setFilter('solicitation_type', tab.value)
    filterExport('solicitation_type', tab.value)
    await nextTick()
    setTableOptions(options.value)
    refetch()
  }, 100)

  const openAppointmentConfirmation = v => {
    appointmentData.value = v;
    dialogAppointmentConfirmation.value = true;
  }

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
      {
        title: 'Ações',
        value: 'action',
        align: 'center',
        width: '10px',
      }];
    if(tab.value == 'exam') {
      baseHeaders.splice(5, 0, {
        title: 'Procedimento',
        key: 'procedure',
        align: 'center',
        sortable: true,
      });
    } else if(tab.value == 'consultation') {
      baseHeaders.splice(5, 0, {
        title: 'Especialidade',
        key: 'specialist',
        align: 'center',
        sortable: true,
      });
    }
    return baseHeaders;
  });

  defineExpose({
    setFilter,
    filterExport,
    refetch,
    clearFiltersTab,
  });
</script>
