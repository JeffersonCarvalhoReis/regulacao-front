<template>
  <v-card class="border-t-6 border-ita-light-blue max-w-350 w-full mx-auto">
    <v-card-title class="flex items-center justify-between text-2xl gap-4">
      <span>
        {{ title }}
      </span>
      <v-btn
        class="cursor-pointer hover:bg-gray-200 text-2xl transition-all hover:scale-105 active:scale-95 duration-300 rounded-full"
        flat
        icon
        @click="emit('close')"
      >
        <v-icon>
          mdi-close
        </v-icon>
        <v-tooltip activator="parent">
          Fechar
        </v-tooltip>
      </v-btn>
    </v-card-title>
    <v-divider class="mb-4" />
    <slot />
  </v-card>
</template>
<script setup>
  defineProps({
    title: { type: String, required: true },
  })
  const emit = defineEmits(['close'])
</script>
