<template>
  <v-layout>
    <!-- Área principal do app com a toolbar integrada -->
    <v-app-bar
      class="z-20 bg-ita-blue border-gray-200 border-b text-white shadow-sm"
      flat
    >
      <v-btn class="md:hidden" icon @click="openMenu = true">
        <v-icon> mdi-menu</v-icon>
      </v-btn>
      <div
        class="bg-blue-300 rounded-full flex items-center justify-center w-9 h-9 ml-1 p-1 shrink-0 sm:w-12 sm:h-12 sm:ml-4"
      >
        <img
          alt="brasão da prefeitura de itaguaçu da bahia"
          class="w-8/12"
          src="@/assets/images/brasao.svg"
        />
      </div>
      <v-app-bar-title class="min-w-0">
        <span class="uppercase tracking-wider block truncate text-sm sm:text-base">
          <span class="hidden sm:inline">Sistema de Regulação | </span>{{ pageTitle }}
        </span>
      </v-app-bar-title>
      <v-spacer />

      <!-- Menu do usuário -->
      <v-menu transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn class="ml-1 px-1 min-w-0 sm:ml-2 sm:px-3" v-bind="props" variant="text">
            <v-avatar class="bg-blue-300 text-white w-8 h-8 sm:mr-2">
              {{ getInitials(userName) }}
            </v-avatar>
            <span class="hidden md:inline max-w-40 truncate">{{ userName }}</span>
            <v-icon class="hidden sm:inline">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="max-w-[85vw]">
          <v-list-item>
            <v-list-item-title class="font-bold whitespace-normal">
              {{ userName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              translateRole(role)
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider />

          <v-list-item
            class="hover:bg-blue-100 hover:text-blue-500"
            prepend-icon="mdi-cog"
            title="Configurações"
            @click="handleClick"
          />
          <v-divider />
          <v-list-item
            class="hover:bg-blue-100 hover:text-blue-500"
            prepend-icon="mdi-logout"
            title="Sair"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>
    <app-menu :open="openMenu" @close="openMenu = false" />

    <v-main class="overflow-x-hidden">
      <v-container fluid class="px-2 py-2 sm:px-4">
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { useRoles } from "@/composables/utils/useRoles";
import { useAuthStore } from "@/stores/authStore";
import { useMeStore } from "@/stores/me";
import { computed } from "vue";

const authStore = useAuthStore();
const meStore = useMeStore();
const route = useRoute();
const router = useRouter();
const openMenu = ref(false);
const role = computed(() => meStore.role);
const userName = computed(() => meStore.user);

const { translateRole } = useRoles();

const pageTitle = computed(() => {
  const titleMap = {
    home: "Início",
    patients: "Pacientes",
    solicitations: "Solicitações",
    appointments: "Agendamentos",
    procedures: "Procedimentos",
    specialists: "Especialidades",
    doctors: "Médicos",
    "health-units": "Unidades de saúde",
    "requesting-units": "Unidades Solicitantes",
    "provider-units": "Unidades Prestadoras",
    "health-agents": "Agentes C. de Saúde",
    "appointments-management": "Controle de Agendamentos",
    users: "Usuários",
    travels: "Viagens",
    companions: "Acompanhantes",
    hospitals: "Hospitais",
    cities: "Cidades",
    vehicles: "Veículos",
    drivers: "Motoristas",
    "patients-tfd": "Pacientes TFD",
    deceased: "Falecidos",
    "medical-reports": "Laudos Médicos",
    "fibro-patients": "Pacientes Fibromialgia",
    "monitoring-reports": "Relatórios de Acompanhamento",
    "bpa-settings": "Definições do BPA",
    schedules: "Agendas",
  };

  return titleMap[route?.name] || "";
});

const handleClick = () => {
  router.push({ name: "settings" });
};
const logout = () => {
  authStore.logout();
  router.push("/");
};

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
</script>
