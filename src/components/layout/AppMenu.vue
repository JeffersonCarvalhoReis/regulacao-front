<template>
  <!-- <v-layout> -->
  <v-navigation-drawer
    v-model="drawer"
    class="border-r border-gray-200 bg-slate-100 pb-6"
    expand-on-hover
    flat
    :mobile-breakpoint="768"
    :rail="$vuetify.display.width >= 768"
    @update:model-value="
      (val) => {
        if (!val) emit('close');
      }
    "
  >
    <!-- Navigation Menu -->
    <v-list density="compact" nav>
      <!-- Main Navigation Items -->
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'home'"
        icon="mdi-home"
        title="Início"
        :to="{ name: 'home' }"
      />

      <v-list-subheader
        v-if="['regulation_officer', 'provider_unit_manager'].includes(role)"
        class="menu-subheader"
        >Demanda</v-list-subheader
      >
      <v-list-subheader
        v-if="['reception'].includes(role)"
        class="menu-subheader"
        >Atendimento</v-list-subheader
      >

      <app-menu-item
        v-if="
          ['reception', 'regulation_officer', 'provider_unit_manager'].includes(
            role
          )
        "
        :active="$route.name === 'patients'"
        prepend-icon="mdi-card-account-details"
        title="Pacientes"
        :to="{ name: 'patients' }"
      />
      <app-menu-item
        v-if="
          ['reception', 'regulation_officer', 'provider_unit_manager'].includes(
            role
          )
        "
        :active="$route.name === 'solicitations'"
        prepend-icon="mdi-clipboard-list"
        title="Solicitações"
        :to="{ name: 'solicitations' }"
      />
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'appointments'"
        prepend-icon="mdi-calendar-check"
        title="Agendamentos"
        :to="{ name: 'appointments' }"
      />
      <v-list-subheader
        v-if="['reception', 'regulation_officer'].includes(role)"
        class="menu-subheader"
      >
        Controle de Procedimentos
      </v-list-subheader>
      <app-menu-item
        v-if="['reception', 'regulation_officer'].includes(role)"
        :active="$route.name === 'procedures'"
        prepend-icon="mdi-clipboard-list-outline"
        title="Procedimentos"
        :to="{ name: 'procedures' }"
      />
      <app-menu-item
        v-if="['reception', 'regulation_officer'].includes(role)"
        :active="$route.name === 'specialists'"
        prepend-icon="mdi-medical-bag"
        title="Especialidades"
        :to="{ name: 'specialists' }"
      />
      <v-list-subheader
        v-if="['regulation_officer'].includes(role)"
        class="menu-subheader"
      >
        Cadastro de Unidades e Profissionais
      </v-list-subheader>
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'doctors'"
        prepend-icon="mdi-stethoscope"
        title="Médicos"
        :to="{ name: 'doctors' }"
      />
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'health-units'"
        prepend-icon="mdi-hospital-building"
        title="Unidades de saúde"
        :to="{ name: 'health-units' }"
      />
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'requesting-units'"
        prepend-icon="mdi-office-building"
        title="Unidades Solicitantes"
        :to="{ name: 'requesting-units' }"
      />
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'provider-units'"
        prepend-icon="mdi-hospital-building"
        title="Unidades Prestadoras"
        :to="{ name: 'provider-units' }"
      />
      <app-menu-item
        v-if="['regulation_officer'].includes(role)"
        :active="$route.name === 'health-agents'"
        prepend-icon="mdi-account-heart"
        title="Agentes C. de Saúde"
        :to="{ name: 'health-agents' }"
      />
      <div v-if="['provider_unit_manager'].includes(role)">
        <v-list-subheader class="menu-subheader">Gestão</v-list-subheader>
        <app-menu-item
          :active="$route.name === 'appointments-management'"
          prepend-icon="mdi-clipboard-text-clock"
          title="Controle de Agendamentos"
          :to="{ name: 'appointments-management' }"
        />
        <app-menu-item
          :active="$route.name === 'fibro-patients'"
          prepend-icon="mdi-card-account-details"
          title="Carteirinha Fibromialgia"
          :to="{ name: 'fibro-patients' }"
        />
      </div>
      <div v-if="['admin'].includes(role)" class="menu-subheader">
        <v-list-subheader>Administração</v-list-subheader>
        <app-menu-item
          :active="$route.name === 'users'"
          prepend-icon="mdi-account-group"
          title="Usuários"
          :to="{ name: 'users' }"
        />
      </div>
      <div v-if="['tfd'].includes(role)">
        <v-list-subheader class="menu-subheader">TFD</v-list-subheader>
        <app-menu-item
          :active="$route.name === 'patients'"
          prepend-icon="mdi-card-account-details"
          title="Pacientes"
          :to="{ name: 'patients' }"
        />
        <app-menu-item
          :active="$route.name === 'travels'"
          prepend-icon="mdi-map-marker-distance"
          title="Viagens"
          :to="{ name: 'travels' }"
        />
        <app-menu-item
          :active="$route.name === 'patients-tfd'"
          prepend-icon="mdi-text-box-search"
          title="Histórico Pacientes TFD"
          :to="{ name: 'patients-tfd' }"
        />
        <app-menu-item
          :active="$route.name === 'companions'"
          prepend-icon="mdi-card-account-details"
          title="Acompanhantes"
          :to="{ name: 'companions' }"
        />
        <app-menu-item
          :active="$route.name === 'medical-reports'"
          prepend-icon="mdi-file-document"
          title="Laudos Médicos"
          :to="{ name: 'medical-reports' }"
        />
        <app-menu-item
          :active="$route.name === 'deceased'"
          prepend-icon="mdi-cross"
          title="Lista de Falecidos"
          :to="{ name: 'deceased' }"
        />
        <app-menu-item
          :active="$route.name === 'hospitals'"
          prepend-icon="mdi-hospital-building"
          title="Hospitais"
          :to="{ name: 'hospitals' }"
        />
        <app-menu-item
          :active="$route.name === 'cities'"
          prepend-icon="mdi-city"
          title="Cidades"
          :to="{ name: 'cities' }"
        />
        <app-menu-item
          :active="$route.name === 'drivers'"
          prepend-icon="mdi-badge-account"
          title="Motoristas"
          :to="{ name: 'drivers' }"
        />
        <app-menu-item
          :active="$route.name === 'vehicles'"
          prepend-icon="mdi-car-estate"
          title="Veículos"
          :to="{ name: 'vehicles' }"
        />
        <app-menu-item
          v-if="false"
          :active="$route.name === 'bpa-settings'"
          prepend-icon="mdi-map-marker-distance"
          title="Definições do BPA"
          :to="{ name: 'bpa-settings' }"
        />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useMeStore } from "@/stores/me";

const meStore = useMeStore();
const role = meStore.role;
const drawer = ref(true);

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

watch(
  () => props.open,
  (val) => {
    drawer.value = val;
  }
);
onMounted(() => {
  if (window.innerWidth >= 768) {
    drawer.value = true;
  } else {
    drawer.value = false;
  }
});
</script>
<style lang="css" scoped>
.v-navigation-drawer * {
  scrollbar-width: none;
}

.v-navigation-drawer.v-navigation-drawer--is-hovering * {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.v-navigation-drawer__scrim) {
  z-index: 9 !important;
}
.menu-subheader {
  display: none;
}

.v-navigation-drawer.v-navigation-drawer--is-hovering .menu-subheader {
  display: block;
}
</style>
