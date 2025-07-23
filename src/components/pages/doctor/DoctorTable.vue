<template>
  <div>
    <doctor-search @search-doctor="search">
      <slot />
    </doctor-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :icon-edit="iconEdit"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
      @view-item="viewDoctor"
    />
  </div>
  <v-dialog v-model="viewDoctorDetails">
    <doctor-details :doctor-data="doctorData" @close="viewDoctorDetails = false" />
  </v-dialog>
  <v-dialog
    v-model="editDoctor"
    class="z-999"
  >
    <doctor-edit :model-value="selectedDoctor" @close="editDoctor = false" @save="submit" @update-table="refetch" />
  </v-dialog>
</template>

<script setup>
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  });

  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useDoctorApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewDoctorDetails = ref(false);
  const doctorData = ref({});
  const editDoctor = ref(false);
  const selectedDoctor = ref({});
  const tooltipTextDelete = 'Não é possível excluir médico enquanto houver unidades vinculadas a ele.'
  const iconEdit = 'mdi-account-edit';


  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = doctor => {
    selectedDoctor.value = doctor
    editDoctor.value = true
  };

  const submit = async value => {
    try {
      await showFeedback(() => update(selectedDoctor.value.id, value))
      await refetch()
      const refreshedDoctor = data.value.find(d => d.id === selectedDoctor.value.id)
      if (refreshedDoctor) {
        selectedDoctor.value = { ...refreshedDoctor }
      }
    } catch (error) {
      console.error('Error updating doctor:', error)
    }
  };

  const handleDelete = async doctor => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o médico <strong>${doctor.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(doctor)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewDoctor = v => {
    doctorData.value = v;
    viewDoctorDetails.value = true;
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
        title: 'Médico',
        key: 'name',
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
