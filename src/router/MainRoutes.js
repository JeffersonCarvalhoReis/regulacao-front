import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'
import Appointments from '@/pages/Appointments.vue'
import Doctors from '@/pages/Doctors.vue'
import HealthUnits from '@/pages/HealthUnits.vue'
import HealthAgents from '@/pages/HealthAgents.vue'
import Patients from '@/pages/Patients.vue'
import Procedures from '@/pages/Procedures.vue'
import Settings from '@/pages/Settings.vue'
import Specialists from '@/pages/Specialists.vue'
import RequestingUnits from '@/pages/RequestingUnits.vue'
import ProviderUnits from '@/pages/ProviderUnits.vue'
import Users from '@/pages/Users.vue'
import Solicitations from '@/pages/Solicitations.vue'
import AppointmentsManagement from '@/pages/AppointmentsManagement.vue'
import Companions from '@/pages/Companions.vue'
import Hospitals from '@/pages/Hospitals.vue'
import Cities from '@/pages/Cities.vue'
import Vehicles from '@/pages/Vehicles.vue'
import Drivers from '@/pages/Drivers.vue'
import Travels from '@/pages/Travels.vue'
import PatientsTfd from '@/pages/PatientsTfd.vue'
import Deceased from '@/pages/Deceased.vue'
import BpaSettings from '@/pages/BpaSettings.vue'
import MedicalReport from '@/pages/MedicalReport.vue'
// import { auth, redirectIfAuthenticated } from './guard'

export default [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      login: true,
      layout: 'login',
    },

  },
  {
    path: '/inicio',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/agendamentos',
    name: 'appointments',
    component: Appointments,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/controle-de-agendamentos',
    name: 'appointments-management',
    component: AppointmentsManagement,
    meta: {
      requiresAuth: true,
      roles: ['provider_unit_manager'],
    },
  },
  {
    path: '/medicos',
    name: 'doctors',
    component: Doctors,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/unidades-de-saude',
    name: 'health-units',
    component: HealthUnits,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/agentes-de-saude',
    name: 'health-agents',
    component: HealthAgents,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/pacientes',
    name: 'patients',
    component: Patients,
    meta: {
      requiresAuth: true,
      roles: ['tfd','regulation_officer', 'reception', 'provider_unit_manager'],
    },
  },
  {
    path: '/procedimentos',
    name: 'procedures',
    component: Procedures,
    meta: {
      requiresAuth: true,
      roles: ['reception','regulation_officer'],
    },
  },
  {
    path: '/configuracoes',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/especialistas',
    name: 'specialists',
    component: Specialists,
    meta: {
      requiresAuth: true,
      roles: ['reception','regulation_officer'],
    },
  },
  {
    path: '/unidades-solicitantes',
    name: 'requesting-units',
    component: RequestingUnits,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/unidades-prestadoras',
    name: 'provider-units',
    component: ProviderUnits,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer'],
    },
  },
  {
    path: '/usuarios',
    name: 'users',
    component: Users,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },
  {
    path: '/solicitacoes',
    name: 'solicitations',
    component: Solicitations,
    meta: {
      requiresAuth: true,
      roles: ['regulation_officer', 'reception', 'provider_unit_manager'],
    },
  },

  {
    path: '/acompanhantes',
    name: 'companions',
    component: Companions,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/hospitais',
    name: 'hospitals',
    component: Hospitals,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/cidades',
    name: 'cities',
    component: Cities,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/veiculos',
    name: 'vehicles',
    component: Vehicles,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/motoristas',
    name: 'drivers',
    component: Drivers,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/viagens',
    name: 'travels',
    component: Travels,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/pacientes-tfd',
    name: 'patients-tfd',
    component: PatientsTfd,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/falecidos',
    name: 'deceased',
    component: Deceased,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/bpa-definicoes',
    name: 'bpa-settings',
    component: BpaSettings,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
  {
    path: '/laudos-medicos',
    name: 'medical-reports',
    component: MedicalReport,
    meta: {
      requiresAuth: true,
      roles: ['tfd'],
    },
  },
]
