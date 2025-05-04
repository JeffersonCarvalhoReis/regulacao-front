<template>
  <BaseCard @close="emit('close')">
    <div class="flex justify-end gap-4 m-4">
      <v-btn
        prepend-icon="mdi-printer"
        color="success"
        :loading="clickPrint"
        @click="exportToPDF"
      >
        Imprimir
        <v-tooltip activator="parent">Imprimir</v-tooltip>
      </v-btn>
    </div>
    <div class="m-auto">
      <div ref="printSection" class="printable max-w-4xl flex flex-col items-center">
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
            <LabeledLine label="Idade" :value="`${calculateAge(appointmentData.solicitation.patient_birth_date)} anos`"/>
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
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image'

defineProps({
  appointmentData: { type: Object, required: true}
});

const printSection = ref(null);
const clickPrint = ref(false)

const { formatDate } = useFormatDate();
const { calculateAge } = useCalculateAge();

const emit = defineEmits(['close']);

const genderMap = (value) => {
  const gender = {
    'F': 'Feminino',
    'M': 'Masculino',
  }
  return gender[value] || 'Outro'
};

async function exportToPDF() {
  const element = printSection.value;
  clickPrint.value = true

  try {
    // Gera imagem PNG do elemento com suporte a estilos modernos
    const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(dataUrl);

      // Limites de largura e altura da imagem
      const maxWidth = pageWidth - 20; // Margens de 5mm em cada lado
      const maxHeight = pageHeight - 20; // Margens de 5mm em cima e embaixo

      // Tamanho da imagem proporcional à página
      let imgWidth = imgProps.width;
      let imgHeight = imgProps.height;

      // Ajuste de largura e altura para garantir que caiba na página
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio); // Garante que a imagem caiba na página

        imgWidth = imgWidth * ratio;
        imgHeight = imgHeight * ratio;
      }

      // Centraliza a imagem
      const x = (pageWidth - imgWidth) / 2;
      const y = 10

      pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    };
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
  } finally {
   setTimeout(() => {
    clickPrint.value = false
   }, 500)
  }
}



</script>

<style>

@media print {
  @page {
    size: A4;
    margin: 10px;
    padding: 0;
    background-color: white;
  }
  body * {
    visibility: hidden !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  .printable, .printable * {
    visibility: visible !important;
  }
  .printable {
    position: fixed !important;
    top: 0;
  }
  .printable .bg-blue-300 {
    background-color: #93c5fd !important; /* cor exata do Tailwind bg-blue-300 */
  }

  .printable .p-2 {
    padding: 0.5rem !important;
  }

  .printable .h-6 {
    height: 1.5rem !important;
  }
}
</style>
