<template>
  <BaseCard @close="emit('close')">
    <div class="mr-5 text-right">
      <BaseButtonRegister
        button-icon="mdi-printer"
        button-text="PDF"
        :loading="clickPrint"
        @register="handleExportToPdf"
      />
    </div>
    <div ref="listRef" class="p-5 flex flex-col justify-between min-w-320">
      <div class="min-h-[1700px]">
        <div class="flex items-center w-full m-4 relative">
          <div class="absolute w-20">
            <img
              alt="Logo da prefeitura de itaguaçu da bahia"
              src="@/assets/images/brasao.svg"
            />
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center uppercase">
              Viagem Itaguaçu da Bahia x {{ props.data.city }}
            </div>
            <div class="text-center uppercase">
              {{ formatLongDate(props.data.date) }}
            </div>
            <div class="text-center">Controle de Embarque</div>
          </div>
        </div>
        <div class="table m-4 mt-10 w-full">
          <div class="table-header-group bg-ita-blue text-white">
            <div class="table-cell text-center">Nº</div>
            <div class="table-cell text-left px-2">Passageiro</div>
            <div class="table-cell text-left px-2">Celular</div>
            <div class="table-cell text-left px-2">Presença</div>
          </div>
          <template v-for="(row, rowIndex) in tableRows" :key="rowIndex">
            <div class="table-row">
              <div
                class="table-cell border-x border-b text-center"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ rowIndex + 1 }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{
                  row.type === "patient"
                    ? row.name + " - Paciente"
                    : row.companion_name + " - Acompanhante"
                }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === "patient" ? row.phone : row.companion_phone }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                <span>Sim( )</span>
                <span class="ml-5">Não( )</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center mt-10">
        <div class="text-center border-b-2 w-150" />
        <div class="text-center">{{ props.data.driver }}</div>
        <div class="text-center">{{ props.data.vehicle }}</div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, requird: true },
});

const { exportToPDF, clickPrint } = useExportToPdf();
const { formatLongDate } = useFormatDate();

const listRef = ref(null);

const tableRows = computed(() => {
  const rows = [];

  (props.data?.patients || []).forEach((patient) => {
    rows.push({
      __row_key: `${patient.id}-patient`,
      type: "patient",
      patient_id: patient.id,
      ...patient,
    });

    if (patient.companion) {
      if (props.data.patients.some((p) => p.cpf == patient.companion.cpf)) {
        return;
      }

      rows.push({
        __row_key: `${patient.id}-companion`,
        type: "companion",
        companion_name: patient.companion?.name ?? null,
        companion_phone: patient.companion?.phone ?? null,
      });
    }
    if (
      props.data.patients.some((p) => p.cpf == patient.companion?.cpf) ||
      props.data.patients.some(
        (p) =>
          p.extra_companions?.[0]?.companion?.cpf == patient.companion?.cpf,
      )
    ) {
      return;
    }
    const extras = patient.extra_companions ?? [];
    extras.forEach((extra, idx) => {
      const comp = extra?.companion ?? {};
      const compId = comp?.id ?? `extra-${patient.id}-${idx}`;

      rows.push({
        __row_key: `${patient.id}-extra-${compId}`,
        type: "extra_companion",
        companion_name: comp?.name ?? null,
        companion_phone: comp?.phone ?? null,
      });
    });
  });

  return rows;
});

const columns = ["Nº", "Passageiro", "Celular", "Presença"];
const travelInfo = {
  city: props.data.city,
  date: formatLongDate(props.data.date),
  title: "Controle de Embarque",
  signature: props.data.driver,
  signatureSubtitle: props.data.vehicle,
};
const fileInfo = {
  docX: 105,
  fileName: `Controle de Embarque - ${formatLongDate(props.data.date)} - ${props.data.city}`,
  orientation: "portrait",
};
const handleExportToPdf = () => {
  exportToPDF(columns, travelInfo, fileInfo);
};
const emit = defineEmits(["close"]);
</script>

<style scoped></style>
