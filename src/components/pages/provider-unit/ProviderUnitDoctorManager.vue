<template>
  <base-card :title="title" @close="emit('close')">
  <div class="flex flex-row justify-end mx-10 my-5">
    <v-btn
    class="bg-blue-500 hover:bg-blue-700 text-white"
    prepend-icon="mdi-account-multiple-plus"
    @click="dialogAddDoctors = true"
    >
      Adicionar Médicos
    </v-btn>
  </div>

  <div class="mx-10 mb-15">
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :items="doctorsReversed"
      :loading="loadingList"
      :show-delete="false"
      :edit="false"
      hide-default-footer
      :newAction="true"
      :iconNewAction="iconRemoveDoctor"
      :classNewAction="classRemoveDoctor"
      :textNewAction="textRemoveDoctor"
      @new-action="handleRemoveDoctor"
    />
  </div>
  <v-dialog
    v-model="dialogAddDoctors"
    class="z-999"
    >
    <AddDoctors :doctors-data="doctorsToAdd" @save="addDoctor" @close="dialogAddDoctors = false" />
  </v-dialog>

  </base-card>
</template>

<script setup>
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  });

  const { data, loadingList, refetch, setInclude, setFilter, update } = useProviderUnitApi();
  const { data: doctorData, refetch: doctorsFetch, params: doctorsParams } = useDoctorApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const emit = defineEmits(['close', 'update-table']);

  const title = 'Gerenciar Médicos da Unidade';
  const iconRemoveDoctor = 'mdi-delete';
  const classRemoveDoctor = 'text-red-600 bg-white/0 border-0 ml-1 h-full';
  const textRemoveDoctor = 'Remover médico dessa unidade';
  const dialogAddDoctors = ref(false)
  const doctors = ref([]);
  const doctorsToAdd = computed(() => {
    const currentDoctorIds = doctors.value.map(doc => doc.id);
    return doctorData.value.filter(d => !currentDoctorIds.includes(d.id));
  });
  const doctorsReversed = computed(() => [...doctors.value].reverse());


  const updateTable = async ()  => {
    setInclude('doctors');
      setFilter('id', props.modelValue.id)
      await nextTick()
      await refetch();
      doctors.value = [...(data.value[0]?.doctors ?? [])];

  }
  onMounted(async () => {
    await updateTable();
    doctorsParams.value.per_page = -1;
    await nextTick();
    doctorsFetch();
  });

  const removeDoctor = async (doctor) => {
    doctors.value = doctors.value.filter(d => d.id !== doctor.id);
    const doctorsToUpdate = {
      doctor_ids: doctors.value.map(d => d.id)
    }
    const response = await update(props.modelValue.id,  doctorsToUpdate );
    return response;
  };

const handleRemoveDoctor = async (doctor) => {
  const confirm = await confirmModal(`Tem certeza que deseja remover o médico <strong>${doctor.name}</strong> da <strong>${props.modelValue.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => removeDoctor(doctor)) ;
      refetch()
      emit('update-table')
    }
  };

  const addDoctor = async (doctorsToUpdate) => {
    const currentDoctorIds = doctors.value.map(doc => doc.id)
    doctorsToUpdate.doctor_ids.push(...currentDoctorIds);
    await showFeedback(() => update(props.modelValue.id, doctorsToUpdate));
    updateTable()
    emit('update-table')
    dialogAddDoctors.value = false

  };

  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Médicos',
        key: 'name',
        sortable: false,
        align: 'left',

      },
      {
        title: 'Remover',
        value: 'action',
        width: '200px',
        align: 'center',
      }

    ];
    return baseHeaders
  });


</script>
