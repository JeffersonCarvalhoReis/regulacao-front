<template>
  <BaseCard title="Comanda" @close="emit('close')">
    <v-card-text>
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
      <div class="flex justify-center">
        <div ref="printSection" class="w-256 min-w-236">
          <div class="flex justify-center gap-4">
            <div class="max-w-46">
              <img
                alt="logo prefeitura itaguaçu"
                src="/src/assets/images/logo-gestao.png"
              />
            </div>
            <div class="text-center font-bold">
              <h1 class="text-xl uppercase">
                Prefeitura Municipal de Itaguaçu da Bahia
              </h1>
              <h2 class="text-xl uppercase">Secretaria Municipal de Saúde</h2>
            </div>
            <div class="max-w-46">
              <img
                alt="logo da secretaria de saúde"
                src="/src/assets//images/logo-saude.png"
              />
            </div>
          </div>
          <div class="text-center mb-8">
            <h3 class="text-xl uppercase">Autorização de Hospedagem</h3>
          </div>
          <div class="flex flex-col gap-2">
            <LabeledLineGroup>
              <LabeledLine
                label="Nome do Paciente"
                :text-field="props.newCommand"
                :value="props.patientData?.name"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="Nome do Acompanhante"
                :text-field="props.newCommand"
                :value="companions"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="Endereço"
                :text-field="props.newCommand"
                :value="props.patientData?.street"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="Bairro"
                :text-field="props.newCommand"
                :value="props.patientData?.neighborhood"
              />
              <LabeledLine label="Cidade" value="Itaguaçu da Bahia" />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="Hospital"
                :text-field="props.newCommand"
                :value="props.patientData?.hospital_name"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="Motivo do Tratamento"
                :text-field="props.newCommand"
                :value="props.patientData?.notes"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine
                label="CPF"
                :text-field="props.newCommand"
                :value="props.patientData?.cpf"
              />
              <LabeledLine
                label="SUS"
                :text-field="props.newCommand"
                :value="props.patientData?.cns"
              />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine label="Data da Entrada" :value="datePaceholder" />
              <LabeledLine label="Data da Saída" :value="datePaceholder" />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine label="Valor em R$" />
            </LabeledLineGroup>
            <LabeledLineGroup>
              <LabeledLine label="Ass. do Paciente" />
            </LabeledLineGroup>
            <p>
              Obs.: A Prefeitura não se responsabiliza pela permanência de
              pessoas nessa pousada sem a devida autorização
            </p>
            <div class="grid grid-cols-2 gap-x-16 text-center mt-8">
              <div class="border-b border-gray-500 pl-1" />
              <LabeledLineGroup class="text-left">
                <LabeledLine label="Data" :value="datePaceholder" />
              </LabeledLineGroup>
              <span
                >Profissional Responsável <br />
                Secretaria Municipal de Saúde</span
              >
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </BaseCard>
</template>

<script setup>
const props = defineProps({
  patientData: { type: Object, default: () => {} },
  newCommand: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);
const companions = computed(() => {
  return [
    props.patientData?.companion?.name,
    ...(props.patientData?.extra_companions?.map((ec) => ec.companion?.name) ||
      []),
  ]
    .filter(Boolean) // remove null/undefined
    .join(", ");
});

const { exportToImagePDF, clickPrint } = useExportToPdf();

const printSection = ref(null);
const datePaceholder =
  "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";

const handleExportToPDF = () => {
  exportToImagePDF(printSection.value, 2);
};
</script>
