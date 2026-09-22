<template>
  <v-footer
    app
    class="app-footer bg-gray-200 shadow-sm text-right z-801 text-gray-500"
  >
    <div class="w-full text-xs">
      &copy; {{ new Date().getFullYear() }}
      <span>Itaguaçu da Bahia</span>
    </div>
  </v-footer>
</template>

<script setup></script>

<style scoped>
/* Respeita a barra de gestos do iPhone / Android */
.app-footer {
  padding-bottom: calc(4px + env(safe-area-inset-bottom, 0px));
  min-height: 0;
}
</style>
