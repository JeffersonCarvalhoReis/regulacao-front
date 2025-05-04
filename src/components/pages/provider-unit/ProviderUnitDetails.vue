<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Unidade Prestadora">
          <div>Nome: {{ props.providerUnitData.name }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Médicos da Unidade Prestadora">
          <ul>
            <li v-for="doctors in props.providerUnitData.doctors" :key="doctors.id">
              {{ doctors.name}}
            </li>
          </ul>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    providerUnitData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Unidade Prestadora: ${props.providerUnitData.name}`)

</script>
