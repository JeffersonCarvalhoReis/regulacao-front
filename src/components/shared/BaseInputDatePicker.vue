<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    transition="scale-transition"
  >
    <!--eslint-disable-next-line vue/no-template-shadow -->
    <template #activator="{ props }">
      <v-text-field
        v-model="formattedDate"
        v-bind="props"
        density="compact"
        :error-messages="errorMessages"
        :label="label"
        :readonly="readonly"
        :class="classField"
        maxlength="10"
        persistent-hint
        placeholder="dd/mm/aaaa"
        prepend-inner-icon="mdi-calendar"
        variant="outlined"
        @keypress="onlyNumbers"
      />
    </template>
    <div :class="props.classDatePicker">
      <v-date-picker
        v-model="date"
        border="sm"
        divided
        elevation="4"
        header-color="blue"
        location="center"
        rounded="lg"
        @update:model-value="handleDateUpdate"
      />
    </div>
  </v-menu>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { format, isValid, parse } from 'date-fns';
  import { toDate } from 'date-fns-tz';
  import { useOnlyNumbers } from '@/composables/utils/useOnlyNumbers';

  const { onlyNumbers } = useOnlyNumbers();

  const props = defineProps({
    label: { type: String, default: 'Data' },
    errorMessages: { type: String, default: null },
    modelValue: { type: [Date, String, null], default: null },
    classDatePicker: { type: String, default: 'absolute left-[-175px]'},
    readonly: { type: Boolean, default: false },
    classField: {type: String, required: false}
  });

  const emit = defineEmits(['update:modelValue']);

  const menu = ref(false);
  const date = ref(null);
  const dateInput = ref(null);

  watch(() => props.modelValue, newValue => {
    if (newValue) {
      const dateValue = newValue instanceof Date
        ? newValue
        : toDate(newValue);
      if (isValid(dateValue)) {
        date.value = dateValue;
        dateInput.value = format(dateValue, 'dd/MM/yyyy');
      }
    }
    if (newValue === null || newValue === undefined) {
      // Resetar estado interno
      date.value = null;
      dateInput.value = null;
    }
  }, { immediate: true });

  const formattedDate = computed({
    get () {
      return dateInput.value;
    },
    set (value) {
      const maskedValue = applyDateMask(value);
      dateInput.value = maskedValue;

      if (maskedValue?.length === 10) {
        const parsedDate = parse(maskedValue, 'dd/MM/yyyy', new Date());
        if (isValid(parsedDate)) {
          date.value = parsedDate;
          emit('update:modelValue', parsedDate);
        }
      } else {
        date.value = null;
        emit('update:modelValue', null);
      }
      return maskedValue;
    },
  });

  const handleDateUpdate = val => {
    menu.value = false;
    const dateValue = toDate(val);
    date.value = dateValue;
    dateInput.value = format(dateValue, 'dd/MM/yyyy');
    emit('update:modelValue', dateValue);
  };
  const applyDateMask = value => {
    if (!value) return '';

    const numbers = value.replace(/\D/g, '').substring(0, 8);

    if (numbers.length >= 3 && numbers.length <= 4) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
    } else if (numbers.length >= 5) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4)}`;
    } else if (numbers.length >= 1) {
      return `${numbers}`;
    }
    return numbers;
  };
</script>
