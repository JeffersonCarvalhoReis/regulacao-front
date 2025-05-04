<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados do Médico">
          <div>Nome: {{ props.doctorData.name }}</div>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Especialidades">
          <ul>
            <li v-for="specialist in props.doctorData.specialists" :key="specialist.id">
                {{ specialist.name }}
            </li>
          </ul>
        </InfoGroup>
        <v-divider vertical />
        <InfoGroup title="Unidade que presta serviços">
          <ul>
            <li v-for="provider_unit in props.doctorData.provider_units" :key="provider_unit.id">
                {{ provider_unit.name }}
            </li>
          </ul>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
  const props = defineProps({
    doctorData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = computed(() => `Médico: ${props.doctorData.name}`)

</script>
