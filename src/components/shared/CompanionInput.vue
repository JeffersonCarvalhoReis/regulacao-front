<template>
  <v-autocomplete
    v-model="companion_id"
    density="compact"
    :error-messages="errorMessages"
    :item-title="patientLabel"
    item-value="id"
    :items="data"
    label="Acompanhante"
    :loading="isLoading"
    :clearable="isClearable"
    variant="outlined"
    @update:search="onSearch"
  />
</template>

<script setup>
import { useCompanionApi } from "@/composables/modules/useCompanionModule";
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
});

const emit = defineEmits(["update:modelValue"]);

const companion_id = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const { data, refetch, setFilter, isLoading, clearFilters } = useCompanionApi();

const { patientLabel } = usePatientLabel();

const onSearch = debounce(async (v) => {
  if (companion_id.value) return;
  clearFilters();
  const name = v.split("-");
  setFilter("name", name[0]);
  await nextTick();
  refetch();
}, 250);

watch(
  () => props.modelValue,
  async (value) => {
    if (props.isEditing && value) {
      setFilter("id", value);
      await refetch();
    }
  },
  { immediate: true },
);
onMounted(async () => {
  if (!props.isEditing) {
    await refetch();
  }
});
</script>
