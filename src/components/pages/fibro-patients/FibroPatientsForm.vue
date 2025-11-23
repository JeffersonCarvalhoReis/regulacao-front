<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="grid grid-cols-4 gap-2">
          <!-- Nome -->
          <v-text-field
            v-model="name"
            class="col-span-2 required"
            density="compact"
            :error-messages="errors.name"
            label="Nome"
            maxlength="100"
            placeholder="Nome completo do paciente"
            variant="outlined"
          />

          <!-- CPF -->
          <v-text-field
            v-model="cpf"
            class="required"
            density="compact"
            :error-messages="errors.cpf"
            label="CPF"
            maxlength="14"
            placeholder="CPF do paciente"
            variant="outlined"
            @keypress="onlyNumbers"
            @paste="
              (event) =>
                handlePaste(event, formatCpf, (val) => (cpf = val), {
                  maxDigits: 14,
                })
            "
            @update:model-value="(val) => (cpf = formatCpf(val))"
          />

          <!-- Data de nascimento -->
          <base-input-date-picker
            v-model="birth_date"
            class-field="required"
            :error-messages="errors.birth_date"
            label="Data de Nascimento"
            :position="position"
          />

          <!-- Laudo (PDF ou imagem) -->
          <v-file-input
            chips
            show-size
            counter
            v-model="report"
            prepend-icon=""
            accept=".pdf,.jpg,.jpeg,.png"
            class="col-span-2"
            :class="{ required: !isEditing }"
            density="compact"
            :label="isEditing ? 'Enviar Novo Laudo' : 'Laudo (PDF ou imagem)'"
            :error-messages="errors.report"
            variant="outlined"
            prepend-inner-icon="mdi-file"
          />

          <v-file-input
            chips
            show-size
            counter
            prepend-icon=""
            v-model="photo"
            accept="image/jpeg, image/png, image/webp"
            class="col-span-2"
            :class="{ required: !isEditing }"
            density="compact"
            :label="isEditing ? 'Atualizar Foto' : 'Foto'"
            :error-messages="errors.photo"
            variant="outlined"
            prepend-inner-icon="mdi-image"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions class="flex justify-end items-end mx-4 mb-4">
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

const { formatCpf } = useFormatCpf();
const { onlyNumbers, handlePaste } = useOnlyNumbers();
const { isValidCpf } = useCpfValidator();

const isEditing = computed(() => !!props.modelValue?.id);
const position = ref("center-left");

onMounted(() => {
  if (isEditing.value) {
    delete props.modelValue.photo;
    delete props.modelValue.report;
    resetForm({ values: props.modelValue });
  }
});

const title = computed(() =>
  isEditing.value ? "Editar Paciente" : "Cadastrar Paciente"
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_REPORT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),

  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("valid-cpf", "CPF inválido", (value) => isValidCpf(value)),

  birth_date: yup.date().required("Data de nascimento é obrigatória"),

  report: yup
    .mixed()
    .nullable()
    .test("required-report", "Laudo é obrigatório", function (value) {
      if (!isEditing.value && !value) return false;
      return true;
    })
    .test("file-size", "O arquivo deve ter no máximo 10MB", (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("file-type", "Formato inválido. Envie PDF, JPG ou PNG", (value) => {
      if (!value) return true;
      return ACCEPTED_REPORT_TYPES.includes(value.type);
    }),

  photo: yup
    .mixed()
    .nullable()
    .test("required-photo", "Foto é obrigatória", function (value) {
      if (!isEditing.value && !value) return false;
      return true;
    })
    .test("file-size", "A foto deve ter no máximo 10MB", (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("file-type", "A foto deve ser JPG ou PNG", (value) => {
      if (!value) return true;
      return ACCEPTED_PHOTO_TYPES.includes(value.type);
    }),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name } = useField("name");
const { value: cpf } = useField("cpf");
const { value: birth_date } = useField("birth_date");
const { value: report } = useField("report");
const { value: photo } = useField("photo");

const onSubmit = handleSubmit((values) => {
  emit("save", values);
});
</script>
