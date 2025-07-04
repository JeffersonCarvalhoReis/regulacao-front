<template>
  <BaseCard @close="emit('close')" title="Comanda">
      <v-card-text>
        <div class="flex justify-end gap-4 m-4">
          <v-btn
            prepend-icon="mdi-printer"
            color="success"
            :loading="clickPrint"
            @click="handleExportToPDF"
          >
            Imprimir
            <v-tooltip activator="parent">Imprimir</v-tooltip>
          </v-btn>
        </div>
      <div class="flex justify-center">
        <div class="max-w-256" ref="printSection">
          <div class="flex justify-center gap-4">
            <div class="max-w-46">
              <img src="/src/assets/images/logo-gestao.png" alt="logo prefeitura itaguaçu">
            </div>
            <div class="text-center font-bold">
              <h1 class="text-xl uppercase">Prefeitura Municipal de Itaguaçu da Bahia</h1>
              <h2 class="text-xl uppercase">Secretaria Municipal de Saúde</h2>
            </div>
            <div class="max-w-46">
              <img src="/src/assets//images/logo-saude.png" alt="logo da secretaria de saúde">
            </div>
          </div>
          <div class="text-center mb-8">
            <h3 class="text-xl uppercase">Autorização de Hospedagem</h3>
          </div>
          <div class="flex flex-col gap-2">
              <LabeledLineGroup>
                <LabeledLine label="Nome do Paciente" :value="patientData.name"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Nome do Acompanhante" :value="patientData.companion_name"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Endereço" :value="patientData.street"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Bairro" :value="patientData.neighborhood"/>
                <LabeledLine label="Cidade" value="Itaguaçu da Bahia"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Hospital" :value="patientData.hospital_name"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Motivo do Tratamento" :value="patientData.notes"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="CPF" :value="patientData.cpf"/>
                <LabeledLine label="SUS" :value="patientData.cns"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
                <LabeledLine label="Data da Entrada" :value="datePaceholder"/>
                <LabeledLine label="Data da Saída" :value="datePaceholder"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
              <LabeledLine label="Valor em R$"/>
              </LabeledLineGroup>
              <LabeledLineGroup>
              <LabeledLine label="Ass. do Paciente"/>
              </LabeledLineGroup>
              <p>Obs.: A Prefeitura não se responsabiliza pela permanência de pessoas nessa pousada sem a devida autorização</p>
              <div class="grid grid-cols-2 gap-x-16 text-center mt-8">
                <div class="border-b border-gray-500 pl-1"></div>
                <LabeledLineGroup class="text-left">
                  <LabeledLine label="Data" :value="datePaceholder"/>
                </LabeledLineGroup>
                <span>Serviço Social</span>
              </div>
           </div>
        </div>
      </div>
      </v-card-text>
  </BaseCard>
</template>

<script setup>
  const props = defineProps({
    patientData: { type: Object, requird: true}
  })
  const emit = defineEmits(['close']);

  const { exportToImagePDF, clickPrint } = useExportToPdf();

  const printSection = ref(null);
  const datePaceholder = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

  const handleExportToPDF = () => {
    exportToImagePDF(printSection.value, 2);
  }

</script>
