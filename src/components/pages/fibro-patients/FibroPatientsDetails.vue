<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text class="flex items-stretch">
      <img
        :src="patientData.photo"
        alt="Foto do Paciente"
        class="rounded h-70"
      />
      <BaseSection class="w-full">
        <InfoGroup title="Dados do Paciente" class="h-70">
          <div>Nome: {{ patientData.name }}</div>
          <div>CPF: {{ patientData.cpf }}</div>
          <div>
            Data de Nascimento: {{ formatDate(patientData.birth_date) }}
          </div>
          <div>Idade: {{ calculateAge(patientData.birth_date) }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
    <div class="text-end px-5 pb-5">
      <v-btn color="success" prepend-icon="mdi-paperclip" @click="openReport">
        Laudo
        <v-tooltip activator="parent">Ver Laudo</v-tooltip>
      </v-btn>
    </div>
  </base-card>
</template>

<script setup>
const props = defineProps({
  patientData: { type: Object, required: true },
});

const title = "Detalhes do paciente";

const { formatDate } = useFormatDate();
const { calculateAge } = useCalculateAge();

const emit = defineEmits(["close"]);

function openReport() {
  if (props.patientData.report) {
    window.open(props.patientData.report, "_blank");
  }
}
</script>
