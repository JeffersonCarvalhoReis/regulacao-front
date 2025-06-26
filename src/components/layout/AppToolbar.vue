<template>
  <v-layout>
  <!-- Área principal do app com a toolbar integrada -->
  <v-app-bar
    class="z-20 bg-ita-blue border-gray-200 border-b text-white shadow-sm"
    flat
  >
    <v-btn
      class="md:hidden"
      icon
      @click="openMenu = true"
    >
      <v-icon> mdi-menu</v-icon>
    </v-btn>
    <div class=" bg-blue-300 border-1 border- rounded-full flex items-center justify-center w-12 h-12 p-1 ml-4">
      <img src="@/assets/images/brasao.svg"  class="w-8/12" alt="brasão da prefeitura de itaguaçu da bahia">
    </div>
    <v-app-bar-title class="md:hidden lg:block">
      <span class="uppercase tracking-wider">Sistema de Regulação | {{ pageTitle }}</span>
    </v-app-bar-title>
    <v-spacer />

    <!-- Menu do usuário -->
    <v-menu transition="slide-y-transition">
      <template #activator="{ props }">
        <v-btn
          class="ml-2"
          v-bind="props"
          variant="text"
        >
          <v-avatar
            class="mr-2 bg-blue-300 text-white w-8 h-8"
          >
            {{ getInitials(userName) }}
          </v-avatar>
          <span>{{ userName }}</span>
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title class="font-bold">
            {{ userName }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ translateRole(role) }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider />

        <v-list-item
          prepend-icon="mdi-cog"
          class="hover:bg-blue-100 hover:text-blue-500"
          title="Configurações"
          @click="handleClick"
        />
        <v-divider />
        <v-list-item
          prepend-icon="mdi-logout"
          class="hover:bg-blue-100 hover:text-blue-500"
          title="Sair"
          @click="logout"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
  <app-menu :open="openMenu" @close="openMenu = false" />

  <v-main class="overflor-hidden">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { computed } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { useMeStore } from '@/stores/me';
  import { useRoles } from '@/composables/utils/useRoles';

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
    'home': 'Início',
    'patients': 'Pacientes',
    'solicitations': 'Solicitações',
    'appointments': 'Agendamentos',
    'procedures': 'Procedimentos',
    'specialists': 'Especialidades',
    'doctors': 'Médicos',
    'health-units': 'Unidades de saúde',
    'requesting-units': 'Unidades Solicitantes',
    'provider-units': 'Unidades Prestadoras',
    'health-agents': 'Agentes C. de Saúde',
    'appointments-management': 'Controle de Agendamentos',
    'users': 'Usuários',
    'travels': 'Viagens',
    'companions': 'Acompanhantes',
    'hospitals': 'Hospitais',
    'cities': 'Cidades',
    'vehicles': 'Veículos',
    'driver': 'Motoristas',
    'patients-tfd': 'Pacientes TFD',
    'deceased': 'Falecidos',
  };

  return titleMap[route.name] || '';
});



  const handleClick = () => {
    router.push({ name: 'settings' });

  }
  const logout = () => {
    authStore.logout();
    router.push('/');
  };

  const getInitials = name => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  const emit = defineEmits('menu')

</script>
