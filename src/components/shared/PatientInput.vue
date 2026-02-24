<template>
  <v-autocomplete
    v-model="patient_id"
    density="compact"
    :error-messages="errorMessages"
    :item-title="patientLabel"
    item-value="id"
    :items="data"
    label="Paciente"
    :loading="isLoading"
    :clearable="isClearable"
    variant="outlined"
    :class="{ required: isRequired }"
    @update:search="onSearch"
  />
</template>

<script setup>
import { usePatientApi } from "@/composables/modules/usePatientModule";
import { debounce } from "lodash";

const props = defineProps({
  modelValue: [String, Number, null],
  errorMessages: {
    type: [Array, String],
    default: () => [],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  isClearable: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const patient_id = ref(props.modelValue);

watch(patient_id, (value) => emit("update:modelValue", value));
watch(
  () => props.modelValue,
  (value) => {
    patient_id.value = value;
  },
);

const { data, refetch, setFilter, isLoading, clearFilters } = usePatientApi();

const { patientLabel } = usePatientLabel();

const loadPatient = async () => {
  if (props.isEditing && props.modelValue) {
    setFilter("id", props.modelValue);
    await refetch();
    await nextTick();
  } else {
    refetch();
  }
};

const onSearch = debounce(async (v) => {
  if (patient_id.value) return;
  clearFilters();
  const name = v.split("-");
  setFilter("name", name[0]);
  await nextTick();
  refetch();
}, 250);

onMounted(async () => {
  await nextTick();
  await loadPatient();
});
</script>
