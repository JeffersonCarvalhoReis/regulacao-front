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
    <div ref="listRef" class="p-5 flex flex-col justify-between min-w-350">
      <div class="min-h-425">
        <div class="flex items-center w-full m-4 relative">
          <div class="absolute w-20">
            <img
              class="w-20"
              alt="Logo da prefeitura de itaguaçu da bahia"
              src="@/assets/images/brasao.svg"
            />
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center uppercase">
              Viagem para {{ props.data.city }}
            </div>
            <div class="text-center">
              <span class="uppercase">{{
                formatLongDate(props.data.date)
              }}</span>
              - {{ `${props.data.time}h` }}
            </div>
            <div class="text-center uppercase">
              Motorista: {{ props.data.driver }} - {{ props.data.vehicle }}
            </div>
          </div>
        </div>
        <div class="table m-4 mt-10 w-full">
          <div class="table-header-group bg-ita-blue text-white">
            <div class="table-cell text-center align-middle">Nº</div>
            <div class="table-cell text-left px-2 align-middle">Passageiro</div>
            <div class="table-cell text-left px-2 uppercase align-middle">
              Sus
            </div>
            <div class="table-cell text-left px-2 align-middle">Motivo</div>
            <div class="table-cell text-left px-2 align-middle">
              Instituição
            </div>
            <div class="table-cell text-left px-2 align-middle">
              Data da Consulta
            </div>
            <div class="table-cell text-left px-2 align-middle">
              Hora da Consulta
            </div>
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
                {{ row.type === "patient" ? row.cns : row.companion_cns }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{ row.type === "patient" ? row?.notes : "" }}
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
                {{ row.type === "patient" ? row.phone : row.companion_phone }}
              </div>
              <div
                class="table-cell border-r border-b p-2"
                :class="{ 'bg-slate-200': rowIndex % 2 === 1 }"
              >
                {{
                  row.type === "patient"
                    ? `${row.street} - ${row.neighborhood}`
                    : `${row.companion_street} - ${row.companion_neighborhood}`
                }}
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
});

const { exportToPDF, clickPrint } = useExportToPdf();
const { formatLongDate, formatDate } = useFormatDate();

const tableRows = computed(() => {
  const rows = [];
  const addedCompanions = new Set();

  (props.data?.patients || []).forEach((patient) => {
    // Paciente
    rows.push({
      __row_key: `${patient.id}-patient`,
      type: "patient",
      patient_id: patient.id,
      ...patient,
      __ts: makeTimestamp(patient.appointment_date, patient.appointment_time),
    });

    // Acompanhante principal
    if (patient.companion) {
      const cpf = patient.companion.cpf;

      if (
        !props.data.patients.some((p) => p.cpf === cpf) &&
        !addedCompanions.has(cpf)
      ) {
        addedCompanions.add(cpf);

        rows.push({
          __row_key: `${patient.id}-companion`,
          type: "companion",
          companion_name: patient.companion.name,
          companion_phone: patient.companion.phone,
          companion_cns: patient.companion.cns,
          companion_street: patient.companion.street,
          companion_neighborhood: patient.companion.neighborhood,
          hospital_name: patient.hospital_name,
          appointment_date: patient.appointment_date,
          appointment_time: patient.appointment_time,
          __ts: makeTimestamp(
            patient.appointment_date,
            patient.appointment_time,
          ),
        });
      }
    }

    // Acompanhantes extras
    (patient.extra_companions ?? []).forEach((extra, idx) => {
      const comp = extra.companion;

      if (!comp) return;

      if (
        !props.data.patients.some((p) => p.cpf === comp.cpf) &&
        !addedCompanions.has(comp.cpf)
      ) {
        addedCompanions.add(comp.cpf);

        rows.push({
          __row_key: `${patient.id}-extra-${comp.id ?? idx}`,
          type: "extra_companion",
          companion_name: comp.name,
          companion_phone: comp.phone,
          companion_cns: comp.cns,
          companion_street: comp.street,
          companion_neighborhood: comp.neighborhood,
          hospital_name: patient.hospital_name,
          appointment_date: patient.appointment_date,
          appointment_time: patient.appointment_time,
          __ts: makeTimestamp(
            patient.appointment_date,
            patient.appointment_time,
          ),
        });
      }
    });
  });

  // Standalone companions
  (props.data?.standalone_companions || []).forEach((companion) => {
    if (
      props.data.patients.some((p) => p.cpf === companion.companion_cpf) ||
      addedCompanions.has(companion.companion_cpf)
    ) {
      return;
    }

    addedCompanions.add(companion.companion_cpf);

    rows.push({
      __row_key: `standalone-${companion.id}`,
      type: "standalone_companion",
      companion_name: companion.companion_name,
      companion_phone: companion.companion_phone,
      companion_cns: companion.companion_cns,
      companion_street: companion.companion_street,
      companion_neighborhood: companion.companion_neighborhood,
      hospital_name: companion.hospital_name,
      appointment_date: companion.appointment_date,
      appointment_time: companion.appointment_time,
      __ts: makeTimestamp(
        companion.appointment_date,
        companion.appointment_time,
      ),
    });
  });

  rows.sort((a, b) => {
    const ta = Number.isFinite(a.__ts) ? a.__ts : Infinity;
    const tb = Number.isFinite(b.__ts) ? b.__ts : Infinity;
    return ta - tb;
  });

  return rows;
});
function makeTimestamp(dateVal, timeVal) {
  if (!dateVal) return NaN;

  // se já for Date
  if (dateVal instanceof Date && !Number.isNaN(dateVal)) {
    if (!timeVal) return dateVal.getTime();
    // concatena com tempo
    const hhmm = String(timeVal).trim();
    const iso = `${dateVal.toISOString().slice(0, 10)}T${hhmm}`;
    const d = new Date(iso);
    return Number.isFinite(d.getTime()) ? d.getTime() : NaN;
  }

  const dateStr = String(dateVal).trim();
  const timeStr = timeVal ? String(timeVal).trim() : "00:00";

  // tenta construir ISO: "YYYY-MM-DDTHH:mm:ss"
  // se o time tiver só HH:mm, ok.
  const isoCandidate = `${dateStr}T${timeStr}`;
  const d = new Date(isoCandidate);

  // fallback: se formato local diferente, tentar só date
  if (!Number.isFinite(d.getTime())) {
    const d2 = new Date(dateStr);
    return Number.isFinite(d2.getTime()) ? d2.getTime() : NaN;
  }
  return d.getTime();
}

const columns = [
  "Nº",
  "Passageiro",
  "SUS",
  "Motivo",
  "Instituição",
  "Data da Consulta",
  "Hora da Consulta",
  "Celular",
  "Endereço",
];
const travelInfo = {
  city: props.data.city,
  date: `${formatLongDate(props.data.date)} - ${props.data.time}h`,
  title: `Motorista: ${props.data.driver} - ${props.data.vehicle}`,
  signature: props.data.driver,
  signatureSubtitle: props.data.vehicle,
};
const fileInfo = {
  docX: 148,
  fileName: `Controle de Passageiros - ${formatLongDate(props.data.date)}`,
  orientation: "landscape",
};
const handleExportToPdf = () => {
  exportToPDF(columns, travelInfo, fileInfo);
};
const emit = defineEmits(["close"]);
</script>

<style scoped></style>
