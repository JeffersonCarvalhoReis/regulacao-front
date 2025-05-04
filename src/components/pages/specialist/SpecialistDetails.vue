<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados da Especialidade">
          <div>Nome: {{ props.specialistData.name }}</div>
          <div>Idade mínima: {{ props.specialistData.min_age || 'Não definido'}} </div>
          <div>Idade máxima: {{ props.specialistData.max_age || 'Não definido'}}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Médicos">
          <ul>
            <li v-for="doctors in props.specialistData.doctors" :key="doctors.id">
              {{ doctors.name}}
            </li>
            <li v-if="props.specialistData.doctors.length === 0">Nenhum médico registrado como {{ props.specialistData.name }}</li>
          </ul>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    specialistData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Especialidade: ${props.specialistData.name}`)

</script>
