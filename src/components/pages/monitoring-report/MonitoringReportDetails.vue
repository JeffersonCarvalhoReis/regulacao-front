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
      <div ref="printSection" class="bg-white w-7xl text-2xl">
        <div class="grid grid-cols-6 gap-4">
          <div class="col-span-6 border-2 grid grid-cols-12">
            <div class="col-span-2 border-r-2 flex items-center justify-center">
              <img
                alt="Descrição"
                class="h-full w-auto object-contain"
                src="../../../assets/images/sesab-sus.png"
              />
            </div>
            <div class="col-span-8 text-center p-4">
              <span class="font-bold"
                >SECRETARIA DA SAÚDE DO ESTADO DA BAHIA <br
              /></span>
              PREFEITURA MUNICIPAL DE ITAGUAÇU DA BAHIA <br />
              TRATAMENTO FORA DO DOMICÍLIO <br />
              RELATÓRIO DE ACOMPANHAMENTO
            </div>
            <div class="col-span-2 border-l-2 text-center p-4">
              <span class="font-bold">
                21ª DIRES <br />
                T.F.D. <br />
              </span>
              (74) 3641-3011
            </div>
          </div>
        </div>
        <div class="border-2 my-2 uppercase grid grid-cols-12 h-30">
          <div class="col-span-4 border-r-2 p-2 break-words overflow-hidden">
            Nome da Unidade <br />
            {{ props.monitoringReportData.unit_name }}
          </div>
          <div class="col-span-3 border-r-2 p-2">Cód. da Unidade</div>
          <div class="col-span-5 p-2">Clínica</div>
        </div>
        <div class="grid grid-cols-6 border-2 my-2">
          <div class="col-span-6 border-b border-black text-center p-2">
            <h2 class="font-bold text-2xl uppercase">Paciente</h2>
          </div>
          <div class="col-span-3 border-b border-r border-black p-1 pb-5">
            <span class="uppercase"
              >Nome: {{ props.monitoringReportData.patient_name }}
            </span>
          </div>
          <div class="col-span-2 border-b border-r border-black p-1 pb-5">
            <span class="uppercase"
              >SUS: {{ props.monitoringReportData.patient_cns }}</span
            >
          </div>
          <div class="col-span-1 border-b border-black p-1 pb-5">
            <span>TFD nº: </span>
          </div>
          <div class="col-span-6 border-b border-black p-1 pb-5">
            <span class="uppercase"
              >Endereço: {{ props.monitoringReportData.patient_street }} -
              {{ props.monitoringReportData.patient_neighborhood }}
            </span>
            <br />
          </div>
          <div class="col-span-4 border-b border-r border-black p-1 pb-5">
            <span class="uppercase">Procedência: </span>
            <br />
          </div>
          <div class="col-span-2 border-b border-black p-1 pb-5">
            <span class="uppercase"
              >Telefone: {{ props.monitoringReportData.patient_phone }}
            </span>
            <br />
          </div>
          <div class="col-span-6 border-b border-black text-center p-2">
            <h2 class="font-bold text-2xl uppercase">Acompanhante</h2>
          </div>
          <div class="col-span-3 border-b border-r border-black p-1 pb-5">
            <span class="uppercase"
              >Nome: {{ props.monitoringReportData.companion_name }}
            </span>
          </div>
          <div class="col-span-2 border-b border-r border-black p-1 pb-5">
            <span class="uppercase"
              >SUS: {{ props.monitoringReportData.companion_cns }}</span
            >
          </div>
          <div class="col-span-1 border-b border-black p-1 pb-5">
            <span>TFD nº: </span>
          </div>
          <div class="col-span-6 border-b border-black p-1 pb-5">
            <span class="uppercase"
              >Endereço: {{ props.monitoringReportData.companion_street }} -
              {{ props.monitoringReportData.companion_neighborhood }}</span
            >
            <br />
          </div>
          <div class="col-span-4 border-b border-r p-1 pb-5">
            <span class="uppercase">Procedência: </span>
            <br />
          </div>
          <div class="col-span-2 border-b p-1 pb-5">
            <span class="uppercase"
              >Telefone: {{ props.monitoringReportData.companion_phone }}</span
            >
            <br />
          </div>
        </div>

        <div
          class="grid grid-cols-12 border border-black text-center uppercase my-2"
        >
          <!-- Cabeçalho -->
          <div class="col-span-4 border border-black p-2">
            Tratamento ou Procedimento Realizado
          </div>

          <div class="col-span-2 border border-black p-2">
            Data da Realização
          </div>

          <div class="col-span-2 border border-black p-2">Data de Retorno</div>

          <div class="col-span-4 border border-black p-2">
            Carimbo e assinatura do médico ou responsável pela Unidade
          </div>

          <!-- Linhas vazias -->
          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>

          <div class="col-span-4 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-2 h-14 border border-black"></div>
          <div class="col-span-4 h-14 border border-black"></div>
        </div>
        <div class="text-center uppercase font-bold text-2xl">
          Prefeitura Municipal de Itaguaçu da Bahia/BA <br />
          Secretaria Municipal de Saúde
        </div>
      </div>
    </v-card-text>
  </base-card>
</template>

<script setup>
const props = defineProps({
  monitoringReportData: { type: Object, default: () => ({}) },
});

const { exportToImagePDF, clickPrint } = useExportToPdf();

const emit = defineEmits(["close"]);
const title = "RELATÓRIO DE ACOMPANHAMENTO";
const printSection = ref(null);

const handleExportToPDF = () => {
  exportToImagePDF(printSection.value);
};
</script>
