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
            v-model="cns"
            class="required"
            density="compact"
            :error-messages="errors.cns"
            label="CNS"
            maxlength="15"
            placeholder="Número do cartão do SUS"
            variant="outlined"
            @keypress="onlyNumbers"
          />

          <v-text-field
            v-model="mother_name"
            class="col-span-2 required"
            density="compact"
            :error-messages="errors.mother_name"
            label="Nome da Mãe"
            maxlength="100"
            placeholder="Nome completo da mãe"
            variant="outlined"
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

          <v-select
            v-model="gender"
            class="required"
            density="compact"
            :error-messages="errors.gender"
            item-title="label"
            item-value="value"
            :items="genderOptions"
            label="Gênero"
            variant="outlined"
          />
          <v-select
            v-model="race"
            class="required"
            density="compact"
            :error-messages="errors.race"
            :items="raceOptions"
            label="Raça/Cor"
            variant="outlined"
          />

          <base-input-date-picker
            v-model="birth_date"
            class-field="required"
            :error-messages="errors.birth_date"
            label="Data de Nascimento"
          />

          <v-text-field
            v-model="phone"
            class="required"
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

          <v-autocomplete
            v-model="health_agent_id"
            class="required"
            density="compact"
            :error-messages="errors.health_agent_id"
            item-title="name"
            item-value="id"
            :items="data"
            label="Agente Comunitário de Saúde"
            variant="outlined"
          />

          <v-text-field
            v-model="street"
            class="required"
            density="compact"
            :error-messages="errors.street"
            label="Rua"
            maxlength="100"
            placeholder="Nome da rua ou logradouro e número"
            variant="outlined"
          />

          <v-text-field
            v-model="neighborhood"
            class="col-span-2 required"
            density="compact"
            :error-messages="errors.neighborhood"
            label="Bairro"
            maxlength="100"
            placeholder="Bairro ou zona"
            variant="outlined"
          />
          <v-text-field
            v-model="observation"
            density="compact"
            :error-messages="errors.observation"
            label="Observação (opcional)"
            maxlength="100"
            placeholder="Informações adicionais sobre o paciente"
            variant="outlined"
          />
          <div v-if="isEditing" class="flex gap-5">
            <v-checkbox
              v-model="is_deceased"
              color="primary"
              density="compact"
              label="Falecido"
            />
            <base-input-date-picker
              v-if="is_deceased"
              v-model="date_of_dead"
              class-field="required"
              :error-messages="errors.date_of_dead"
              label="Data do Falecimento"
            />
          </div>
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
  import { useHealthAgentApi } from '@/composables/modules/useHealthAgentModule'

  const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
  })

  const { formatCpf } = useFormatCpf();
  const { formatPhone } = usePhoneFormatter();
  const { onlyNumbers, handlePaste } = useOnlyNumbers();
  const { data, refetch, params } = useHealthAgentApi();
  const { isValidCns } = useCnsValidator();
  const { isValidCpf } = useCpfValidator();
  const isEditing = computed(() => !!props.modelValue?.id);

  onMounted(async () => {
    params.value.per_page = -1
    params.value.sort = 'name'
    await nextTick()
    await refetch()

    if (isEditing.value) {
      resetForm({ values: props.modelValue })
    }
  });

  const emit = defineEmits(['close', 'save']);

  const title = computed(() =>
    isEditing.value ? 'Editar Paciente' : 'Cadastrar Paciente'
  )

  const genderOptions = [
    { label: 'Feminino', value: 'F' },
    { label: 'Masculino', value: 'M' },
    { label: 'Outro', value: 'O' },
  ];
  const raceOptions = [
    'Branco',
    'Preto',
    'Pardo',
    'Amarelo',
    'Indígena',
  ];

  const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    race: yup.string().required('Raça/Cor é obrigatório'),
    cns: yup.string().min(15, 'CNS incompleto').required('CNS é obrigatório').test('valid-cns', 'CNS inválido', value => isValidCns(value)),
    mother_name: yup.string().required('Nome da mãe é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório').test('valid-cpf', 'CPF inválido', value => isValidCpf(value)),
    gender: yup.string().required('Gênero é obrigatório'),
    birth_date: yup.date().required('Data de nascimento é obrigatória'),
    phone: yup.string().required('Telefone é obrigatório'),
    health_agent_id: yup.number().required('Agente de saúde é obrigatório'),
    street: yup.string().required('Rua é obrigatória'),
    neighborhood: yup.string().required('Bairro é obrigatório'),
    observation: yup.string().nullable(),
    is_deceased: yup.boolean().nullable(),
    date_of_dead: yup.date()
      .when('is_deceased', {
        is: true,
        then: schema => schema
          .required('Data do falecimento é obrigatória'),
        otherwise: schema => schema.nullable(),
      }),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });

  const { value: name } = useField('name');
  const { value: cns } = useField('cns');
  const { value: mother_name } = useField('mother_name');
  const { value: cpf } = useField('cpf');
  const { value: gender } = useField('gender');
  const { value: race } = useField('race');
  const { value: birth_date } = useField('birth_date');
  const { value: phone } = useField('phone');
  const { value: health_agent_id } = useField('health_agent_id');
  const { value: street } = useField('street');
  const { value: neighborhood } = useField('neighborhood');
  const { value: observation } = useField('observation');
  const { value: is_deceased } = useField('is_deceased')
  const { value: date_of_dead } = useField('date_of_dead');

  const onSubmit = handleSubmit(values => {
    emit('save', values)
  })

  const clear = () => {
    resetForm()
  }

  watch(() => is_deceased.value, newValue => {
    if(newValue && !props.modelValue.is_deceased) {
      date_of_dead.value = new Date();
    }
  })
</script>
