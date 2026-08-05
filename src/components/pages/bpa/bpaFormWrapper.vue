<template>
  <BaseCard
    :class="
      props.mode === 'single'
        ? 'max-w-262.5 min-w-262.5'
        : 'max-w-375 min-w-262.5'
    "
    title="Gerar BPA"
    @close="emit('close')"
  >
    <div class="flex justify-end gap-4 m-4" v-if="props.mode === 'single'">
      <v-btn
        color="success"
        :loading="clickPrint"
        prepend-icon="mdi-printer"
        @click="handleExportToPDF"
      >
        Imprimir
        <v-tooltip activator="parent">Imprimir</v-tooltip>
      </v-btn>
    </div>

    <template v-else>
      <div class="flex justify-end gap-4 m-4">
        <v-btn
          color="success"
          :loading="isGenerating"
          :disabled="isLoading"
          prepend-icon="mdi-file-pdf-box"
          @click="handleGenerateTablePDF"
        >
          Abrir PDF
          <v-tooltip activator="parent">
            Abrir PDF em tabela com todos os BPAs desta viagem
          </v-tooltip>
        </v-btn>
      </div>

      <div
        class="mx-4 mb-4 grid grid-cols-2 gap-x-6 gap-y-1 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"
        v-if="!isLoading"
      >
        <div>
          <strong>Estabelecimento:</strong>
          {{ reportData.establishment?.name ?? "-" }}
          &nbsp;|&nbsp;
          <strong>CNES:</strong> {{ reportData.establishment?.cnes ?? "-" }}
        </div>
        <div><strong>Mês/Ano:</strong> {{ reportData.competence || "-" }}</div>
        <div class="col-span-2">
          <strong>Profissional:</strong>
          {{ reportData.professional?.name ?? "-" }}
          &nbsp;|&nbsp;
          <strong>CNS:</strong> {{ reportData.professional?.cns ?? "-" }}
          &nbsp;|&nbsp;
          <strong>CBO:</strong> {{ reportData.professional?.cbo ?? "-" }}
        </div>
      </div>

      <div class="flex justify-center items-center py-10" v-if="isLoading">
        <v-progress-circular indeterminate color="primary" class="mr-3" />
        Carregando dados dos BPAs...
      </div>

      <div
        class="mx-4 mb-4 overflow-x-auto rounded-md border border-gray-300"
        v-else
      >
        <table class="w-full min-w-350 border-collapse text-xs">
          <thead>
            <tr class="bg-blue-800 text-white uppercase">
              <th class="border border-gray-400 p-2 text-left">Tipo</th>
              <th class="border border-gray-400 p-2 text-left">Nome</th>
              <th class="border border-gray-400 p-2 text-left">CNS</th>
              <th class="border border-gray-400 p-2 text-left">Nascimento</th>
              <th class="border border-gray-400 p-2 text-left">Sexo</th>
              <th class="border border-gray-400 p-2 text-left">Raça/Cor</th>
              <th class="border border-gray-400 p-2 text-left">Endereço</th>
              <th class="border border-gray-400 p-2 text-left">Telefone</th>
              <th class="border border-gray-400 p-2 text-left">Procedimento</th>
              <th class="border border-gray-400 p-2 text-left">Código</th>
              <th class="border border-gray-400 p-2 text-left">Data Atend.</th>
              <th class="border border-gray-400 p-2 text-left">Qtde.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!reportData.rows.length">
              <td class="border border-gray-400 p-2 text-center" colspan="12">
                Nenhum dado encontrado.
              </td>
            </tr>
            <tr
              v-for="(row, index) in reportData.rows"
              :key="index"
              :class="row.personIndex % 2 === 1 ? 'bg-blue-50' : 'bg-white'"
            >
              <template v-if="row.isFirstOfPerson">
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.type }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top font-medium"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.name }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.cns }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.birthDate }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.gender }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.race }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.address }}
                </td>
                <td
                  class="border border-gray-400 p-2 align-top"
                  :rowspan="row.personRowSpan"
                >
                  {{ row.phone }}
                </td>
              </template>
              <td class="border border-gray-400 p-2">{{ row.procedure }}</td>
              <td class="border border-gray-400 p-2">{{ row.code }}</td>
              <td class="border border-gray-400 p-2">{{ row.date }}</td>
              <td class="border border-gray-400 p-2">{{ row.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="mx-4 mb-2 text-xs text-gray-600"
        v-if="!isLoading && reportData.rows.length"
      >
        Total de pessoas: {{ totalPeople }} &nbsp;|&nbsp; Total de registros:
        {{ reportData.rows.length }}
      </div>
    </template>

    <div class="mx-auto" v-if="props.mode === 'single'">
      <div ref="printSection" class="text-blue-900">
        <BpaForm :model-value="props.modelValue" :travel-id="props.travelId" />
      </div>
    </div>
  </BaseCard>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useBpaTablePdf } from "@/composables/utils/useBpaTablePdf";

const props = defineProps({
  modelValue: { type: [Object, Array], default: () => ({}) },
  travelId: { type: [String, Number], default: "" },
  mode: { type: String, default: "single" },
});

const emit = defineEmits(["close"]);

const { exportToImagePDF, clickPrint } = useExportToPdf();
const { loadReportData, renderPdf, isLoading, isGenerating } = useBpaTablePdf();
const { showFeedbackLoading } = useSweetAlertFeedback();

const printSection = ref(null);

const times = 1;
const pages = ref(1);
const topMargin = 10;
const pixelRatio = 1.2;

const reportData = ref({
  rows: [],
  people: [],
  establishment: null,
  professional: null,
  competence: "",
});

const totalPeople = computed(
  () => new Set(reportData.value.rows.map((row) => row.personIndex)).size,
);

onMounted(async () => {
  if (props.mode !== "single") {
    reportData.value = await loadReportData(props.modelValue, props.travelId);
    return;
  }

  if (props.modelValue.extra_companions?.length) {
    pages.value = 2;
  }
});

async function handleExportToPDF() {
  await showFeedbackLoading(() =>
    exportToImagePDF(
      printSection.value,
      times,
      pages.value,
      topMargin,
      pixelRatio,
    ),
  );
}

function handleGenerateTablePDF() {
  renderPdf(reportData.value);
}
</script>
