<template>
  <solicitation-table ref="solicitationTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
      <base-button-register @register="registerSolicitation = true" />
      <v-badge color="error" :content="badgeCounter" v-if="badgeCounter > 0" >
      <v-btn
        class="bg-emerald-600 hover:bg-emerald-700 text-white"
        prepend-icon="mdi-filter-variant"
        @click="dialogFilter = true"
      >
        Filtros
      </v-btn>
    </v-badge>
      <v-btn
          v-else
          class="bg-emerald-600 hover:bg-emerald-700 text-white"
          prepend-icon="mdi-filter-variant"
          @click="dialogFilter = true"
        >
          Filtros
      </v-btn>
      <base-button-clear
        button-icon="mdi-filter-remove-outline"
        button-text="Limpar Filtros"
        @clear="clear"
      />
    </div>
  </solicitation-table>
  <v-dialog
    v-model="registerSolicitation"
    class="z-999"
    transition="dialog-transition"
  >
    <solicitation-form @close="registerSolicitation = false" @save="submit" />
  </v-dialog>
  <v-dialog
    v-model="dialogFilter"
    class="z-999"
    transition="dialog-transition"
  >
    <solicitation-filters @close="dialogFilter = false" @filters="submitFilters" />
  </v-dialog>
</template>
<script setup>
  import { useSolicitationApi } from '@/composables/modules/useSolicitationModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';

  const { createWithAttachment } = useSolicitationApi();
  const { showFeedback } = useSweetAlertFeedback();

  const solicitationTableRef = ref(null);
  const registerSolicitation = ref(false)
  const clear = () => {
    solicitationTableRef.value?.clearFiltersTab();
    solicitationTableRef.value?.refetch();
    badgeCounter.value = 0
  }

  const submit = async val => {
    const success = await showFeedback(() => createWithAttachment(val));
    if (success) {
      solicitationTableRef.value?.refetch();
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
    solicitationTableRef.value?.setFilter('', val);
    badgeCounter.value = countNotNullKeys(val);

    solicitationTableRef.value?.refetch();
    dialogFilter.value = false
  }
</script>
