<!-- AppMenuItem.vue -->
<template>
  <v-list-item :active="active" active-class="bg-blue-100" :class="classes" :to="to">
    <template #prepend>
      <template v-if="title == 'Agendamentos' && appointmentPendingStore.pending > 0">
        <v-badge color="error" :content="appointmentPendingStore.pending" location="top right">
          <v-icon :class="active ? 'text-ita-blue ' : ''">{{ icon }}</v-icon>
        </v-badge>
      </template>
      <v-icon v-else :class="active ? 'text-ita-blue ' : ''">{{ icon }}</v-icon>
    </template>
    <v-list-item-title :class="active ? 'text-ita-blue ' : ''">
      {{ title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script setup>
  import { useAppointmentPendingStore } from '@/stores/appointmentPendingCount';
  defineProps({
    to: Object,
    active: Boolean,
    icon: String,
    title: String,
    classes: {
      type: String,
      default: 'hover:bg-blue-100 hover:text-ita-blue text-slate-700',
    },
  });

  const appointmentPendingStore = useAppointmentPendingStore();

</script>
