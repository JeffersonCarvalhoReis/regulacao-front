<template>
  <companion-table ref="companionTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerCompanion = true" />
      <v-badge color="error" :content="badgeCounter" v-if="badgeCounter > 0" >
       <base-button-filter @filters="dialogFilter = true"/>
      </v-badge>
      <base-button-filter v-else @filters="dialogFilter = true"/>
      <base-button-clear
        button-icon="mdi-filter-remove-outline"
        button-text="Limpar Filtros"
        @clear="clear"
      />
    </div>
  </companion-table>
  <v-dialog
    v-model="registerCompanion"
    class="z-999"
    transition="dialog-transition"
  >
    <companion-form @close="registerCompanion = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogFilter"
    class="z-999"
    transition="dialog-transition"
  >
    <companion-filters @close="dialogFilter = false" @filters="submitFilters" />
  </v-dialog>
</template>
<script setup>
  import { useCompanionApi } from '@/composables/modules/useCompanionModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { create } = useCompanionApi();
  const { showFeedback } = useSweetAlertFeedback();

  const companionTableRef = ref(null);
  const registerCompanion = ref(false)
  const clear = () => {
    companionTableRef.value?.clearFilters();
    companionTableRef.value?.refetch();
    badgeCounter.value = 0

  }

  const submit = async val => {
    const success = await showFeedback(() => create(val));
    if (success) {
      companionTableRef.value?.refetch();
      registerCompanion.value = false;
    }
  }
  //filters
  const dialogFilter = ref(false);
  const badgeCounter = ref(0);

  const countNotNullKeys = (obj) => {
  return Object.values(obj).filter(value => {
    if (Array.isArray(value)) {
      // Verifica se todo o array é nulo
      return value.some(item => item !== null);
    }
    return value !== null;
  }).length;
  };
  const submitFilters = async val => {
    companionTableRef.value?.setFilter('', val);
    badgeCounter.value = countNotNullKeys(val);
    companionTableRef.value?.refetch();
    dialogFilter.value = false
  }
</script>
