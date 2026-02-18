<template>
  <BaseCard :title="title" @close="emit('close')">
    <v-card-text>
      <v-form class="flex gap-4">
        <v-text-field
          v-model="name"
          class="required"
          density="compact"
          :error-messages="errors.name"
          label="Nome"
          placeholder="Nome do Profissional"
          variant="outlined"
        />
        <v-text-field
          v-model="cns"
          class="required"
          density="compact"
          :error-messages="errors.cns"
          label="CNS"
          maxlength="15"
          placeholder="Cartão Nacional de Saúde"
          variant="outlined"
          @keypress="onlyNumbers"
        />
        <v-text-field
          v-model="cbo"
          class="required"
          density="compact"
          :error-messages="errors.cbo"
          label="CBO"
          maxlength="6"
          variant="outlined"
          @keypress="onlyNumbers"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <div class="m-4">
        <base-button-register
          button-icon="mdi-content-save"
          button-text="Salvar"
          @register="onSubmit"
        />
      </div>
    </v-card-actions>
    <pre>
      {{ props.modeValue }}
    </pre>
  </BaseCard>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["save", "close", "update"]);

const title = computed(() =>
  isEditing.value
    ? "Editar Dados do Profissional"
    : "Cadastrar Novo Profissional",
);

const isEditing = computed(() => !!props.modelValue?.id);

const { onlyNumbers } = useOnlyNumbers();
const { isValidCns } = useCnsValidator();

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  cbo: yup.string().required("CBO é obrigatório"),
  cns: yup
    .string()
    .min(15, "CNS incompleto")
    .required("CNS é obrigatório")
    .test("valid-cns", "CNS inválido", (value) => isValidCns(value)),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name } = useField("name");
const { value: cbo } = useField("cbo");
const { value: cns } = useField("cns");

onMounted(() => {
  if (isEditing.value) {
    resetForm({ values: props.modelValue });
  }
});

const onSubmit = handleSubmit((values) => {
  if (isEditing.value) {
    emit("update", values);
  } else {
    emit("save", values);
  }
});
</script>

<style lang="scss" scoped></style>
