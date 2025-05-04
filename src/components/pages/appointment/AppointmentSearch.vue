<template>
  <v-card
    class="border border-gray-200 shadow-sm mb-2"
    flat
  >
    <v-card-text class="flex justify-between">
      <div class="flex flex-col w-full">

        <v-text-field
        v-model="searchAppointment"
        class="max-w-150"
        density="compact"
        hide-details
        label="Buscar Agendamento de Paciente"
        placeholder="Nome, SUS ou CPF"
        variant="outlined"
        @keyup="emit('search-appointment', searchAppointment)"
      />
      <v-select
        v-model="appointmentStatus"
        :items="appointmentStatusOptions"
        label="Status do Agendamento"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        class="max-w-100 mt-4"
        @update:modelValue="emit('search-appointment-status', appointmentStatus)"
      />
      </div>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  const emit = defineEmits(['search-appointment', 'search-appointment-status'])
  const searchAppointment = ref(null);
  const appointmentStatus = ref('')
  const appointmentStatusOptions = [
    { value: '', label: 'Todos'},
    { value: 'scheduled', label: 'Agendados'},
    { value: 'not-present', label: 'Não comparecidos'},
    { value: 'realized', label: 'Realizados'},
    ]

</script>
