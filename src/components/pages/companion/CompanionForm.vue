<template>
  <base-card :title="title" @close="emit('close')">
    <v-card-text>
      <v-form>
        <div class="grid grid-cols-3 gap-2">
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
          <v-text-field
            v-model="phone"
            density="compact"
            :error-messages="errors.phone"
            label="Telefone"
            maxlength="15"
            placeholder="Número de telefone para contato"
            variant="outlined"
            @keypress="onlyNumbers"
            @paste="event => handlePaste(event, formatPhone, val => phone = val, { maxDigits: 11 })"
            @update:model-value="val => phone = formatPhone(val)"
          />

          <v-text-field
            v-model="cns"
            class="required"
            density="compact"
            :error-messages="errors.cns"
            label="CNS"
            maxlength="18"
            placeholder="Número do cartão do SUS"
            variant="outlined"
            @keypress="onlyNumbers"
            @paste="event => handlePaste(event, formatCns, val => cns = val, { maxDigits: 15 })"
            @update:model-value="val => cns = formatCns(val)"
          />
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
            @paste="event => handlePaste(event, formatCpf, val => cpf = val, { maxDigits: 14 })"
            @update:model-value="val => cpf = formatCpf(val)"
          />
          <base-input-date-picker
            v-model="birth_date"
            class-field="required"
            :error-messages="errors.birth_date"
            label="Data de Nascimento"
          />

          <v-text-field
            v-model="mother_name"
            class="required"
            density="compact"
            :error-messages="errors.mother_name"
            label="Nome da Mãe"
            maxlength="100"
            placeholder="Nome completo da mãe"
            variant="outlined"
          />

          <v-text-field
            v-model="street"
            class=" required"
            density="compact"
            :error-messages="errors.street"
            label="Rua"
            maxlength="100"
            placeholder="Nome da rua ou logradouro e número"
            variant="outlined"
          />

          <v-text-field
            v-model="neighborhood"
            class="required"
            density="compact"
            :error-messages="errors.neighborhood"
            label="Bairro"
            maxlength="100"
            placeholder="Bairro ou zona"
            variant="outlined"
          />
        </div>

      </v-form>
    </v-card-text>

    <v-card-actions class="flex justify-end items-end mx-4 mb-4">
      <base-button-clear v-if="!isEditing" button-text="Limpar Campos" @clear="clear" />
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
  import { useField, useForm } from 'vee-validate'
  import * as yup from 'yup'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { formatCpf } = useFormatCpf();
  const { formatCns } = useFormatCns();
  const { formatPhone } = usePhoneFormatter();
  const { onlyNumbers, handlePaste } = useOnlyNumbers();
  const { isValidCns } = useCnsValidator();
  const { isValidCpf } = useCpfValidator();
  const isEditing = computed(() => !!props.modelValue?.id);

  onMounted(async () => {
    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const emit = defineEmits(['close', 'save']);

  const title = computed(() =>
    isEditing.value ? 'Editar Acompanhante' : 'Cadastrar Acompanhante'
  )

  const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    cns: yup.string().min(18, 'CNS incompleto').required('CNS é obrigatório').test('valid-cns', 'CNS inválido', value => isValidCns(value)),
    mother_name: yup.string().required('Nome da mãe é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório').test('valid-cpf', 'CPF inválido', value => isValidCpf(value)),
    birth_date: yup.date().required('Data de nascimento é obrigatória'),
    phone: yup.string().nullable(),
    street: yup.string().required('Rua é obrigatória'),
    neighborhood: yup.string().required('Bairro é obrigatório'),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: cns } = useField('cns');
  const { value: mother_name } = useField('mother_name');
  const { value: cpf } = useField('cpf');
  const { value: birth_date } = useField('birth_date');
  const { value: phone } = useField('phone');
  const { value: street } = useField('street');
  const { value: neighborhood } = useField('neighborhood');

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  })

  const clear = () => {
    resetForm()
  }
</script>
