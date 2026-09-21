<template>
  <div>
    <schedule-search
      @search-date="filterByDate"
      @search-doctor="filterByDoctor"
      @search-provider-unit="filterByProviderUnit"
    >
      <slot />
    </schedule-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
    >
      <template #item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template #item.doctor="{ item }">
        {{ item.doctor || "Qualquer médico" }}
      </template>
      <template #item.vacancies="{ item }">
        {{ item.available_vacancies }} / {{ item.vacancies }}
      </template>
      <template #item.is_open="{ item }">
        <v-chip
          :color="item.is_open ? 'green' : 'red'"
          size="small"
          variant="flat"
        >
          {{ item.is_open ? "Aberta" : "Fechada" }}
        </v-chip>
      </template>
    </base-table>
  </div>
  <v-dialog v-model="editSchedule" class="z-999">
    <schedule-form
      :model-value="selectedSchedule"
      @close="editSchedule = false"
      @save="submit"
    />
  </v-dialog>
</template>

<script setup>
  import { useScheduleApi } from '@/composables/modules/useScheduleModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },
  });

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, clearFilters, update, destroy } = useScheduleApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();
  const { formatDate } = useFormatDate();

  const options = ref({});
  const editSchedule = ref(false);
  const selectedSchedule = ref({});
  const tooltipTextDelete = 'Não é possível excluir uma agenda que já possui agendamentos vinculados.';

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = schedule => {
    selectedSchedule.value = schedule
    editSchedule.value = true
  };

  const submit = async value => {
    await showFeedback(() => update(selectedSchedule.value.id, value));
    await refetch();
    editSchedule.value = false;
  };

  const handleDelete = async schedule => {
    const confirm = await confirmModal(
      `Tem certeza que deseja excluir a agenda de <strong>${formatDate(schedule.date)}</strong>?`,
      'Atenção'
    );
    if (confirm) {
      await showFeedback(() => destroy(schedule));
      refetch();
    }
  };

  const filterByProviderUnit = async providerUnitId => {
    setFilter('provider_unit_id', providerUnitId);
    await nextTick();
    refetch();
  };

  const filterByDoctor = async doctorId => {
    setFilter('doctor_id', doctorId);
    await nextTick();
    refetch();
  };

  const filterByDate = async date => {
    setFilter('date', date);
    await nextTick();
    refetch();
  };

  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  );

  const headers = computed(() => {
    const baseHeaders = [
      {
        title: 'Data',
        key: 'date',
        sortable: true,
        align: 'center',
      },
      {
        title: 'Unidade Prestadora',
        key: 'provider_unit',
        align: 'center',
      },
      {
        title: 'Médico',
        key: 'doctor',
        align: 'center',
      },
      {
        title: 'Vagas Disponíveis / Total',
        key: 'vacancies',
        sortable: true,
        align: 'center',
      },
      {
        title: 'Situação',
        key: 'is_open',
        align: 'center',
      },
    ];
    if (props.edit || props.showDelete) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        align: 'center',
        width: '100px',
      maxWidth: '100px',
      });
    }
    return baseHeaders
  });

  defineExpose({
    refetch,
    setFilter,
    clearFilters,
  });
</script>
