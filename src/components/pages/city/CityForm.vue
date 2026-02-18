<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="name"
          class="required"
          density="compact"
          :error-messages="errors.name"
          label="Nome"
          placeholder="Nome da Cidade"
          variant="outlined"
        />
        <v-text-field
          v-model="bpa_quantity"
          density="compact"
          :error-messages="errors.bpa_quantity"
          label="Quantidade no BPA"
          placeholder="Quantidade de viagens no BPA"
          variant="outlined"
          type="number"
          min="0"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="flex justify-between mx-4 mb-4">
      <base-button-clear
        v-if="!isEditing"
        button-text="Limpar Campo"
        @clear="clear"
      />
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
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "save"]);
const title = computed(() =>
  isEditing.value ? "Editar Cidade" : "Cadastrar Cidade",
);

const isEditing = computed(() => !!props.modelValue?.id);

const schema = yup.object({
  name: yup.string().required("Nome da Cidade é obrigatório"),
  bpa_quantity: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Quantidade no BPA deve ser um número")
    .required("Quantidade no BPA é obrigatória")
    .min(0, "Quantidade no BPA deve ser maior ou igual a zero"),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name } = useField("name");
const { value: bpa_quantity } = useField("bpa_quantity");

onMounted(() => {
  if (isEditing.value) {
    resetForm({ values: props.modelValue });
  }
});

const onSubmit = handleSubmit((values) => {
  emit("save", values);
});

const clear = () => {
  resetForm();
};
</script>
