<template>
  <div class="mx-auto flex max-w-400 flex-col gap-5 p-4 md:p-6">
    <!-- Cabeçalho: quem está olhando, de quando são os dados, e como atualizar -->
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">
          Painel do regulador
        </h1>
        <p class="mt-0.5 text-sm text-gray-500 first-letter:uppercase">
          {{ today }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="lastUpdated && !loading"
          class="flex items-center gap-1.5 text-xs text-gray-500"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ita-green opacity-60"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full bg-ita-green"
            />
          </span>
          Atualizado {{ updatedLabel }}
        </span>

        <v-btn
          class="text-ita-blue"
          :loading="loading"
          prepend-icon="mdi-refresh"
          size="small"
          variant="tonal"
          @click="fetchSummary"
        >
          Atualizar
        </v-btn>
      </div>
    </header>

    <!-- Erro: diz o que houve e oferece a saída, em vez de tela vazia -->
    <v-alert
      v-if="error"
      class="text-sm"
      closable
      type="error"
      variant="tonal"
      @click:close="error = null"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span>Não foi possível carregar o painel. Verifique sua conexão.</span>
        <v-btn size="small" variant="outlined" @click="fetchSummary">
          Tentar de novo
        </v-btn>
      </div>
    </v-alert>

    <!-- Pendências acionáveis -->
    <section
      aria-label="Pendências"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <DashboardStat
        hint="Vermelho ou amarelo aguardando"
        icon="mdi-alert-octagon-outline"
        label="Risco alto sem agendamento"
        :loading="loading"
        tone="critical"
        :value="highRiskCount"
        @activate="goTo('solicitations')"
      />
      <DashboardStat
        hint="Aguardando classificação de risco"
        icon="mdi-clipboard-alert-outline"
        label="Não classificadas"
        :loading="loading"
        tone="attention"
        :value="summary?.unclassified_count ?? 0"
        @activate="goTo('solicitations')"
      />
      <DashboardStat
        hint="Aguardando confirmação"
        icon="mdi-calendar-clock"
        label="Agendamentos pendentes"
        :loading="loading"
        tone="info"
        :value="pendingStore.pending ?? 0"
        @activate="goTo('appointments')"
      />
      <DashboardStat
        :hint="oldestWaitLabel"
        icon="mdi-account-clock-outline"
        label="Total na fila de espera"
        :loading="loading"
        tone="neutral"
        :value="totalQueue"
        @activate="goTo('solicitations')"
      />
    </section>

    <!-- O que é urgente primeiro -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DashboardPanel
        action-label="Ver solicitações"
        :count="highRiskCount"
        empty-icon="mdi-check-circle-outline"
        empty-text="Nenhum caso de risco alto aguardando agendamento."
        :empty="!summary?.high_risk_waiting?.length"
        icon="mdi-alert-octagon-outline"
        icon-class="text-red-600"
        :loading="loading"
        title="Risco alto aguardando"
        @action="goTo('solicitations')"
      >
        <ul class="divide-y divide-gray-100">
          <li
            v-for="item in summary?.high_risk_waiting"
            :key="item.id"
            class="flex items-center justify-between gap-3 py-2.5"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :class="
                  item.risk_classification === 'red'
                    ? 'bg-red-600'
                    : 'bg-amber-500'
                "
              />
              <span class="truncate text-sm text-gray-900">
                {{ toTitleCase(item.patient_name) }}
              </span>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <span class="text-xs text-gray-500">
                {{
                  item.risk_classification === "red" ? "Vermelho" : "Amarelo"
                }}
              </span>
              <v-chip
                class="tabular-nums font-medium"
                :color="waitColor(item.waiting_days)"
                size="small"
                variant="tonal"
              >
                {{ item.waiting_days }}d
              </v-chip>
            </div>
          </li>
        </ul>
      </DashboardPanel>

      <DashboardPanel
        action-label="Ver solicitações"
        :count="summary?.waiting_queue?.length ?? 0"
        empty-icon="mdi-playlist-check"
        empty-text="Nenhuma solicitação aguardando agendamento."
        :empty="!summary?.waiting_queue?.length"
        icon="mdi-format-list-numbered"
        :loading="loading"
        title="Fila de espera"
        @action="goTo('solicitations')"
      >
        <ul class="divide-y divide-gray-100">
          <li
            v-for="row in summary?.waiting_queue"
            :key="row.label + row.solicitation_type"
            class="py-2.5"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="truncate text-sm text-gray-900">
                {{ toTitleCase(row.label) }}
              </span>
              <span
                class="shrink-0 text-sm font-semibold tabular-nums text-gray-900"
              >
                {{ row.total }}
              </span>
            </div>

            <div class="mt-1.5 flex items-center gap-2">
              <!-- Barra proporcional: mostra o peso de cada fila de relance -->
              <v-progress-linear
                bg-color="grey-lighten-3"
                color="#1261bd"
                height="4"
                :model-value="queueShare(row.total)"
                rounded
              />
              <span
                v-if="row.oldest_days !== null && row.oldest_days !== undefined"
                class="shrink-0 text-xs tabular-nums text-gray-500"
              >
                mais antiga: {{ row.oldest_days }}d
              </span>
            </div>
          </li>
        </ul>
      </DashboardPanel>
    </section>

    <!-- Oportunidades e execução do dia -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DashboardPanel
        :count="summary?.idle_vacancies?.length ?? 0"
        empty-icon="mdi-calendar-remove-outline"
        empty-text="Nenhuma vaga livre nos próximos 7 dias."
        :empty="!summary?.idle_vacancies?.length"
        icon="mdi-calendar-check-outline"
        icon-class="text-ita-green"
        :loading="loading"
        title="Vagas livres (próximos 7 dias)"
      >
        <ul class="divide-y divide-gray-100">
          <li
            v-for="(vac, idx) in summary?.idle_vacancies"
            :key="idx"
            class="flex items-center justify-between gap-3 py-2.5"
          >
            <div class="min-w-0">
              <p class="truncate text-sm text-gray-900">
                {{ toTitleCase(vac.provider_unit) }}
              </p>
              <p v-if="vac.doctor" class="truncate text-xs text-gray-500">
                {{ toTitleCase(vac.doctor) }}
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <span class="text-xs tabular-nums text-gray-500">
                {{ formatDate(vac.date) }}
              </span>
              <v-chip
                class="tabular-nums font-medium"
                color="success"
                size="small"
                variant="tonal"
              >
                {{ vac.available_vacancies }} vagas
              </v-chip>
            </div>
          </li>
        </ul>
      </DashboardPanel>

      <DashboardPanel
        :count="summary?.today_schedule?.length ?? 0"
        empty-icon="mdi-calendar-blank-outline"
        empty-text="Nenhum agendamento para hoje."
        :empty="!summary?.today_schedule?.length"
        icon="mdi-clipboard-text-clock-outline"
        :loading="loading"
        title="Agenda de hoje"
      >
        <ul class="divide-y divide-gray-100">
          <li
            v-for="(row, idx) in summary?.today_schedule"
            :key="idx"
            class="py-2.5"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="truncate text-sm text-gray-900">
                {{ toTitleCase(row.provider_unit) }}
              </span>
              <span class="shrink-0 text-xs tabular-nums text-gray-500">
                {{ row.realized }}/{{ row.total }} realizados
              </span>
            </div>
            <v-progress-linear
              bg-color="grey-lighten-3"
              class="mt-1.5"
              :color="row.realized >= row.total ? 'success' : '#1261bd'"
              height="6"
              :model-value="
                row.total > 0 ? (row.realized / row.total) * 100 : 0
              "
              rounded
            />
          </li>
        </ul>
      </DashboardPanel>
    </section>

    <!-- Indicadores do mês -->
    <v-card class="bg-white border border-gray-200 shadow-sm" flat>
      <div class="flex items-center gap-3 px-4 py-3">
        <v-icon class="text-ita-blue" size="20">mdi-chart-line</v-icon>
        <h2 class="flex-1 text-base font-semibold text-gray-900">
          Indicadores do mês
        </h2>
        <span v-if="trendMonths" class="text-xs text-gray-500">
          tendência dos últimos {{ trendMonths }} meses
        </span>
      </div>
      <v-divider />

      <v-card-text>
        <div
          class="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3 xl:grid-cols-5"
        >
          <div v-for="ind in indicators" :key="ind.key">
            <p class="text-xs text-gray-500">{{ ind.label }}</p>

            <v-skeleton-loader
              v-if="loading"
              class="mt-1 bg-transparent"
              type="heading"
            />
            <p
              v-else
              class="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900"
            >
              {{ ind.value
              }}<span
                v-if="ind.suffix"
                class="ml-0.5 text-sm font-normal text-gray-500"
                >{{ ind.suffix }}</span
              >
            </p>

            <v-sparkline
              v-if="ind.series && ind.series.length > 1"
              class="mt-1"
              :color="ind.color"
              height="28"
              line-width="2"
              :model-value="ind.series"
              padding="4"
              smooth
            />
            <!-- Mantém o alinhamento das colunas sem sparkline -->
            <div v-else class="mt-1 h-7" />
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
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const { getSummary } = useDashboardApi();
const { formatDate } = useFormatDate();
const pendingStore = useAppointmentPendingStore();
const refreshStore = useDashboardRefreshStore();

const summary = ref(null);
const loading = ref(false);
const error = ref(null);
const lastUpdated = ref(null);
const now = ref(Date.now());

const today = computed(() =>
  format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
);

// `now` avança de minuto em minuto para o rótulo não congelar na tela.
const updatedLabel = computed(() => {
  if (!lastUpdated.value) return "";
  void now.value;
  return formatDistanceToNow(lastUpdated.value, {
    addSuffix: true,
    locale: ptBR,
  });
});

const highRiskCount = computed(
  () => summary.value?.high_risk_waiting?.length ?? 0,
);

const totalQueue = computed(
  () =>
    summary.value?.waiting_queue?.reduce((acc, row) => acc + row.total, 0) ?? 0,
);

const maxQueue = computed(() =>
  Math.max(1, ...(summary.value?.waiting_queue ?? []).map((r) => r.total)),
);

const queueShare = (total) => (total / maxQueue.value) * 100;

const oldestWaitLabel = computed(() => {
  const days = (summary.value?.waiting_queue ?? [])
    .map((r) => r.oldest_days)
    .filter((d) => d !== null && d !== undefined);
  if (!days.length) return "";
  return `espera mais antiga: ${Math.max(...days)} dias`;
});

// Faixas simples de severidade por tempo de espera.
const waitColor = (days) => {
  if (days >= 30) return "red";
  if (days >= 15) return "orange";
  return "grey";
};

const trendSeries = (key) =>
  (summary.value?.trend ?? []).map((m) => m[key] ?? 0);

const trendMonths = computed(() => summary.value?.trend?.length ?? 0);

const indicators = computed(() => [
  {
    key: "received",
    label: "Recebidas",
    value: summary.value?.month_indicators?.received ?? "-",
    series: trendSeries("received"),
    color: "#1261bd",
  },
  {
    key: "scheduled",
    label: "Agendadas",
    value: summary.value?.month_indicators?.scheduled ?? "-",
    series: trendSeries("scheduled"),
    color: "#00bff3",
  },
  {
    key: "realized",
    label: "Realizadas",
    value: summary.value?.month_indicators?.realized ?? "-",
    series: trendSeries("realized"),
    color: "#01954e",
  },
  {
    key: "absenteeism",
    label: "Absenteísmo",
    value: summary.value?.month_indicators?.absenteeism_rate ?? "-",
    suffix: "%",
    series: trendSeries("absenteeism_rate"),
    color: "#eeb534",
  },
  {
    key: "wait",
    label: "Espera média",
    value: summary.value?.month_indicators?.avg_wait_days ?? "-",
    suffix: "dias",
    series: trendSeries("avg_wait_days"),
    color: "#64748b",
  },
]);

// Os nomes vêm em caixa alta do banco; exibir tudo em maiúsculas cansa a
// leitura de listas longas, então normalizamos para capitalização normal.
const toTitleCase = (value) => {
  if (!value) return "";
  return String(value)
    .toLocaleLowerCase("pt-BR")
    .replace(
      /(^|\s|['’-])([\p{L}])/gu,
      (_, sep, chr) => sep + chr.toLocaleUpperCase("pt-BR"),
    );
};

const fetchSummary = async () => {
  loading.value = true;
  error.value = null;
  try {
    summary.value = await getSummary();
    lastUpdated.value = Date.now();
  } catch (err) {
    error.value = err;
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

let clockTimer = null;
onMounted(() => {
  fetchSummary();
  clockTimer = setInterval(() => (now.value = Date.now()), 60_000);
});

onBeforeUnmount(() => {
  clearTimeout(debounceTimer);
  clearInterval(clockTimer);
});
</script>
