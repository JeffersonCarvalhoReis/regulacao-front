<template>
  <v-app theme="light">
    <router-view class="bg-gray-100" />
    <v-snackbar v-model="alert" :color="color" :timeout="4000">
      {{ msg }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAppointmentPendingStore } from "./stores/appointmentPendingCount";
import { useMeStore } from "./stores/me";

const route = useRoute();

const role = useMeStore().role;
const getMe = useMeStore().getMe;
const providerUnit = computed(() => useMeStore().providerUnit);
const appointmentPendingStore = useAppointmentPendingStore();
const countAppointment = appointmentPendingStore.appointmentPendingCount;

const alert = ref(false);
const msg = ref(null);
const color = ref("success");

watch(
  () => route.name,
  async (newName) => {
    if (newName !== "login") {
      await getMe();
      countAppointment();
    }
  }
);
// onMounted(async () => {
//const echo = window.Echo;
// echo.channel('appointments')
//   .listen('.created', event => {
//     if(role == 'regulation_officer') {
//       msg.value = `${event.provider_unit} enviou uma nova solicitção de agendamento`
//       color.value = 'success';
//       alert.value = true
//     }
//   });
// echo.channel('appointments')
//   .listen('.updated', event => {
//     if(providerUnit.value == event.provider_unit) {
//       msg.value = `Solicitação de agendamento aprovada`
//       color.value = 'success';
//       alert.value = true
//     }
//   });
// echo.channel('appointments')
//   .listen('.deleted', event => {
//     if(providerUnit.value == event.provider_unit) {
//       msg.value = `Solicitação de agendamento recusada`
//       color.value = 'error'
//       alert.value = true
//     }
//   });
// echo.channel('appointments')
//   .listen('.pending', event => {
//     appointmentPendingStore.pending = event.appointments_pending;
//   });
// });
</script>
