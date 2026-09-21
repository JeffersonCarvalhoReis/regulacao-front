<template>
  <v-card class="border border-gray-200 shadow-sm mb-2" flat>
    <v-card-text class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:flex-wrap">
      <div class="flex flex-col gap-2 w-full sm:flex-row">
        <v-autocomplete
          v-model="providerUnitId"
          class="w-full sm:max-w-100"
          clearable
          density="compact"
          item-title="name"
          item-value="id"
          :items="providerUnitData"
          label="Unidade Prestadora"
          variant="outlined"
          @update:model-value="emit('search-provider-unit', providerUnitId)"
        />
        <v-autocomplete
          v-model="doctorId"
          class="w-full sm:max-w-100"
          clearable
          density="compact"
          item-title="name"
          item-value="id"
          :items="doctorData"
          label="Médico"
          variant="outlined"
          @update:model-value="emit('search-doctor', doctorId)"
        />
        <div class="w-full sm:max-w-60">
          <base-input-date-picker
            v-model="date"
            label="Data"
            @update:model-value="emit('search-date', date)"
          />
        </div>
      </div>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useDoctorApi } from "@/composables/modules/useDoctorModule";
import { useProviderUnitApi } from "@/composables/modules/useProviderUnitModule";

const emit = defineEmits([
  "search-provider-unit",
  "search-doctor",
  "search-date",
]);

const {
  data: providerUnitData,
  params: providerUnitParams,
  refetch: providerUnitRefetch,
} = useProviderUnitApi();
const {
  data: doctorData,
  params: doctorParams,
  refetch: doctorRefetch,
} = useDoctorApi();

const providerUnitId = ref(null);
const doctorId = ref(null);
const date = ref(null);

onMounted(async () => {
  providerUnitParams.value.per_page = -1;
  doctorParams.value.per_page = -1;
  providerUnitParams.value.sort = "name";
  doctorParams.value.sort = "name";
  await nextTick();
  await Promise.all([providerUnitRefetch(), doctorRefetch()]);
});
</script>
