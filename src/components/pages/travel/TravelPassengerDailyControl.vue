<template>
  <BaseCard @close="$emit('close')">
    <div class="mr-5 text-right">
      <BaseButtonRegister button-text="PDF"  button-icon="mdi-printer" :loading="clickPrint" @register="handleExportToPdf"/>
    </div>
    <div ref="listRef" class="p-5 flex flex-col justify-between min-w-320">
      <div class="min-h-[1700px]">
        <div class="flex items-center w-full m-4 relative">
          <div class="absolute w-20">
            <img src="@/assets/images/brasao.svg" alt="Logo da prefeitura de itaguaçu da bahia">
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center uppercase">Viagem Itaguaçu da Bahia x {{ props.data.city }}</div>
            <div class="text-center uppercase"> {{ formatLongDate(props.data.date) }}</div>
            <div class="text-center">Controle de Diárias</div>
          </div>
        </div>
          <div class="table m-4 mt-10 w-full">
            <div class="table-header-group  bg-ita-blue text-white">
              <div class="table-cell text-center">Nº</div>
              <div class="table-cell text-left px-2">Passageiro</div>
              <div class="table-cell text-left px-2">Entrada</div>
              <div class="table-cell text-left px-2">Saída</div>
              <div class="table-cell text-left px-2">Quantidade de Diárias</div>
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
                {{ row.type === 'patient' ? row.name + ' - Paciente' : row.companion_name + ' - Acompanhante' }}
              </div>
              <div
                class="table-cell border-r border-b p-2 w-1/5"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >

              </div>
              <div
                class="table-cell border-r border-b p-2 w-1/5"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >

              </div>
              <div
                class="table-cell border-r border-b p-2 w-1/5"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >

              </div>
            </div>
          </template>
      </div>
      </div>
        <div class="flex flex-col justify-center items-center mt-10">
          <div class="text-center border-b-2 w-150"></div>
          <div class="text-center uppercase">JANDANETA ALVES FERREIRA</div>
          <div class="text-center uppercase">Coordenação</div>
        </div>
    </div>
  </BaseCard>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, requird: true}
})

const { exportToPDF, clickPrint} = useExportToPdf();
const { formatLongDate } = useFormatDate();

const listRef = ref(null);

const tableRows = computed(() => {
   let rows = [];
    props.data.patients.forEach((patient, index) => {
      rows.push({ ...patient, type: 'patient' });
      if (patient.companion_name) {
        rows.push({ ...patient, type: 'companion' });
      }
    });
    return rows;
})
const columns = ['Nº', 'Passageiro', 'Entrada', 'Saída', 'Quantidade de Diárias'];
const travelInfo = {
  city: props.data.city,
  date: formatLongDate(props.data.date),
  title: 'Controle de Diárias',
  signature:  'JANDANETA ALVES FERREIRA',
  signatureSubtitle: 'Coordenação'
}
const fileInfo = {
  docX: 105,
  fileName: `Controle de Diárias - ${formatLongDate(props.data.date)} - ${props.data.city}`,
  orientation: 'portrait'
}
const handleExportToPdf = () => {
  exportToPDF(columns, travelInfo, fileInfo);
}
</script>

<style scoped>
</style>
