<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Painel do Regulador</h1>
      <v-btn
        icon="mdi-refresh"
        size="small"
        variant="text"
        :loading="loading"
        @click="fetchSummary"
      />
    </div>

    <!-- Linha de pendências acionáveis -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <v-card
        class="cursor-pointer"
        :color="highRiskCount > 0 ? 'red-lighten-5' : undefined"
        @click="goTo('solicitations')"
      >
        <v-card-text>
          <p class="text-sm text-gray-600">Risco alto sem agendamento</p>
          <p class="text-3xl font-bold text-red-700">{{ highRiskCount }}</p>
        </v-card-text>
      </v-card>

      <v-card class="cursor-pointer" @click="goTo('solicitations')">
        <v-card-text>
          <p class="text-sm text-gray-600">Não classificadas</p>
          <p class="text-3xl font-bold">{{ summary?.unclassified_count ?? "-" }}</p>
        </v-card-text>
      </v-card>

      <v-card class="cursor-pointer" @click="goTo('appointments')">
        <v-card-text>
          <p class="text-sm text-gray-600">Agendamentos pendentes</p>
          <p class="text-3xl font-bold">{{ pendingStore.pending }}</p>
        </v-card-text>
      </v-card>

      <v-card class="cursor-pointer" @click="goTo('solicitations')">
        <v-card-text>
          <p class="text-sm text-gray-600">Total na fila de espera</p>
          <p class="text-3xl font-bold">{{ totalQueue }}</p>
        </v-card-text>
      </v-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Fila de espera por especialidade/procedimento -->
      <v-card>
        <v-card-title class="text-base font-bold">Fila de espera</v-card-title>
        <v-card-text>
          <p v-if="!summary?.waiting_queue?.length" class="text-sm text-gray-500">
            Nenhuma solicitação aguardando agendamento.
          </p>
          <div
            v-for="row in summary?.waiting_queue"
            :key="row.label + row.solicitation_type"
            class="flex items-center justify-between py-1 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            @click="goTo('solicitations')"
          >
            <span class="uppercase text-sm">{{ row.label }}</span>
            <span class="flex items-center gap-2">
              <v-chip size="small" color="primary" variant="tonal">{{ row.total }}</v-chip>
              <span v-if="row.oldest_days !== null" class="text-xs text-gray-500">
                mais antiga: {{ row.oldest_days }}d
              </span>
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Vagas ociosas -->
      <v-card>
        <v-card-title class="text-base font-bold">Vagas livres (próximos 7 dias)</v-card-title>
        <v-card-text>
          <p v-if="!summary?.idle_vacancies?.length" class="text-sm text-gray-500">
            Nenhuma vaga livre nos próximos dias.
          </p>
          <div
            v-for="(vac, idx) in summary?.idle_vacancies"
            :key="idx"
            class="flex items-center justify-between py-1 border-b border-gray-100"
          >
            <span class="text-sm">
              <span class="uppercase">{{ vac.provider_unit }}</span>
              <span v-if="vac.doctor" class="text-gray-500"> · {{ vac.doctor }}</span>
            </span>
            <span class="flex items-center gap-2 text-xs text-gray-500">
              {{ formatDate(vac.date) }}
              <v-chip size="small" color="success" variant="tonal">
                {{ vac.available_vacancies }} vagas
              </v-chip>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Risco alto detalhado -->
      <v-card>
        <v-card-title class="text-base font-bold">Risco vermelho/amarelo sem agendamento</v-card-title>
        <v-card-text>
          <p v-if="!summary?.high_risk_waiting?.length" class="text-sm text-gray-500">
            Nenhum caso de risco alto pendente. 🎉
          </p>
          <div
            v-for="item in summary?.high_risk_waiting"
            :key="item.id"
            class="flex items-center justify-between py-1 border-b border-gray-100"
          >
            <span class="text-sm uppercase">{{ item.patient_name }}</span>
            <span class="flex items-center gap-2">
              <v-chip
                size="small"
                :color="item.risk_classification === 'red' ? 'red' : 'amber'"
                variant="flat"
              >
                {{ item.risk_classification === 'red' ? 'Vermelho' : 'Amarelo' }}
              </v-chip>
              <span class="text-xs text-gray-500">{{ item.waiting_days }}d</span>
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Agenda de hoje -->
      <v-card>
        <v-card-title class="text-base font-bold">Agenda de hoje</v-card-title>
        <v-card-text>
          <p v-if="!summary?.today_schedule?.length" class="text-sm text-gray-500">
            Nenhum agendamento para hoje.
          </p>
          <div
            v-for="(row, idx) in summary?.today_schedule"
            :key="idx"
            class="py-1 border-b border-gray-100"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="uppercase">{{ row.provider_unit }}</span>
              <span class="text-gray-500">{{ row.realized }}/{{ row.total }} realizados</span>
            </div>
            <v-progress-linear
              :model-value="row.total > 0 ? (row.realized / row.total) * 100 : 0"
              color="success"
              height="6"
              rounded
            />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Indicadores do mês + tendência -->
    <v-card>
      <v-card-title class="text-base font-bold">Indicadores do mês</v-card-title>
      <v-card-text>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p class="text-xs text-gray-500">Recebidas</p>
            <p class="text-2xl font-bold">{{ summary?.month_indicators?.received ?? "-" }}</p>
            <v-sparkline
              :model-value="trendSeries('received')"
              color="primary"
              height="30"
              line-width="2"
              smooth
              padding="4"
            />
          </div>
          <div>
            <p class="text-xs text-gray-500">Agendadas</p>
            <p class="text-2xl font-bold">{{ summary?.month_indicators?.scheduled ?? "-" }}</p>
            <v-sparkline
              :model-value="trendSeries('scheduled')"
              color="indigo"
              height="30"
              line-width="2"
              smooth
              padding="4"
            />
          </div>
          <div>
            <p class="text-xs text-gray-500">Realizadas</p>
            <p class="text-2xl font-bold">{{ summary?.month_indicators?.realized ?? "-" }}</p>
            <v-sparkline
              :model-value="trendSeries('realized')"
              color="success"
              height="30"
              line-width="2"
              smooth
              padding="4"
            />
          </div>
          <div>
            <p class="text-xs text-gray-500">Absenteísmo</p>
            <p class="text-2xl font-bold">
              {{ summary?.month_indicators?.absenteeism_rate ?? "-" }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Espera média</p>
            <p class="text-2xl font-bold">
              {{ summary?.month_indicators?.avg_wait_days ?? "-" }}
              <span class="text-sm font-normal">dias</span>
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useDashboardApi } from "@/composables/modules/useDashboardModule";
import { useFormatDate } from "@/composables/utils/useFormatDate";
import router from "@/router";
import { useAppointmentPendingStore } from "@/stores/appointmentPendingCount";
import { useDashboardRefreshStore } from "@/stores/dashboardRefresh";

const { getSummary } = useDashboardApi();
const { formatDate } = useFormatDate();
const pendingStore = useAppointmentPendingStore();
const refreshStore = useDashboardRefreshStore();

const summary = ref(null);
const loading = ref(false);

const highRiskCount = computed(
  () => summary.value?.high_risk_waiting?.length ?? 0,
);
const totalQueue = computed(
  () =>
    summary.value?.waiting_queue?.reduce((acc, row) => acc + row.total, 0) ??
    0,
);

const trendSeries = (key) =>
  (summary.value?.trend ?? []).map((m) => m[key] ?? 0);

const fetchSummary = async () => {
  loading.value = true;
  try {
    summary.value = await getSummary();
  } finally {
    loading.value = false;
  }
};

// Nota: Solicitations.vue e Appointments.vue hoje só aplicam filtro pelo
// diálogo interno (não leem query params da URL). Por isso o clique aqui
// só navega até a tela certa; pré-aplicar o filtro exigiria uma pequena
// mudança adicional nessas páginas para ler router.currentRoute.value.query
// no onMounted e chamar submitFilters — deixei como próximo passo por não
// fazer parte do que foi pedido agora.
const goTo = (name) => {
  router.push({ name });
};

// Refetch automático sempre que o backend sinalizar mudança (tempo real
// via Reverb, ver App.vue + DashboardUpdated). Debounce simples para não
// disparar várias requisições em rajada.
let debounceTimer = null;
watch(
  () => refreshStore.signal,
  () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchSummary, 800);
  },
);

onMounted(fetchSummary);
</script>
