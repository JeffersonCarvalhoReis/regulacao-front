<template>
  <!-- <v-layout> -->
    <v-navigation-drawer
      v-model="drawer"
      class="border-r border-gray-200 bg-slate-100 z-10 pb-6"
      expand-on-hover
      flat
      :mobile-breakpoint="768"
      :rail="$vuetify.display.width >= 768"
    >
      <!-- Navigation Menu -->
      <v-list
        density="compact"
        nav
      >
        <!-- Main Navigation Items -->
        <app-menu-item
           v-if="['regulation_officer'].includes(role)"
          :to="{ name: 'home' }"
          :active="$route.name === 'home'"
          icon="mdi-home"
          title="Início"
        />

        <v-list-subheader v-if="['regulation_officer', 'provider_unit_manager'].includes(role)" >Demanda</v-list-subheader>
        <v-list-subheader v-if="['reception'].includes(role)" >Atendimento</v-list-subheader>

        <app-menu-item
          v-if="['reception', 'regulation_officer', 'provider_unit_manager'].includes(role)"
          :to="{name: 'patients'}"
          :active="$route.name === 'patients'"
          prepend-icon="mdi-card-account-details"
          title="Pacientes"
        />
        <app-menu-item
          v-if="['reception', 'regulation_officer', 'provider_unit_manager'].includes(role)"
          :to="{name: 'solicitations'}"
          :active="$route.name === 'solicitations'"
          prepend-icon="mdi-clipboard-list"
          title="Solicitações"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'appointments'}"
          :active="$route.name === 'appointments'"
          prepend-icon="mdi-calendar-check"
          title="Agendamentos"
        />
        <v-list-subheader
          v-if="['regulation_officer'].includes(role)"
          >
          Controle de Procedimentos
        </v-list-subheader>
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'procedures'}"
          :active="$route.name === 'procedures'"
          prepend-icon="mdi-clipboard-list-outline"
          title="Procedimentos"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'specialists'}"
          :active="$route.name === 'specialists'"
          prepend-icon="mdi-medical-bag"
          title="Especialidades"
        />
        <v-list-subheader
        v-if="['regulation_officer'].includes(role)"
        >
        Cadastro de Unidades e Profissionais
      </v-list-subheader>
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'doctors'}"
          :active="$route.name === 'doctors'"
          prepend-icon="mdi-stethoscope"
          title="Médicos"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'health-units'}"
          :active="$route.name === 'health-units'"
          prepend-icon="mdi-hospital-building"
          title="Unidades de saúde"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'requesting-units'}"
          :active="$route.name === 'requesting-units'"
          prepend-icon="mdi-office-building"
          title="Unidades Solicitantes"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'provider-units'}"
          :active="$route.name === 'provider-units'"
          prepend-icon="mdi-hospital-building"
          title="Unidades Prestadoras"
        />
        <app-menu-item
          v-if="['regulation_officer'].includes(role)"
          :to="{name: 'health-agents'}"
          :active="$route.name === 'health-agents'"
          prepend-icon="mdi-account-heart"
          title="Agentes C. de Saúde"
        />
        <div v-if="['provider_unit_manager'].includes(role)">
          <v-list-subheader>Gestão</v-list-subheader>
          <app-menu-item
            :to="{name: 'appointments-management'}"
            :active="$route.name === 'appointments-management'"
            prepend-icon="mdi-clipboard-text-clock"
            title="Controle de Agendamentos"
          />
        </div>
        <div v-if="['admin'].includes(role)">
          <v-list-subheader >Administração</v-list-subheader>
          <app-menu-item
            :to="{name: 'users'}"
            :active="$route.name === 'users'"
            prepend-icon="mdi-account-group"
            title="Usuários"
          />
        </div>
        <v-list-subheader >TFD</v-list-subheader>

        <app-menu-item
          :to="{name: 'companions'}"
          :active="$route.name === 'companions'"
          prepend-icon="mdi-card-account-details"
          title="Acompanhantes"
        />
        <app-menu-item
          :to="{name: 'hospitals'}"
          :active="$route.name === 'hospitals'"
          prepend-icon="mdi-hospital-building"
          title="Hospitais"
        />
        <app-menu-item
          :to="{name: 'cities'}"
          :active="$route.name === 'cities'"
          prepend-icon="mdi-city"
          title="Cidades"
        />
        <app-menu-item
          :to="{name: 'drivers'}"
          :active="$route.name === 'drivers'"
          prepend-icon="mdi-badge-account"
          title="Motoristas"
        />
        <app-menu-item
          :to="{name: 'vehicles'}"
          :active="$route.name === 'vehicles'"
          prepend-icon="mdi-car-estate"
          title="Veículos"
        />
        <app-menu-item
          :to="{name: 'travels'}"
          :active="$route.name === 'travels'"
          prepend-icon="mdi-map-marker-distance"
          title="Viagens"
        />
      </v-list>
    </v-navigation-drawer>
</template>

<script setup>
  import { useMeStore } from '@/stores/me';

  const meStore = useMeStore();
  const role = meStore.role
  const drawer = ref(false);

  onMounted(() => {
    if (window.innerWidth >= 768) {
      drawer.value = true;
    } else {
      drawer.value = false;
    }
  });

</script>
<style lang="css" scoped>

.v-navigation-drawer *{
  scrollbar-width: none;

}

.v-navigation-drawer.v-navigation-drawer--is-hovering * {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
</style>
