<template>
  <BaseCard
    class="max-w-[1050px] min-w-[1050px]"
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
    <div class="mx-auto">
      <div ref="printSection" class="text-blue-900">
        <BpaForm
          v-if="props.mode === 'single'"
          :model-value="props.modelValue"
          :travel-id="props.travelId"
        />
        <div v-else>
          <BpaForm
            v-for="(passenger, index) in props.modelValue"
            :key="index"
            :model-value="passenger"
            :travel-id="props.travelId"
            :current-page="index + 1"
            :mode="props.mode"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  travelId: { type: [String, Number], default: "" },
  mode: { type: String, default: "single" },
});

const emit = defineEmits(["close"]);

const { exportToImagePDF, clickPrint } = useExportToPdf();
const { showFeedbackLoading } = useSweetAlertFeedback();

const printSection = ref(null);

const times = 1;
const pages = ref(1);
const topMargin = 10;
const pixelRatio = 1.2;

onMounted(() => {
  if (props.mode !== "single") {
    pages.value = props.modelValue.reduce((total, patient) => {
      const extraCount = patient.extra_companions?.length ?? 0;

      return total + 1 + extraCount;
    }, 0);
  } else if (props.modelValue.extra_companions?.length) {
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
</script>
