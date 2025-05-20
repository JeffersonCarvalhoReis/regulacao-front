<template>
  <BaseCard @close="emit('close')" title="Profissionais Cadastrados">
    <div class="text-right m-4">
        <base-button-register
        button-text="Novo Profissional"
        @register="dialogNewbBpaDoctor = true"
      />
    </div>
     <base-table
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :total-items="meta.total"
      :show-delete="false"
      @delete-item="handleDelete"
      @update-options="updateOptions"
      @edit-item="handleEdit"
    />
  </BaseCard>
  <v-dialog
    v-model="dialogNewbBpaDoctor"
    class="z-999"
  >
    <BpaSettingForm @close="dialogNewbBpaDoctor = false" :model-value="selectedDoctor" @save="submitNewDoctor" @update="submitUpdateDoctor"/>
  </v-dialog>
</template>

<script setup>
import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
import { useBpaDoctorApi } from '@/composables/modules/useBpaDoctor';

const emit = defineEmits(['close', 'update'])

const { data, refetch, loadingList, meta, create, update } = useBpaDoctorApi();
const { showFeedback } = useSweetAlertFeedback();

const dialogNewbBpaDoctor = ref(false);
const selectedDoctor = ref(null)

const submitNewDoctor = async (v) => {
  await showFeedback(() => create(v));
  refetch();
  dialogNewbBpaDoctor.value = false;
  emit('update')
};
const submitUpdateDoctor = async (v) => {
  await showFeedback(() => update(v.id, v));
  refetch();
  dialogNewbBpaDoctor.value = false;
  emit('update')
};

const handleEdit = (v) => {
  selectedDoctor.value = v;
  dialogNewbBpaDoctor.value = true
}

onMounted(() => {
  refetch();
});

const headers = [
  {
    title: 'Nome',
    value: 'name',
    align: 'center',
  },
  {
    title: 'CNS',
    value: 'cns',
    align: 'center',
  },
   {
    title: 'CBO',
    value: 'cbo',
    align: 'center',
  },
  {
    title: 'Ações',
    value: 'action',
    width: '200px',
    align: 'center',
  }
]
</script>

<style lang="scss" scoped>

</style>
