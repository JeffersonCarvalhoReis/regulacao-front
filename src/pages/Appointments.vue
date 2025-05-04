<template>
  <appointment-table ref="appointmentTableRef" :edit="true" :show-delete="true">
    <div class="flex gap-2">
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
  </appointment-table>
  <v-dialog
    v-model="dialogFilter"
    class="z-999"
    transition="dialog-transition"
  >
    <appointment-filters @close="dialogFilter = false" @filters="submitFilters" />
  </v-dialog>
</template>
<script setup>

  const appointmentTableRef = ref(null);
  const clear = () => {
    appointmentTableRef.value?.clearFiltersTab();
    appointmentTableRef.value?.refetch();
    badgeCounter.value = 0
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
    appointmentTableRef.value?.setFilter('', val);
    badgeCounter.value = countNotNullKeys(val);

    appointmentTableRef.value?.refetch();
    dialogFilter.value = false
  }
</script>
