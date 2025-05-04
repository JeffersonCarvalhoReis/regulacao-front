<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <BaseSection>
        <InfoGroup title="Dados do Usuário">
          <div>Nome: {{ props.userData.user }}</div>
          <div>Função: {{ translateRole(props.userData.role)}}</div>
          <div v-if="props.userData.role == 'provider_unit_manager'">Unidade: {{ props.userData.provider_unit}}</div>
        </InfoGroup>
      </BaseSection>
    </v-card-text>
  </base-card>
</template>

<script setup>
import { useRoles } from '@/composables/utils/useRoles';

  const props = defineProps({
    userData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['close']);
  const title = 'Informações gerais sobre o usuário'
  const { translateRole } = useRoles();

</script>
