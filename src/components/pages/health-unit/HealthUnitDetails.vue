<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Unidade">
          <div>Nome: {{ props.healthUnitData.name }}</div>
          <div>Total de pacientes: {{ totalPatients }}</div>
        </InfoGroup >

        <v-divider vertical />

        <InfoGroup title="Agentes da Unidade">
          <ul>
            <li v-for="agents in props.healthUnitData.health_agents" :key="agents.id">
              {{ agents.name }}
            </li>
          </ul>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    healthUnitData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Unidade: ${props.healthUnitData.name}`)
  const totalPatients = ref(null)
  onMounted(async () => {
    await nextTick();
    totalPatients.value = props.healthUnitData.health_agents.reduce((total, item )=> {
      return total + item.total_patients }, 0)
  })

</script>
