<template>
  <v-card class="flex h-full flex-col border border-gray-200 shadow-sm" flat>
    <div class="flex items-center gap-3 px-4 py-3">
      <v-icon :class="iconClass" size="20">
        {{ icon }}
      </v-icon>

      <h2 class="flex-1 text-base font-semibold text-gray-900">
        {{ title }}
      </h2>

      <v-chip
        v-if="!loading && count > 0"
        class="font-medium tabular-nums"
        size="small"
        variant="tonal"
      >
        {{ count }}
      </v-chip>

      <v-btn
        v-if="actionLabel"
        class="text-ita-blue"
        size="small"
        variant="text"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </v-btn>
    </div>

    <v-divider />

    <div
      class="min-h-0 flex-1 overflow-y-auto pr-4 py-2"
      :style="{ maxHeight }"
    >
      <!-- Carregando -->
      <div v-if="loading" class="py-2">
        <v-skeleton-loader
          v-for="n in 3"
          :key="n"
          class="bg-transparent"
          type="list-item-two-line"
        />
      </div>

      <!-- Vazio: direciona em vez de só informar -->
      <div
        v-else-if="empty"
        class="flex flex-col items-center gap-2 px-4 py-8 text-center"
      >
        <v-icon class="text-gray-300" size="32">
          {{ emptyIcon }}
        </v-icon>
        <p class="text-sm text-gray-500">
          {{ emptyText }}
        </p>
      </div>

      <slot v-else />
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: "mdi-view-list-outline" },
  iconClass: { type: String, default: "text-ita-blue" },
  count: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: "Nada por aqui." },
  emptyIcon: { type: String, default: "mdi-inbox-outline" },
  actionLabel: { type: String, default: "" },
  maxHeight: { type: String, default: "20rem" },
});

const emit = defineEmits(["action"]);
</script>
