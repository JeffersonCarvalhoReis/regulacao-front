<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="grid grid-cols-2 gap-x-4">
        <base-input-date-picker
          v-model="date"
          class-field="required"
          class-date-picker="absolute right-[-175px] top-0"
          :error-messages="errors.date"
          label="Data"
        />
        <v-text-field
          v-model="time"
          class="required"
          density="compact"
          variant="outlined"
          label="Escolha um horário"
          @update:model-value="onTimeInput"
          @keypress="onlyNumbers"
          :error-messages="errors.time"
          maxlength="5"
          prepend-inner-icon="mdi-clock-time-four-outline"
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="city_id"
          class="required"
          :error-messages="errors.city_id"
          density="compact"
          item-title="name"
          item-value="id"
          :items="cityData"
          label="Cidade"
          variant="outlined"
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="driver_id"
          class="required"
          :error-messages="errors.driver_id"
          density="compact"
          item-title="name"
          item-value="id"
          :items="driverData"
          label="Motorista"
          variant="outlined"
        />
        <v-autocomplete
          :key="autocompleteKey"
          v-model="vehicle_id"
          class="required col-span-2"
          :error-messages="errors.vehicle_id"
          density="compact"
          item-title="vehicle_model"
          item-value="id"
          :items="vehicleData"
          label="Veículo"
          variant="outlined"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campo" @clear="clear" />
      <v-spacer />
      <base-button-register
        button-icon="mdi-content-save"
        button-text="Salvar"
        @register="onSubmit"
      />
    </v-card-actions>
  </base-card>
</template>

<script setup>
  import { useCityApi } from '@/composables/modules/useCityModule';
  import { useDriverApi } from '@/composables/modules/useDriverModule';
  import { useVehicleApi } from '@/composables/modules/useVehicleModule';
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })
  const { onlyNumbers } = useOnlyNumbers();

  const emit = defineEmits(['close', 'save']);
  const autocompleteKey = ref(0);
  const title = computed(() =>
    isEditing.value ? 'Editar Viagem' : 'Cadastrar Viagem'
  );

  const { data: cityData, refetch: cityFetch, params: cityParams } = useCityApi();
  const { data: driverData, refetch: driverFetch, params: driverParams } = useDriverApi();
  const { data: vehicleData, refetch: vehicleFetch, params: vehicleParams } = useVehicleApi();

  const isEditing = computed(() => !!props.modelValue?.id);

  const schema = yup.object({
    city_id: yup.string().required('Cidade é obrigatória'),
    driver_id: yup.string().required('Motorista é obrigatório'),
    vehicle_id: yup.string().required('Veículo é obrigatório'),
    time: yup
    .string()
    .required('Horário é obrigatório')
    .test('dynamic-time-validation', 'Horário inválido', value => {
      if (!value) return false;
      if (!/^\d{0,2}:?\d{0,2}$/.test(value)) return false;

      const [h, m = ''] = value.split(':');

      if (h.length > 0) {
        const hour = parseInt(h);
        if (isNaN(hour)) return false;
        if (h.length === 1 && hour > 2) return false;
        if (h.length === 2 && hour > 23) return false;
      }

      if (m.length > 0) {
        const minute = parseInt(m);
        if (isNaN(minute)) return false;
        if (m.length === 1 && minute > 5) return false;
        if (m.length === 2 && minute > 59) return false;
      }

      return true;
    }),
    date: yup.date().required('Data da viagem é obrigatório'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
    initialValues:  {
      driver_id: null,
      city_id: null
    }
  });

  const { value: city_id } = useField('city_id');
  const { value: driver_id } = useField('driver_id');
  const { value: vehicle_id } = useField('vehicle_id');
  const { value: time } = useField('time');
  const { value: date } = useField('date');

  const onTimeInput = (val) => {
    let digits = val.replace(/\D/g, '')

    if (digits.length > 4) digits = digits.slice(0, 4)

    if (digits.length >= 3) {
        time.value = `${digits.slice(0, 2)}:${digits.slice(2)}`
      } else {
        time.value = digits
      }
    };

  onMounted( async () => {
    cityParams.value.per_page = -1;
    driverParams.value.per_page = -1;
    vehicleParams.value.per_page = -1;
    await nextTick();
    await Promise.all([
      cityFetch(),
      driverFetch(),
      vehicleFetch(),
    ])

    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  });

  const clear = () => {
    resetForm()
    autocompleteKey.value++
  };
</script>
