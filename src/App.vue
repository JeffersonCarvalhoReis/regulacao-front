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
const meStore = useMeStore();
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
      if (role == "regulation_officer") {
        countAppointment();
      }
    }
  },
);

onMounted(async () => {
  const echo = window.Echo;

  echo.private("appointments.regulation").listen(".created", (event) => {
    msg.value = `${event.provider_unit} enviou uma nova solicitação de agendamento`;
    color.value = "success";
    alert.value = true;
  });

  echo
    .private(`appointments.provider_unit.name.${meStore.providerUnit}`)
    .listen(".updated", (event) => {
      msg.value = "Solicitação de agendamento aprovada";
      color.value = "success";
      alert.value = true;
    });

  echo
    .private(`appointments.provider_unit.user.${meStore.user}`)
    .listen(".deleted", (event) => {
      msg.value = "Solicitação de agendamento recusada";
      color.value = "error";
      alert.value = true;
    });

  echo.private("appointments.regulation").listen(".pending", (event) => {
    appointmentPendingStore.pending = event.appointments_pending;
  });
});
</script>
