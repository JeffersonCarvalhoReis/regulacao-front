<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados Pessoais">
          <div>CPF: {{ acompanionData.cpf }}</div>
          <div>Gênero: {{ genderMap(acompanionData.gender) }}</div>
          <div>Nome da mãe: {{ acompanionData.mother_name }}</div>
          <div>CNS: {{ acompanionData.cns }}</div>
          <div>Data de Nascimento: {{ formatDate(acompanionData.birth_date) }}</div>
          <div>Idade: {{ calculateAge(acompanionData.birth_date) }} anos</div>
          <div v-if="acompanionData.observation">Obs.: {{ acompanionData.observation }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Endereço">
          <div>Rua: {{ acompanionData.street }}</div>
          <div>Bairro: {{ acompanionData.neighborhood }}</div>
        </InfoGroup>

        <v-divider vertical />

        <InfoGroup title="Contato">
          <div>Telefone: {{ acompanionData.phone ? acompanionData.phone : 'Sem número de telefone cadastrado' }}</div>
        </InfoGroup>

      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    acompanionData: { type: Object, default: () => ({}) },
  });

  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge()

  const emit = defineEmits(['close']);
  const title = computed(() => `Acompanhante: ${props.acompanionData.name}`);

  const genderMap = value => {
    const gender = {
      'F': 'Feminino',
      'M': 'Masculino',
    }
    return gender[value] || 'Outro'
  };

</script>
