<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Procedimento">
          <div>Nome: {{ props.procedureData.name }}</div>
          <div>Idade mínima: {{ props.procedureData.min_age || 'Não definido' }} </div>
          <div>Idade máxima: {{ props.procedureData.max_age || 'Não definido' }}</div>
          <div>Total de solicitações ja feitas para esse procedimento: {{ props.procedureData.total_solicitations }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    procedureData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Procedimento: ${props.procedureData.name}`)

</script>
