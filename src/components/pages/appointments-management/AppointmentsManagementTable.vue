<template>
  <div>
    <appointments-management-search
      :is-exam="tab == 'exam'"
      @search-appointment="search"
      @search-appointment-date="searchDate"
      @search-procedure="searchProcedure"
      @search-specialist="searchSpecialist"
    />
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
          :class-edit="classConfirm"
          :class-new-action="outpatientRecordClass"
          condiational-action
          deletable
          :edit="props.edit"
          :headers="headers"
          :icon-delete="iconCancel"
          :icon-edit="iconConfirm"
          :icon-new-action="outpatientRecordIcon"
          :items="data"
          :loading="loadingList"
          new-action
          :show-delete="props.showDelete"
          :text-delete="textDelete"
          :text-edit="confirmText"
          :text-new-action="outpatientRecordText"
          :total-items="meta.total"
          @delete-item="chooseAction"
          @edit-item="handleConfirm"
          @new-action="openOutpatientRecord"
          @update-options="updateOptions"
          @view-item="viewAppointment"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.action="{ item }">
            <v-chip
              color="orange"
            >
              Pendente
            </v-chip>
          </template>
        </base-table>

      </v-tabs-window-item>

      <v-tabs-window-item value="exam">
        <base-table
          class="rounted-t-none"
          :class-edit="classConfirm"
          :class-new-action="outpatientRecordClass"
          condiational-action
          deletable
          :edit="props.edit"
          :headers="headers"
          :icon-delete="iconCancel"
          :icon-edit="iconConfirm"
          :icon-new-action="outpatientRecordIcon"
          :items="data"
          :loading="loadingList"
          new-action
          :show-delete="props.showDelete"
          :text-delete="textDelete"
          :text-edit="confirmText"
          :text-new-action="outpatientRecordText"
          :total-items="meta.total"
          @delete-item="chooseAction"
          @edit-item="handleConfirm"
          @new-action="openOutpatientRecord"
          @update-options="updateOptions"
          @view-item="viewAppointment"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.action="{ item }">
            <v-chip
              color="orange"
            >
              Pendente
            </v-chip>
          </template>
        </base-table>
      </v-tabs-window-item>
    </v-tabs-window>


  </div>
  <v-dialog v-model="viewAppointmentDetails">
    <appointment-details :appointment-data="appointmentData" @close="viewAppointmentDetails = false" />
  </v-dialog>
  <v-dialog v-model="dialogOutpatientRecord">
    <appointments-mangement-outpatient-record :appointment-data="appointmentData" title="Ficha Ambulatorial" @close="dialogOutpatientRecord = false" />
  </v-dialog>

</template>

<script setup>
  import { useAppointmentApi } from '@/composables/modules/useAppointmentModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useMeStore } from '@/stores/me';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },

  });
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update } = useAppointmentApi();
  const { showFeedback, confirmModal, showFeedbackLoading } = useSweetAlertFeedback();
  const { formatDate } = useFormatDate();

  const providerUnit = computed(() => useMeStore().providerUnit);
  const getMe = useMeStore().getMe;
  const options = ref({});
  const viewAppointmentDetails = ref(false);
  const appointmentData = ref({});
  const tab = ref('consultation');
  const iconConfirm = 'mdi-check-bold'
  const confirmText = 'Confirmar presença'
  const classConfirm = ref('text-green-600 bg-white/0 border-0 ml-1 h-full');
  const textDelete = 'Paciente ausente';
  const iconCancel = 'mdi-close-thick';
  const outpatientRecordClass = ref('text-green-600 bg-white/0 border-0 ml-1 h-full');
  const outpatientRecordIcon = 'mdi-clipboard-text-outline';
  const outpatientRecordText = 'Ficha Ambulatorial';
  const dialogOutpatientRecord = ref(false);
  const selectedDate = ref(null);

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };
  onMounted(async () => {
    await getMe();
    window.Echo.channel('appointments')
      .listen('.updated', event => {
        if(providerUnit.value == event.provider_unit)
          refetch();
      });
    window.Echo.channel('appointments')
      .listen('.deleted', event => {
        if(providerUnit.value == event.provider_unit)
          refetch();
      });
  });
  const chooseAction = async appointment => {
    if( appointment.status == 'scheduled') {
      await handleDelete(appointment)
    } else {
      await handleUndo(appointment);
    }
  }
  const handleDelete = async appointment => {
    const confirm = await confirmModal(`Confirmar a ausência do paciente <strong>${appointment.patient}</strong>?`, 'Atenção', 'question')
    if(confirm) {
      appointment.status = 'not-present'
      await showFeedback(() => update(appointment.id, appointment)) ;
      refetch()
    }
  };

  const handleUndo = async appointment => {

    const confirm = await confirmModal(`Confirmar ação de voltar ao estado anterior do paciente <strong>${appointment.patient}</strong>?`, 'Atenção', 'question')
    if(confirm) {
      appointment.status = 'scheduled'
      await showFeedback(() => update(appointment.id, appointment)) ;
      refetch()
    }
  }

  const handleConfirm = async appointment => {
    const confirm = await confirmModal(`Confirmar a presença do paciente <strong>${appointment.patient}</strong>?`, 'Atenção', 'question', 'bg-green-500 text-white shadow-sm', 'bg-red-500 text-white shadow-sm')
    if(confirm) {
      appointment.status = 'realized'
      await showFeedbackLoading(() => update(appointment.id, appointment));
      await refetch();

      const updated = data.value.find(v => v.id === appointment.id);
      if (updated) {
        appointmentData.value = updated;
        dialogOutpatientRecord.value = true;
      }
    }
  };

  const search = debounce(async v => {
    setFilter('search', v);
    await nextTick()
    refetch();
  }, 500);

  const searchProcedure = async procedure => {
    setFilter('procedure_id', procedure);
    await nextTick();
    refetch();
  }
  const searchSpecialist = async specialist => {
    setFilter('specialist_id', specialist);
    await nextTick();
    refetch();
  }
  const searchDate = async date => {
    date.setHours(0, 0, 0, 0);

    selectedDate.value = date;

    setFilter('date', date);
    await nextTick();
    refetch();
  }
  const viewAppointment = v => {
    appointmentData.value = v;
    viewAppointmentDetails.value = true;
  };

  const handleWatch = debounce(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = selectedDate.value || today;

    setFilter('date', date);
    setFilter('solicitation_type', tab.value);
    await nextTick();
    setTableOptions(options.value);
    refetch();
  }, 100);

  const openOutpatientRecord = v => {
    appointmentData.value = v;
    dialogOutpatientRecord.value = true
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
        title: 'Médico',
        key: 'doctor',
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
    refetch,
  });
</script>
