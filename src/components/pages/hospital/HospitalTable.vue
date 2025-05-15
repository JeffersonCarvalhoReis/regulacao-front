<template>
  <div>
    <hospital-search @search-hospital="search">
      <slot />
    </hospital-search>
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
      @update-options="updateOptions"
      @view-item="viewHospital"
      @edit-item="handleEdit"
    />
  </div>
  <v-dialog v-model="viewHospitalDetails">
    <hospital-details :hospital-data="hospitalData" @close="viewHospitalDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editHospital"
    class="z-999"
  >
    <hospital-form :model-value="selectedHospital" @close="editHospital = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useHospitalApi } from '@/composables/modules/useHospitalModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useHospitalApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewhospitalDetails = ref(false);
  const hospitalData = ref({});
  const editHospital = ref(false);
  const selectedHospital = ref({});
  const tooltipTextDelete = '.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = hospital => {
    selectedHospital.value = hospital
    editHospital.value = true
  };

  const submit = async hospital => {
    await showFeedback(() => update(hospital.id, hospital));
    refetch();
    editHospital.value = false
  };

  const handleDelete = async hospital => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o hospital <strong>${hospital.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(hospital)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewHospital = v => {
    hospitalData.value = v;
    viewhospitalDetails.value = true;
  }

  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  )


  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'left',
        width: '200px',
      },
      {
        title: 'Hospital',
        key: 'name',
        sortable: true,
        align: 'left',

      },
      {
        title: 'Cidade',
        key: 'city',
        sortable: true,
        align: 'left',

      },

    ];
    if(props.edit || props.showDelete) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        width: '200px',
        align: 'center',
      });
    }
    return baseHeaders
  });

  defineExpose({
    refetch,
  });
</script>
