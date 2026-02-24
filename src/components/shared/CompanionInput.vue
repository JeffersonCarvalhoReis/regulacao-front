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

const companion_id = ref(props.modelValue);

watch(companion_id, (value) => emit("update:modelValue", value));
watch(
  () => props.modelValue,
  (value) => {
    companion_id.value = value;
  },
);

const { data, refetch, setFilter, isLoading, clearFilters } = useCompanionApi();

const { patientLabel } = usePatientLabel();

const loadCompanion = async () => {
  if (props.isEditing && props.modelValue) {
    setFilter("id", props.modelValue);
    await refetch();
    await nextTick();
  } else {
    refetch();
  }
};

const onSearch = debounce(async (v) => {
  if (companion_id.value) return;
  clearFilters();
  const name = v.split("-");
  setFilter("name", name[0]);
  await nextTick();
  refetch();
}, 250);

onMounted(async () => {
  await nextTick();
  await loadCompanion();
});
</script>
