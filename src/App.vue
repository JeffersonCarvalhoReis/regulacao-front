<template>
  <v-app theme="light">
    <router-view class="bg-gray-100" />
    <v-snackbar
      v-model="alert"
      :color="color"
      :timeout="4000"
      timer-color="white"
      timer
      close-on-content-click
      close-delay
    >
      <template #prepend>
        <v-icon size="24" color="white">{{ icon }}</v-icon>
      </template>
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
const icon = ref("");

watch(
  () => route.name,
  async (newName) => {
    if (newName !== "login") {
      if (role == "regulation_officer") {
        countAppointment();
      }
    }
  },
);

watch(
  () => route.name,
  async (newName) => {
    if (newName && newName !== "login") {
      await getMe(); // ← espera carregar os dados

      setupEchoChannels(); // ← só então conecta nos canais
    }
  },
  { immediate: true }, // ← executa imediatamente no primeiro render
);
onMounted(() => {
  if (route.name && route.name !== "login") {
    getMe().then(() => {
      setupEchoChannels();
    });
  }
});
function setupEchoChannels() {
  const echo = window.Echo;

  if (meStore.role === "regulation_officer") {
    echo.private("appointments.regulation").listen(".created", (event) => {
      msg.value = `${event.provider_unit} enviou uma nova solicitação de agendamento`;
      color.value = "success";
      alert.value = true;
      icon.value = "mdi-bell-ring";
    });
    echo.private("appointments.regulation").listen(".pending", (event) => {
      appointmentPendingStore.pending = event.appointments_pending;
    });
  }
  if (meStore.role === "provider_unit_manager") {
    echo
      .private(`appointments.provider_unit.id.${meStore.providerUnitId}`)
      .listen(".updated", (event) => {
        msg.value = "Solicitação de agendamento aprovada";
        color.value = "success";
        alert.value = true;
        icon.value = "mdi-check-circle";
      });
    echo
      .private(
        `appointments.provider_unit.user.${meStore.user.replaceAll(" ", ".")}`,
      )
      .listen(".deleted", (event) => {
        msg.value = "Solicitação de agendamento recusada";
        color.value = "error";
        alert.value = true;
        icon.value = "mdi-close-circle";
      });
  }
}
</script>
