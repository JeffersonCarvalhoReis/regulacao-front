<template>
  <BaseCard title="Exportar BPA" @close="emit('close')">
    <div class="flex gap-4 p-4 flex-col">
      <div class="flex gap-4">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Mês"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
        />

        <v-select
          v-model="selectedYear"
          :items="years"
          label="Ano"
          variant="outlined"
          density="comfortable"
        />

        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!selectedMonth || !selectedYear"
          @click="handleExport"
        >
          Exportar
        </v-btn>
      </div>

      <v-alert
        v-if="errorMessage"
        type="warning"
        variant="tonal"
        closable
        @click:close="errorMessage = null"
      >
        {{ errorMessage }}
      </v-alert>
    </div>
  </BaseCard>
</template>

<script setup>
import { useBpaApi } from "@/composables/modules/useBpaModule";
import { computed, ref } from "vue";

const { exportBpa } = useBpaApi();
const emit = defineEmits(["close"]);

const selectedMonth = ref(null);
const selectedYear = ref(null);
const loading = ref(false);
const errorMessage = ref(null);

const months = [
  { label: "Janeiro", value: "01" },
  { label: "Fevereiro", value: "02" },
  { label: "Março", value: "03" },
  { label: "Abril", value: "04" },
  { label: "Maio", value: "05" },
  { label: "Junho", value: "06" },
  { label: "Julho", value: "07" },
  { label: "Agosto", value: "08" },
  { label: "Setembro", value: "09" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
];

const currentYear = new Date().getFullYear();

const years = computed(() => {
  const startYear = 2020;
  return Array.from(
    { length: currentYear + 1 - startYear + 1 },
    (_, i) => startYear + i,
  ).reverse();
});

async function handleExport() {
  errorMessage.value = null;
  loading.value = true;

  try {
    const competence = `${selectedYear.value}${selectedMonth.value}`;
    await exportBpa(competence);
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        errorMessage.value = json.message ?? "Erro ao exportar BPA.";
      } catch {
        errorMessage.value = "Erro ao exportar BPA.";
      }
    } else {
      errorMessage.value =
        error.response?.data?.message ?? "Erro ao exportar BPA.";
    }
  } finally {
    loading.value = false;
  }
}
</script>
