<template>
  <base-card :title="title" @close="emit('close')">
    <div class="flex justify-end gap-4 m-4">
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
    <v-card-text>
      <div ref="printSection" class="bg-white w-7xl text-lg">
        <div class="grid grid-cols-6 gap-4">
          <div class="col-span-3 border-2 grid grid-cols-12 h-40 p-2">
            <div class="col-span-5 flex items-center justify-center">
              <img
                alt="Descrição"
                class="h-full w-auto object-contain"
                src="../../../assets/images/logo-gestao.png"
              />
            </div>
            <div class="col-span-7 flex flex-col pl-4">
              <span class="uppercase font-bold">Estado da Bahia</span>
              <span class="uppercase font-bold">Prefeitura Municipal</span>
              <span class="uppercase font-bold"
                >Hospital Municipal Amélia Carvalho</span
              >
              <span class="uppercase">Secretaria Municipal de Saúde</span>
            </div>
          </div>
          <div class="col-span-2 flex items-center border-2 text-center px-4">
            <span class="uppercase font-bold text-2xl">
              Laudo Médico de Tratamento Fora de Domicílio <br />
              LM - TFD
            </span>
          </div>
          <div class="col-span-1 border-2 p-1">
            <span class="uppercase font-bold"> Pedido Nº <br /> </span>
          </div>
        </div>
        <div class="border-2 my-2 p-1 pb-5 uppercase"><span>Unidade</span></div>
        <div class="grid grid-cols-6 border-2 my-2">
          <div class="col-span-6 border-b border-black text-center p-2">
            <h2 class="font-bold text-2xl uppercase">Paciente</h2>
          </div>
          <div class="col-span-3 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">Nome: </span>
            {{ medicalReportData.patient.name }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5">
            <span class="uppercase">Doc. Identidade: </span>
            {{ medicalReportData.patient.cpf }}
          </div>
          <div class="col-span-6 border-b border-black p-1 pb-5">
            <span class="uppercase">Residência: </span>
            {{ medicalReportData.patient.street }} -
            {{ medicalReportData.patient.neighborhood }}
          </div>
          <div class="col-span-2 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">Relação de dependência</span>
            <br />
            {{ medicalReportData.patient_dependency_relation }}
          </div>
          <div class="col-span-2 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">Profissão</span>
            <br />
            {{ medicalReportData.patient_profession }}
          </div>
          <div class="col-span-2 border-b border-black p-1 pb-5">
            <span class="uppercase">Data de Nascimento</span>
            <br />
            {{ formatDate(medicalReportData.patient.birth_date) }}
          </div>
          <div class="col-span-6 border-b border-black text-center p-2">
            <h2 class="font-bold text-2xl uppercase">Acompanhante</h2>
          </div>
          <div class="col-span-3 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">Nome: </span>
            {{ medicalReportData.companion?.name }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5">
            <span class="uppercase">Doc. Identidade: </span>
            {{ medicalReportData.companion?.cpf }}
          </div>
          <div class="col-span-3 border-r border-black p-1 pb-5">
            <span class="uppercase">Residência: </span>
            {{ medicalReportData.companion?.street }} -
            {{ medicalReportData.companion?.neighborhood }}
          </div>
          <div class="col-span-3 border-black p-1 pb-5">
            <span class="uppercase">Relação c/ o paciente: </span>
            {{ medicalReportData.companion_relation_to_patient }}
          </div>
        </div>

        <div class="grid grid-cols-3 border-2 my-2">
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">1 - Histórico da doença atual</span>
            <br />
            {{ medicalReportData.history_of_present_illness }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">1 - Exame físico</span>
            <br />
            {{ medicalReportData.physical_exam }}
          </div>
          <div class="col-span-2 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">- Diagnóstico provável</span>
            <br />
            {{ medicalReportData.probable_diagnosis }}
          </div>
          <div class="col-span-1 border-b border-black p-1 pb-5">
            <span class="uppercase">- CID</span>
            <br />
            {{ medicalReportData.icd_code }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase"
              >- Exame(s) complementar(es) realizado(s) - anexar cópias</span
            >
            <br />
            {{ medicalReportData.complementary_exams }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">- Tratamento(s) realizado(s)</span>
            <br />
            {{ medicalReportData.treatments_performed }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">- Tratamento/Exame indicado</span>
            <br />
            {{ medicalReportData.indicated_treatments_or_exams }}
          </div>
          <div class="col-span-3 border-black p-1 pb-5 h-20">
            <span class="uppercase">- Duração provável do tratamento</span>
            <br />
            {{ medicalReportData.probable_treatment_duration }}
          </div>
        </div>
        <div class="page-break" />
        <div class="border-2 flex justify-center align-center p-10 my-2 h-30">
          <span class="font-bold text-2xl uppercase">Laudo Médico - TFD</span>
        </div>
        <div class="border-2">
          <div class="col-span-3 border-b border-black p-1 pb-5 h-55">
            <span class="uppercase"
              >- Justificar as razões que impossibilitam a realização do
              tratamento/exame na localidade</span
            >
            <br />
            {{ medicalReportData.reason_cannot_perform_locally }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-55">
            <span class="uppercase"
              >- Justificar em caso de necessidade de encaminhamento
              urgente</span
            >
            <br />
            {{ medicalReportData.reason_urgent_referral }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-55">
            <span class="uppercase"
              >- Justificar em caso de necessidade de acompanhamento</span
            >
            <br />
            {{ medicalReportData.reason_need_followup }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">- Transporte recomendável</span>
            <br />
            {{ medicalReportData.recommended_transport }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-50">
            <span class="uppercase">- Justificar</span>
            <br />
            {{ medicalReportData.transport_justification }}
          </div>
          <div class="col-span-3 border-b border-black p-1 pb-5 h-55">
            <span class="uppercase">- Outras anotações</span>
            <br />
            {{ medicalReportData.other_notes }}
          </div>
          <div
            class="col-span-3 flex justify-around items-end border-b border-black gap-x-20 p-1 pb-5 h-50"
          >
            <span
              class="uppercase border-t border-black w-full text-center ml-1"
              >Local e data</span
            >
            <span
              class="uppercase border-t border-black w-full text-center mr-1"
              >Médico assistente -- Junta médica-carimbo - CRM</span
            >
          </div>
          <div
            class="col-span-3 flex flex-col justify-between border-b-2 border-black p-1 pb-5 h-50"
          >
            <span class="uppercase"
              >Parecer da secretaria municipal de saúde</span
            >

            <div class="flex justify-around items-end gap-x-20 text-center">
              <span class="uppercase border-t border-black w-full ml-1"
                >Local e data</span
              >
              <span class="uppercase border-t border-black w-full mr-1"
                >Ass. carimbo - Matrícula - Cadastro</span
              >
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </base-card>
</template>

<script setup>
const props = defineProps({
  medicalReportData: { type: Object, default: () => ({}) },
});

const { formatDate } = useFormatDate();
const { exportToImagePDF, clickPrint } = useExportToPdf();

const emit = defineEmits(["close"]);
const title = "LAUDO MÉDICO";
const printSection = ref(null);
const times = 1;
const pages = 2;
const topMargin = 10;
const extraPageSize = 2000;

const handleExportToPDF = () => {
  exportToImagePDF(printSection.value, times, pages, topMargin, extraPageSize);
};
</script>
