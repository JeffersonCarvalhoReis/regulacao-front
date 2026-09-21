<template>
  <div>
    <patient-search @search-patient="search">
      <v-select
        v-model="selectedYear"
        clearable
        hide-details
        density="compact"
        :items="years"
        label="Ano do Falecimento"
        style="max-width: 220px"
        variant="outlined"
        @click:clear="clearYear"
        @update:model-value="filterByYear"
      />
    </patient-search>
    <div class="flex items-center justify-end gap-2 p-2 flex-wrap">
      <v-btn
        class="bg-ita-green hover:bg-green-600 text-white"
        prepend-icon="mdi-microsoft-excel"
        @click="handleExportDeceased"
      >
        Exportar Planilha
      </v-btn>
    </div>
    <base-table
      class="rounted-t-none"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @update-options="updateOptions"
    >
      <template #item.birth_date="{ item }">
        {{ formatDate(item.birth_date) }}
      </template>
      <template #item.date_of_dead="{ item }">
        {{ formatDate(item.date_of_dead) }}
      </template>
    </base-table>
  </div>
</template>

<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useDeceasedExportApi } from "@/composables/modules/useDeceasedExportModule";
import { usePatientApi } from "@/composables/modules/usePatientModule";
import debounce from "lodash/debounce";

const props = defineProps({
  edit: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
});
const {
  data,
  loadingList,
  refetch,
  setTableOptions,
  meta,
  setFilter,
  clearFilters,
} = usePatientApi();
const {
  setFilter: filterExport,
  exportDeceased,
  clearFilters: clearFiltersExport,
} = useDeceasedExportApi();
const { showFeedbackLoading } = useSweetAlertFeedback();
const { formatDate } = useFormatDate();

const options = ref({});
const selectedYear = ref(null);

const currentYear = new Date().getFullYear();
const years = computed(() => {
  const startYear = 2000;
  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i,
  );
});

const updateOptions = (newOptions) => {
  options.value = { ...newOptions };
};

const search = debounce(async (v) => {
  setFilter("search", v);
  filterExport("search", v);
  await nextTick();
  refetch();
}, 500);

const filterByYear = async (year) => {
  setFilter("date_of_dead_year", year);
  filterExport("date_of_dead_year", year);
  await nextTick();
  refetch();
};

const clearYear = async () => {
  selectedYear.value = null;
  await filterByYear(null);
};

const handleExportDeceased = async () => {
  await showFeedbackLoading(() => exportDeceased());
};

watch(
  () => options.value,
  async (newOptions) => {
    await nextTick();
    setTableOptions(newOptions);
    setFilter("is_deceased", 1);
    filterExport("is_deceased", 1);
    refetch();
  },
  { deep: true },
);

const headers = computed(() => {
  const baseHeaders = [
    {
      title: "Paciente",
      key: "name",
      sortable: true,
      align: "center",
    },
    {
      title: "CNS",
      key: "cns",
      sortable: true,
      align: "center",
    },

    {
      title: "Data de Nascimento",
      key: "birth_date",
      sortable: true,
      align: "center",
    },
    {
      title: "Data de Falecimento",
      key: "date_of_dead",
      sortable: true,
      align: "center",
    },
    {
      title: "Unidade",
      key: "health_unit",
      sortable: true,
      align: "center",
    },
    {
      title: "Localidade",
      key: "neighborhood",
      sortable: true,
      align: "center",
    },
  ];
  if (props.edit || props.showDelete) {
    baseHeaders.push({
      title: "Ações",
      value: "action",
      align: "center",
      width: "100px",
      maxWidth: "100px",
    });
  }
  return baseHeaders;
});

defineExpose({
  setFilter,
  refetch,
  clearFilters,
  clearFiltersExport,
});
</script>
