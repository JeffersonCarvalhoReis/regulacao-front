<template>
  <v-card class="border border-gray-200 shadow-sm mb-2" flat>
    <v-card-text class="flex justify-between gap-4">
      <base-input-date-picker
        v-model="travelDate"
        class-date-picker="absolute translate-x-100 translate-y-30"
        clearable
        label="Data da viagem"
        @update:model-value="emitFilters"
      />
      <v-autocomplete
        v-model="driver_id"
        clearable
        density="compact"
        item-title="name"
        item-value="id"
        :items="driverData"
        label="Motorista"
        variant="outlined"
        @update:model-value="emitFilters"
        @update:search="onSearchDriver"
      />
      <v-autocomplete
        v-model="vehicle_id"
        clearable
        density="compact"
        item-title="vehicle_model"
        item-value="id"
        :items="vehicleData"
        label="Veículo"
        variant="outlined"
        @update:model-value="emitFilters"
        @update:search="onSearchVehicle"
      />
      <v-autocomplete
        v-model="city_id"
        clearable
        density="compact"
        item-title="name"
        item-value="id"
        :items="cityData"
        label="Cidade"
        variant="outlined"
        @update:model-value="emitFilters"
        @update:search="onSearchCity"
      />
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { debounce } from 'lodash'
  import { useDriverApi } from '@/composables/modules/useDriverModule'
  import { useVehicleApi } from '@/composables/modules/useVehicleModule'
  import { useCityApi } from '@/composables/modules/useCityModule'

  // Emissão para o pai
  const emit = defineEmits(['search-travel'])

  // Filtros (model)
  const travelDate = ref(null)
  const driver_id = ref(null)
  const vehicle_id = ref(null)
  const city_id = ref(null)

  // APIs
  const { data: driverData, params: driverParams, refetch: driverFetch, setFilter: filterDrivers } = useDriverApi()
  const { data: vehicleData, params: vehicleParams, refetch: vehicleFetch, setFilter: filterVehicles } = useVehicleApi()
  const { data: cityData, params: cityParams, refetch: cityFetch, setFilter: filterCities } = useCityApi()

  // Emite os filtros para o componente pai
  const emitFilters = () => {
    emit('search-travel', {
      date: travelDate.value,
      driver_id: driver_id.value,
      vehicle_id: vehicle_id.value,
      city_id: city_id.value,
    })
  }

  // Debounced search
  const onSearchDriver = debounce(v => {
    filterDrivers('name', v)
    driverFetch()
  }, 250)

  const onSearchVehicle = debounce(v => {
    filterVehicles('vehicle_model', v)
    vehicleFetch()
  }, 250)

  const onSearchCity = debounce(v => {
    filterCities('name', v)
    cityFetch()
  }, 250)

  onMounted(async () => {
    driverParams.value.sort = 'name'
    cityParams.value.sort = 'name'
    vehicleParams.value.sort = 'vehicle_model'

    await nextTick()
    await Promise.all([driverFetch(), cityFetch(), vehicleFetch()])
  })
</script>
