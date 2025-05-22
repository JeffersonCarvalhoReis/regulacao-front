<template>
  <BaseCard :title="title" @close="emit('close')" >
    <div class="flex justify-end gap-4 m-4">
      <v-btn
        prepend-icon="mdi-alert-circle"
        color="primary"
        @click="editRecomendationDialog = true"
      >
       Recomendações
        <v-tooltip activator="parent">Escrever novas recomendações</v-tooltip>
      </v-btn>
      <v-btn
        prepend-icon="mdi-printer"
        color="success"
        @click="printConfirmation"
      >
        Imprimir
        <v-tooltip activator="parent">Imprimir</v-tooltip>
      </v-btn>
    </div>
    <div class="mx-auto mb-10 flex flex-col justify-end" id="appointmentConfirmation">
      <v-card-title>
      <hr>
          <h1 class="text-lg">Comprovante de Agendamento</h1>
        <hr>
        </v-card-title>
        <v-card-text>
          <div class=" leading-6">
            <div class="flex items-center my-2">
              <img class="w-20" alt="Brasao do municipio de itaguaçu" src="/src/assets/images/brasao.svg">
              <div class="flex flex-col gap-5 ml-3">
                <h3 class="font-bold ">Prefeitura Municipal de Itaguaçu da Bahia</h3>
                <p class="font-bold">Secretaria Municipal de Saúde de Itaguaçu da Bahia</p>
              </div>
            </div>
            <hr>

            <strong>Dados do Paciente:</strong><br>
            <hr>
            <strong> Nome: </strong><span class="uppercase">{{ props.appointmentData.patient }}</span><br>
            <strong>CNS: </strong>{{ props.appointmentData.solicitation.patient_cns }}<br>
            <strong>Data de Nasc.: </strong>{{ formatDate(props.appointmentData.solicitation.patient_birth_date) }}<br>
            <strong>Celular: </strong>{{ props.appointmentData.solicitation.patient_phone }}<br>
            <strong>Endereço: </strong><span class="uppercase">{{ props.appointmentData.solicitation.patient_street }} - {{ props.appointmentData.solicitation.patient_neighborhood }}</span><br>

            <hr>

          <strong>Dados do Local de Atendimento:</strong><br>
            <hr>
            <strong>Data: </strong>{{ formatDate(props.appointmentData.date) }}<br>
            <strong>Horário: </strong>{{ props.appointmentData.time }}<br>
            <strong>Local: </strong><span class="uppercase">{{ props.appointmentData.provider_unit }}</span> <br>
            <div v-if="props.appointmentData.provider_unit_localization">
              <strong>Localização: </strong><span class="uppercase">{{ props.appointmentData.provider_unit_localization }}</span> <br>

            </div>
            <hr>

          <strong>Profissional do Atendimento:</strong><br>
            <hr>

            <strong>Médico: </strong> <span class="uppercase">{{ props.appointmentData.doctor }}</span><br>
            <div v-if="isExam">
              <strong>Procedimento:</strong> <span class="uppercase tracking-widest">{{ props.appointmentData.procedure}}</span><br>
            </div>
            <div v-else>
              <strong>Especialidade: </strong> <span class="uppercase tracking-widest">{{ props.appointmentData.specialist}}</span><br>
            </div>
            <p><strong>Recomendações:</strong> <span class="uppercase">{{ recomendation }}</span></p>
          </div>
        </v-card-text>
    </div>
  </BaseCard>
  <v-dialog
  v-model="editRecomendationDialog"
  class="z-990"
  >
    <AppointmentRecomendations :recomendationDefault="recomendation" @close ="editRecomendationDialog = false" @save="handleSaveRecomendation"/>
  </v-dialog>
</template>

<script setup>
import { useFormatDate } from '@/composables/utils/useFormatDate';

const props = defineProps({
  appointmentData: { type: Object, required: true },
})

const { formatDate } = useFormatDate();
const emit = defineEmits(['close'])
const title = ref('Comprovante de Agendamento');
const recomendation = ref('Atenção! O atendimento será por ordem de chegada');
const editRecomendationDialog = ref(false);
const isExam = computed(() => props.appointmentData.solicitation.solicitation_type == 'exam' )

const handleSaveRecomendation = value => {
  recomendation.value = value;
  editRecomendationDialog.value = false;
};

const printConfirmation = () => {
  const printContent = document.getElementById('appointmentConfirmation');
  if (!printContent) return;

  const clonedContent = printContent.cloneNode(true);

  const printWindow = window.open('', '_blank', 'width=800,height=600');

  printWindow.document.write(`
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Comprovante de Agendamento</title>
        <style>
          /* Estilos específicos para impressão */
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          h1, h3, strong {
            font-weight: bold;
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            width: 80px;
            margin-right: 20px;
          }
          .header div {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          h1 {
           font-size: 18px
          }
          hr {
            margin: 10px 0;
            border: none;
            border-top: 1px solid #ccc;
          }
          .text-uppercase {
            text-transform: uppercase;
          }
          .text-spacing {
            letter-spacing: 1px;
          }
          .info-block {
            margin-bottom: 15px;
            line-height: 1.6;
          }
          @media print {
            @page {
              margin: 0;
            }
            body {
              width: 80mm; /* ou 80mm, depende da impressora */
              margin-left: 6px;
              padding: 8px;
              font-size: 10px;
            }
            * {
              box-sizing: border-box;
            }

            header, footer {
              display: none !important;
            }
            * {
              visibility: visible !important;
            }
            img {
              max-width: 100%;
              height: auto;
            }

          }
        </style>
      </head>
      <body>

        <h1 style="text-align:center;">Comprovante de Agendamento</h1>
        <hr>
        <div class="header">
          <img src="/images/brasao.svg" alt="Brasão Itaguaçu">
          <div>
            <p><strong>Prefeitura Municipal de Itaguaçu da Bahia</strong></p>
            <p><strong>Secretaria Municipal de Saúde de Itaguaçu da Bahia</strong></p>
          </div>
        </div>
        <hr>
        <div class="info-block text-spacing text-uppercase">
          ${clonedContent.querySelector('.leading-6').innerHTML.split('<hr>').slice(1, 7).join('<hr>')}
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        <\/script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

</script>
