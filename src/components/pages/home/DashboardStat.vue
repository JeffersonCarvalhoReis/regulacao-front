<template>
  <v-card
    :aria-label="`${label}: ${loading ? 'carregando' : value}`"
    class="border border-gray-200 shadow-sm h-full transition-shadow duration-200 hover:shadow-md"
    :class="tone === 'critical' && Number(value) > 0 ? 'bg-red-50' : 'bg-white'"
    flat
    role="button"
    tabindex="0"
    @click="emit('activate')"
    @keyup.enter="emit('activate')"
    @keyup.space.prevent="emit('activate')"
  >
    <div class="flex h-full">
      <!-- Faixa de acento: só o cartão crítico com pendência fica "alto" -->
      <div
        class="w-1 shrink-0 rounded-l"
        :class="accentBar"
      />

      <v-card-text class="flex-1 py-4">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm leading-snug text-gray-600">
            {{ label }}
          </p>
          <v-icon
            class="shrink-0"
            :class="iconColor"
            size="20"
          >
            {{ icon }}
          </v-icon>
        </div>

        <v-skeleton-loader
          v-if="loading"
          class="mt-2 bg-transparent"
          type="heading"
        />
        <p
          v-else
          class="mt-1 text-4xl font-semibold tabular-nums leading-none"
          :class="valueColor"
        >
          {{ value }}
        </p>

        <p
          v-if="!loading && hint"
          class="mt-2 text-xs text-gray-500"
        >
          {{ hint }}
        </p>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup>
  const props = defineProps({
    label: { type: String, required: true },
    value: { type: [Number, String], default: '-' },
    icon: { type: String, default: 'mdi-chart-box-outline' },
    hint: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    // 'critical' | 'attention' | 'info' | 'neutral'
    tone: { type: String, default: 'neutral' },
  })

  const emit = defineEmits(['activate'])

  const hasPending = computed(() => Number(props.value) > 0)

  const accentBar = computed(() => {
    if (props.tone === 'critical') {
      return hasPending.value ? 'bg-red-600' : 'bg-ita-green'
    }
    if (props.tone === 'attention') return 'bg-ita-yellow'
    if (props.tone === 'info') return 'bg-ita-blue'
    return 'bg-gray-300'
  })

  const iconColor = computed(() => {
    if (props.tone === 'critical') {
      return hasPending.value ? 'text-red-600' : 'text-ita-green'
    }
    if (props.tone === 'attention') return 'text-ita-yellow'
    if (props.tone === 'info') return 'text-ita-blue'
    return 'text-gray-400'
  })

  const valueColor = computed(() =>
    props.tone === 'critical' && hasPending.value
      ? 'text-red-700'
      : 'text-gray-900',
  )
</script>
