<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados do Agente">
        <div>Nome: {{ props.healthAgentData.name }}</div>
        <div>Nome da Unidade: {{ props.healthAgentData.health_unit }}</div>
        <div>Total de pacientes: {{ props.healthAgentData.total_patients }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>

  const props = defineProps({
    healthAgentData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Agente Comunitário de Saúde: ${props.healthAgentData.name}`)

</script>
