<template>
  <v-card class="border border-gray-200 shadow-sm mb-2" flat>
    <v-card-text class="flex justify-between">
      <v-text-field
        v-model="searchPatient"
        class="max-w-150"
        compact
        density="compact"
        hide-details
        label="Buscar Paciente"
        :placeholder="placeholder"
        variant="outlined"
        clearable
        @keyup="emit('search-patient', searchPatient)"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  placeholder: { type: String, default: "Nome, SUS ou CPF" },
});
const emit = defineEmits(["search-patient"]);
const searchPatient = ref(null);

const clear = () => {
  searchPatient.value = "";
};

watch(
  () => searchPatient.value,
  (newVal) => {
    if (!newVal) {
      emit("search-patient");
    }
  }
);

defineExpose({
  clear,
});
</script>
