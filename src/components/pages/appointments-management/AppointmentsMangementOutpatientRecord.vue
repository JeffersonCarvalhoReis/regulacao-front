<template>
  <BaseCard @close="emit('close')">
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
    <div class="m-auto">
      <div ref="printSection" class="max-w-4xl flex flex-col items-center">
        <div class="p-3 mb-4 border flex items-center justify-center gap-10 rounded-md">
          <div class="basis-50">
            <img src="@/assets/images/logo-gestao.png" alt="Logo da prefeitura de itaguaçu da bahia">
          </div>
          <div>
            <h2 class="uppercase tracking-wide"><strong>Prefeitura Municipal de Itaguaçu da Bahia</strong></h2>
            <h3 class="uppercase tracking-wide">Secretaria Municipal de Saúde de Itaguaçu da Bahia</h3>
          </div>
        </div>
        <h1 class="uppercase font-extrabold text-xl tracking-wide"><strong>Ficha Ambulatorial</strong></h1>
        <div class="text-right w-full">
          Nº {{appointmentData.order_of_attendance}}
        </div>
        <div class="flex flex-col w-full gap-1 py-4">
          <LabeledLineGroup>
            <LabeledLine label="Nome" :value="appointmentData.patient" />
            <LabeledLine label="SUS" :value="appointmentData.solicitation.patient_cns" />
            <LabeledLine label="CPF" :value="appointmentData.solicitation.patient_cpf" />
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Endereço" :value="`${appointmentData.solicitation.patient_street} - ${appointmentData.solicitation.patient_neighborhood}`" />
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Nome da Mãe" :value="appointmentData.solicitation.patient_mother_name" />
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Responsável" :value="''" /> <!-- Valor vazio adicionado -->
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Data de Nasc." :value="formatDate(appointmentData.solicitation.patient_birth_date)" />
            <LabeledLine label="Idade" :value="`${calculateAge(appointmentData.solicitation.patient_birth_date)}`"/>
            <LabeledLine label="Gênero" :value="genderMap(appointmentData.solicitation.patient_gender)" />
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Cor" :value="appointmentData.solicitation.patient_race" /> <!-- Valor vazio adicionado -->
            <LabeledLine label="Estado Civil" :value="''" /> <!-- Valor vazio adicionado -->
            <LabeledLine label="Profissão" :value="''" /> <!-- Valor vazio adicionado -->
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Telefone" :value="appointmentData.solicitation.patient_phone"/>
            <LabeledLine label="ACS" :value="appointmentData.solicitation.patient_acs" />
            <LabeledLine label="Unidade de Saúde" :value="appointmentData.solicitation.patient_health_unit" />
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Médico" :value="appointmentData.doctor"/>
            <LabeledLine v-if="appointmentData.solicitation.solicitation_type == 'exam'" label="Procedimento" :value="appointmentData?.procedure"/>
            <LabeledLine v-if="appointmentData.solicitation.solicitation_type == 'consultation'" label="Consulta" :value="appointmentData?.specialist"/>
          </LabeledLineGroup>
          <LabeledLineGroup>
            <LabeledLine label="Data da Consulta" :value="formatDate(appointmentData.date)" />
          </LabeledLineGroup>
        </div>
        <div class="border border-gray-300 p-0 w-full flex flex-col">
          <div class="p-2 bg-blue-300 w-full flex justify-center border-b border-gray-300">
            <div class="uppercase font-bold">
              Anamnese/Exame Físico/Sus. Diagnóstica
            </div>
          </div>
          <div v-for="i in 35" :key="i" class="border-b border-gray-300 h-6"></div>
        </div>
      </div>
    </div>

  </BaseCard>
</template>

<script setup>
import { useCalculateAge } from '@/composables/utils/useCalculateAge';
import { useExportToPdf } from '@/composables/utils/useExportToPdf';

defineProps({
  appointmentData: { type: Object, required: true}
});

const printSection = ref(null);

const { formatDate } = useFormatDate();
const { calculateAge } = useCalculateAge();
const { exportToImagePDF, clickPrint } = useExportToPdf();
const emit = defineEmits(['close']);

const handleExportToPDF = () => {
  exportToImagePDF(printSection.value);
}
const genderMap = (value) => {
  const gender = {
    'F': 'Feminino',
    'M': 'Masculino',
  }
  return gender[value] || 'Outro'
};



</script>

