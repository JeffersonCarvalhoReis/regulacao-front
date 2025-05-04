<template>
  <div>
    <specialist-search @search-specialist="search">
      <slot />
    </specialist-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      :newAction="addDoctor"
      :iconNewAction="iconAddDoctor"
      :classNewAction="classAddDoctor"
      :textNewAction="textAddDoctor"
      @delete-item="handleDelete"
      @update-options="updateOptions"
      @view-item="viewSpecialist"
      @edit-item="handleEdit"
      @new-action="openDoctorManager"
    />
  </div>
  <v-dialog v-model="viewSpecialistDetails">
    <specialist-details :specialist-data="specialistData" @close="viewSpecialistDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editSpecialist"
    class="z-999"
  >
    <specialist-form :model-value="selectedSpecialist" @close="editSpecialist = false" @save="submit" />
  </v-dialog>

  <v-dialog
    v-model="dialogDoctorManager"
    class="z-999"
  >
    <specialist-doctor-manager :model-value="selectedSpecialist" @close="dialogDoctorManager = false" @save="submitUpdateDoctors" @update-table="updateTable"/>
  </v-dialog>

</template>

<script setup>
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const {data, loadingList, refetch, setTableOptions, meta, setFilter, clearFilters, update, destroy, setInclude } = useSpecialistApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewSpecialistDetails = ref(false);
  const specialistData = ref({});
  const editSpecialist = ref(false);
  const dialogDoctorManager = ref(false)
  const selectedSpecialist = ref({});
  const tooltipTextDelete = 'Não é possível excluir a especialidade enquanto houver solicitações vinculadas a ela.'
  const addDoctor = true;
  const iconAddDoctor = 'mdi-doctor';
  const classAddDoctor = 'text-green-600 bg-white/0 border-0 ml-1 h-full';
  const textAddDoctor = 'Adicionar/Excluir médicos na unidade'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = specialist => {
    selectedSpecialist.value = specialist
    editSpecialist.value = true
  };

  const updateTable = () => {
    clearFilters();
    refetch();
  }
  const submit = async specialist => {
    await showFeedback(() => update(specialist.id, specialist));
    updateTable();
    editSpecialist.value = false
  };
  const submitUpdateDoctors = async doctor => {
    await showFeedback(() => update(selectedSpecialist.value.id, doctor));
    updateTable();
    dialogDoctorManager.value = false
  };

  const handleDelete = async specialist => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a Especialidade <strong>${specialist.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(specialist)) ;
      updateTable();
    }
  };

  const openDoctorManager = specialist => {
    selectedSpecialist.value = specialist
    dialogDoctorManager.value = true
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewSpecialist = v => {
    specialistData.value = v;
    viewSpecialistDetails.value = true;
  }


  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      setInclude('doctors')
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
        title: 'Especialidade',
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
