<template>
  <BaseCard title="Editar Médico" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="flex gap-4 justify-between">
          <v-text-field
            ref="nameInput"
            v-model="name"
            density="compact"
            :disabled="!editName"
            :error-messages="errors.name"
            label="Nome"
            placeholder="Nome do Médico"
            variant="outlined"
          />
          <v-btn color="primary" @click="handleEditName">{{ textButtonEditName }}</v-btn>
        </div>
      </v-form>
      <div class="flex gap-4 my-4">
        <v-btn color="primary" prepend-icon="mdi-medical-bag" @click="openAddSpecialist = true">Adicionar Especialidade</v-btn>
        <v-btn color="primary" prepend-icon="mdi-hospital-building" @click="openAddProviderUnit = true">Adicionar Unidades</v-btn>
      </div>
      <v-tabs
        v-model="tab"
        selected-class="text-blue-800 bg-blue-100"
      >
        <v-tab class="font-bold px-10" value="specialists">
          Espcialidades
        </v-tab>
        <v-tab class="font-bold  px-10" value="provider-unit">
          Unidades que Presta Serviços
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="specialists">
          <DoctorSpecialistTable :model-value="doctor" @update-table="updateSpecialists" />
        </v-tabs-window-item>

        <v-tabs-window-item value="provider-unit">
          <DoctorProviderUnitTable :model-value="doctor" @update-table="updateProviderUnits" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </BaseCard>
  <v-dialog v-model="openAddSpecialist" class="z-999">
    <DoctorAddSpecialists :specialists-data="specialistsToAdd" @close="openAddSpecialist = false" @save="submitSpecialists" />
  </v-dialog>
  <v-dialog v-model="openAddProviderUnit" class="z-999">
    <DoctorAddProviderUnits :provider-units-data="providerUnitsToAdd" @close="openAddProviderUnit = false" @save="submitProviderUnits" />
  </v-dialog>
</template>

<script setup>
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import { useProviderUnitApi } from '@/composables/modules/useProviderUnitModule';
  import { useSpecialistApi } from '@/composables/modules/useSpecialistModule';
  import { useDoctorApi } from '@/composables/modules/useDoctorModule';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  });

  const emit = defineEmits(['update-table','close', 'save','update:modelValue'])

  const { update } = useDoctorApi();
  const { showFeedback } = useSweetAlertFeedback();
  const { data: specialistData, refetch: specialistsFetch, params: specialistsParams } = useSpecialistApi();
  const { data: providerUnitData, refetch: providerUnitsFetch, params: providerUnitsParams } = useProviderUnitApi();

  const doctor = ref({ ...props.modelValue });
  const nameInput = ref(null);
  const editName = ref(false);
  const textButtonEditName = ref('Editar Nome');
  const tab = ref(null);
  const openAddProviderUnit = ref(false);
  const openAddSpecialist = ref(false);

  const providerUnitsToAdd = computed(() => {
    const currentProviderUnitIds = doctor.value.provider_units?.map(p => p.id) || []
    return providerUnitData.value.filter(p => !currentProviderUnitIds.includes(p.id))
  });
  const specialistsToAdd = computed(() => {
    const currentSpecialistIds = doctor.value.specialists?.map(s => s.id) || []
    return specialistData.value.filter(s => !currentSpecialistIds.includes(s.id))
  });

  const updateLocalDoctor = () => {
    doctor.value = { ...props.modelValue }
    resetForm({ values: doctor.value })
  }

  const updateProviderUnits = v => {
    const selectedIds = v.provider_unit_ids || []
    const selectedProviderUnits = providerUnitData.value.filter(unit =>
      selectedIds.includes(unit.id)
    )

    doctor.value.provider_units = selectedProviderUnits;
    emit('update-table')
  }
  const updateSpecialists = v => {
    const selectedIds = v.specialist_ids || []
    const selectedSpecialists = specialistData.value.filter(spe =>
      selectedIds.includes(spe.id)
    )

    doctor.value.specialists = selectedSpecialists
    emit('update-table')

  }

  const handleEditName = async () => {
    editName.value = !editName.value;
    textButtonEditName.value = !editName.value ? 'Editar Nome' : 'Salvar Nome';
    if(editName.value) {
      await nextTick();
      nameInput.value?.focus();
    }
    if (!editName.value) {
      await submit();
    }
  };
  const schema = yup.object({
    name: yup.string().required('Nome da especialidade é obrigatório'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');

  const submit = handleSubmit(async values => {

    const doctorToUpdate = {
      name: values.name,
    };
    await showFeedback(() => update(doctor.value.id, doctorToUpdate))
    emit('update-table')

  });

  const submitProviderUnits = providerUnits => {
    const currentProviderUnitIds = doctor.value.provider_units?.map(p => p.id) || []
    providerUnits.provider_unit_ids.push(...currentProviderUnitIds)
    emit('save', providerUnits)
  }

  const submitSpecialists = specialists => {
    const currentSpecialistIds = doctor.value.specialists?.map(s => s.id) || []
    specialists.specialist_ids.push(...currentSpecialistIds)
    emit('save', specialists)
  }

  onMounted( async () => {
    updateLocalDoctor()
    providerUnitsParams.value.per_page = -1;
    specialistsParams.value.per_page = -1;
    await nextTick();
    providerUnitsFetch();
    specialistsFetch();
  });

  watch(
    () => props.modelValue,
    () => {
      updateLocalDoctor();
    },
    { deep: true });
</script>
