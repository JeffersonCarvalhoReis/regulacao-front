<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Unidade Solicitante">
          <div>Nome: {{ props.requestingUnitData.name }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    requestingUnitData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Unidade Solicitante: ${props.requestingUnitData.name}`)

</script>
