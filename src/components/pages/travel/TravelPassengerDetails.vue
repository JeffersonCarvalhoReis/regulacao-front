<template>
  <BaseCard :title="title" @close="emit('close')">
    <v-card-text class="flex flex-col gap-2">
      <BaseSection>
        <InfoGroup title="Dados do Paciente">
          <div>Nome: {{ props.data.name }}</div>
          <div>Data de Nascimento: {{ formatDate(props.data.birth_date) }}</div>
          <div>Idade: {{ calculateAge(props.data.birth_date) }}</div>
          <div>CPF: {{ props.data.cpf }}</div>
          <div>CNS: {{ props.data.cns }}</div>
          <div>Nome da Mãe: {{ props.data.mother_name }}</div>
          <div v-if="props.data.phone">Telefone: {{ props.data.phone }}</div>
          <div>Unidade de Saúde: {{ props.data.health_unit }}</div>
          <div>Agende de Saúde: {{ props.data.health_agent }}</div>
          <div>Endereço: {{ `${props.data.street} - ${props.data.neighborhood}` }}</div>
        </InfoGroup>
      </BaseSection>
      <BaseSection v-if="hasCompanion">
        <InfoGroup title="Dados do Acompanhante">
          <div>Nome: {{ props.data.companion_name }}</div>
          <div v-if="props.data.kinship">Parentesco: {{ props.data.kinship }}</div>
          <div>Data de Nascimento: {{ formatDate(props.data.companion_birth_date) }}</div>
          <div>Idade: {{ calculateAge(props.data.companion_birth_date) }}</div>
          <div>CPF: {{ props.data.companion_cpf }}</div>
          <div>CNS: {{ props.data.companion_cns }}</div>
          <div>Nome da Mãe: {{ props.data.companion_mother_name }}</div>
          <div v-if=" props.data.companion_phone">Telefone: {{ props.data.companion_phone }}</div>
          <div>Endereço: {{ `${props.data.companion_street} - ${props.data.companion_neighborhood}` }}</div>
        </InfoGroup>
      </BaseSection>
      <BaseSection v-for="(extra, i) in props.data.extra_companions" :key="i">
        <InfoGroup title="Dados do Acompanhante">
          <div>Nome: {{ extra.companion.name }}</div>
          <div v-if="extra.kinship">Parentesco: {{ extra.kinship }}</div>
          <div>Data de Nascimento: {{ formatDate(extra.companion.birth_date) }}</div>
          <div>Idade: {{ calculateAge(extra.companion.birth_date) }}</div>
          <div>CPF: {{ extra.companion.cpf }}</div>
          <div>CNS: {{ extra.companion.cns }}</div>
          <div>Nome da Mãe: {{ extra.companion.mother_name }}</div>
          <div v-if=" extra.companion.phone">Telefone: {{ extra.companion.phone }}</div>
          <div>Endereço: {{ `${extra.companion.street} - ${extra.companion.neighborhood}` }}</div>
        </InfoGroup>
      </BaseSection>
      <BaseSection>
        <InfoGroup title="Dados da Consulta">
          <div>Local: {{ props.data.hospital_name }}</div>
          <div>Data da Consulta: {{ formatDate(props.data.appointment_date) }}</div>
          <div>Horário da Consulta: {{ props.data.appointment_time }}</div>
          <div v-if="props.data.notes">Motivo: <span class="uppercase">{{ props.data.notes }}</span></div>
          <div>Prioridade: {{ booleanToLabel(props.data.is_priority) }}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </BaseCard>
</template>

<script setup>
  const props = defineProps({
    data: { type: Object, required: true },
  })
  const { formatDate } = useFormatDate();
  const { booleanToLabel } = useBooleanLabel();
  const { calculateAge } = useCalculateAge();
  const emit = defineEmits('close')
  const hasCompanion = computed(() => !!props.data.companion_id)
  const title = computed(() => hasCompanion.value ? 'Detalhes do Paciente e Acompanhante' : 'Detalhes do Paciente')


</script>
