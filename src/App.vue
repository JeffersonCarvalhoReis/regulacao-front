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

const activeChannels = ref([]);

function teardownEchoChannels() {
  const echo = window.Echo;
  if (!echo) {
    activeChannels.value = [];
    return;
  }
  window.Echo.connector.channels = {};

  activeChannels.value = [];
}

// Exponha globalmente para o authStore chamar
window.teardownEchoChannels = teardownEchoChannels;

function setupEchoChannels() {
  const echo = window.Echo;
  if (!echo || !meStore.role) return;

  // Limpa canais anteriores antes de configurar novos
  teardownEchoChannels();

  if (meStore.role === "regulation_officer") {
    const ch = "appointments.regulation";
    activeChannels.value.push(ch);

    echo.private(ch).listen(".created", (event) => {
      msg.value = `${event.provider_unit} enviou uma nova solicitação de agendamento`;
      color.value = "success";
      alert.value = true;
      icon.value = "mdi-bell-ring";
    });
    echo.private(ch).listen(".pending", (event) => {
      appointmentPendingStore.pending = event.appointments_pending;
    });
  }

  if (meStore.role === "provider_unit_manager") {
    const ch1 = `appointments.provider_unit.id.${meStore.providerUnitId}`;
    const ch2 = `appointments.provider_unit.user.${meStore.user.replaceAll(" ", ".")}`;
    activeChannels.value.push(ch1, ch2);

    echo.private(ch1).listen(".updated", () => {
      msg.value = "Solicitação de agendamento aprovada";
      color.value = "success";
      alert.value = true;
      icon.value = "mdi-check-circle";
    });
    echo.private(ch2).listen(".deleted", () => {
      msg.value = "Solicitação de agendamento recusada";
      color.value = "error";
      alert.value = true;
      icon.value = "mdi-close-circle";
    });
  }
}

watch(
  () => route.name,
  async (newName) => {
    if (newName && newName !== "login") {
      await getMe();
      setupEchoChannels();
      if (meStore.role === "regulation_officer") {
        countAppointment();
      }
    } else if (newName === "login") {
      teardownEchoChannels();
      window.Echo?.disconnect();
    }
  },
  { immediate: true },
);
</script>
