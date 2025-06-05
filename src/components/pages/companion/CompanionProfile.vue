<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados Pessoais">
          <div>CPF: {{ props.companionData.cpf }}</div>
          <div>Gênero: {{ genderMap(companionData.gender) }}</div>
          <div>Nome da mãe: {{ companionData.mother_name }}</div>
          <div>CNS: {{ companionData.cns }}</div>
          <div>Data de Nascimento: {{ formatDate(companionData.birth_date) }}</div>
          <div>Idade: {{ calculateAge(companionData.birth_date) }}</div>
          <div v-if="companionData.observation">Obs.: {{ companionData.observation }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Endereço">
          <div>Rua: {{ companionData.street }}</div>
          <div>Bairro: {{ companionData.neighborhood }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Contato">
          <div>Telefone: {{ companionData.phone ? companionData.phone : 'Sem número de telefone cadastrado' }}</div>
        </InfoGroup>

      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    companionData: { type: Object, required: true },
  });

  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge()

  const emit = defineEmits(['close']);
  const title = computed(() => `Acompanhante: ${props.companionData.name}`);

  const genderMap = value => {
    const gender = {
      'F': 'Feminino',
      'M': 'Masculino',
    }
    return gender[value] || 'Outro'
  };

</script>
