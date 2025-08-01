<template>
  <BaseCard @close="emit('close')">
    <div class="mr-5 text-right">
      <BaseButtonRegister button-icon="mdi-printer" button-text="PDF" :loading="clickPrint" @register="handleExportToPdf" />
    </div>
    <div ref="listRef" class="p-5 flex flex-col justify-between min-w-350">
      <div class="min-h-[1700px]">
        <div class="flex items-center w-full m-4 relative">
          <div class="absolute w-20">
            <img alt="Logo da prefeitura de itaguaçu da bahia" src="@/assets/images/brasao.svg">
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center uppercase">Viagem para {{ props.data.city }}</div>
            <div class="text-center"> <span class="uppercase">{{ formatLongDate(props.data.date) }}</span>  - {{ `${props.data.time}h` }}</div>
            <div class="text-center uppercase">Motorista: {{ props.data.driver }} - {{ props.data.vehicle }}</div>
          </div>
        </div>
        <div class="table m-4 mt-10 w-full">
          <div class="table-header-group bg-ita-blue text-white">
            <div class="table-cell text-center align-middle">Nº</div>
            <div class="table-cell text-left px-2 align-middle">Passageiro</div>
            <div class="table-cell text-left px-2 uppercase align-middle">Sus</div>
            <div class="table-cell text-left px-2 align-middle">Motivo</div>
            <div class="table-cell text-left px-2 align-middle">Instituição</div>
            <div class="table-cell text-left px-2 align-middle">Data da Consulta</div>
            <div class="table-cell text-left px-2 align-middle">Hora da Consulta</div>
            <div class="table-cell text-left px-2 align-middle">Celular</div>
            <div class="table-cell text-left px-2 align-middle">Endereço</div>
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
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === 'patient' ? row.cns : row.companion_cns }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === 'patient' ? row?.notes : '' }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.hospital_name }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ formatDate(row.appointment_date) }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ formatDate(row.appointment_time) }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === 'patient' ? row.phone : row.companion_phone }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === 'patient' ? `${row.street} - ${row.neighborhood}`: `${row.companion_street} - ${row.companion_neighborhood}` }}
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-col justify-center items-center mt-10">
          <div class="text-center border-b-2 w-150" />
          <div class="text-center">{{ props.data.driver }}</div>
          <div class="text-center">{{ props.data.vehicle }}</div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
  const props = defineProps({
    data: { type: Object, requird: true },
  })

  const { exportToPDF, clickPrint } = useExportToPdf();
  const { formatLongDate, formatDate } = useFormatDate();

  const listRef = ref(null);

  const tableRows = computed(() => {
    const rows = [];
    props.data.patients.forEach(patient => {
      rows.push({ ...patient, type: 'patient' });
      if (patient.companion_name) {
        rows.push({ ...patient, type: 'companion' });
      }
    });
    return rows;
  })
  const columns = ['Nº', 'Passageiro', 'SUS', 'Motivo', 'Instituição', 'Data da Consulta', 'Hora da Consulta', 'Celular', 'Endereço']
  const travelInfo = {
    city: props.data.city,
    date: `${formatLongDate(props.data.date)} - ${props.data.time}h`,
    title: `Motorista: ${props.data.driver } - ${props.data.vehicle}`,
    signature:  props.data.driver,
    signatureSubtitle: props.data.vehicle,

  }
  const fileInfo = {
    docX: 148,
    fileName: `Controle de Passageiros - ${formatLongDate(props.data.date)}`,
    orientation: 'landscape',
  }
  const handleExportToPdf = () => {
    exportToPDF(columns, travelInfo, fileInfo);
  }
  const emit = defineEmits(['close'])
</script>

<style scoped>
</style>
