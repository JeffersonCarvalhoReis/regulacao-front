<template>
  <h1 class="text-2xl font-bold mb-5">Definições do BPA</h1>

  <Form :validation-schema="schema">
    <v-card>
      <v-card-text>
        <h2 class="text-xl font-bold">Dados do Estabelecimento de Saúde</h2>

        <div class="grid grid-cols-5 gap-x-2 mx-2 mt-4">
          <v-text-field
            v-model="establishment_name"
            class="col-span-4"
            density="compact"
            label="Nome do Estabelecimento de Saúde"
            variant="outlined"
            :error-messages="establishmentError"
          />

          <v-text-field
            v-model="cnes"
            density="compact"
            label="CNES"
            variant="outlined"
            :error-messages="cnesError"
          />
        </div>

        <h2 class="text-xl font-bold mt-4">Profissional Padrão</h2>

        <div class="flex gap-x-2 mx-2 mt-4">
          <v-autocomplete
            v-model="default_doctor_id"
            :items="data"
            item-title="name"
            item-value="id"
            density="compact"
            label="Nome do Profissional"
            variant="outlined"
            :error-messages="doctorError"
          />
          <base-button-register
            button-icon="mdi-doctor"
            button-text="Novo"
            @register="dialogBpadoctor = true"
          />
          <v-text-field
            v-model="cns"
            density="compact"
            label="Cartão Nacional de Saúde (CNS)"
            readonly
            class="not-allowed"
            variant="outlined"
          />

          <v-text-field
            v-model="cbo"
            density="compact"
            label="CBO"
            readonly
            class="not-allowed"
            variant="outlined"
          />
        </div>

        <div class="flex justify-end mt-6">
          <base-button-register
            button-icon="mdi-content-save"
            button-text="Salvar"
            @register="onSubmit"
          />
        </div>
      </v-card-text>
    </v-card>
  </Form>

  <v-dialog v-model="dialogBpadoctor" class="z-999">
    <BpaDoctorTable @close="dialogBpadoctor = false" @update="getBpaDoctors" />
  </v-dialog>
</template>
<script setup>
import { useSweetAlertFeedback } from "@/composables/feedback/useSweetAlert";
import { useBpaDoctorApi } from "@/composables/modules/useBpaDoctor";
import { useBpaSettingApi } from "@/composables/modules/useBpaSettingModule";
import { Form, useField, useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import * as yup from "yup";

const dialogBpadoctor = ref(false);

const { showFeedback } = useSweetAlertFeedback();
const { data, refetch, params } = useBpaDoctorApi();
const {
  update,
  data: settingData,
  refetch: settingRefetch,
} = useBpaSettingApi();

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/
const schema = yup.object({
  establishment_name: yup.string().required("Campo obrigatório"),
  cnes: yup.string().required("Campo obrigatório"),
  default_doctor_id: yup
    .number()
    .nullable()
    .required("Selecione um profissional"),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

/*
|--------------------------------------------------------------------------
| Fields
|--------------------------------------------------------------------------
*/
const { value: establishment_name, errorMessage: establishmentError } =
  useField("establishment_name");

const { value: cnes, errorMessage: cnesError } = useField("cnes");

const { value: default_doctor_id, errorMessage: doctorError } =
  useField("default_doctor_id");

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/
const selectedDoctor = computed(() =>
  data.value?.find((d) => d.id === default_doctor_id.value),
);

const cbo = computed(() => selectedDoctor.value?.cbo ?? "");
const cns = computed(() => selectedDoctor.value?.cns ?? "");

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/
const onSubmit = handleSubmit(async (formValues) => {
  await showFeedback(() => update(1, formValues));
  await settingRefetch();
});

/*
|--------------------------------------------------------------------------
| Fetch
|--------------------------------------------------------------------------
*/
const getBpaDoctors = async () => {
  params.value.per_page = -1;
  await refetch();
};

onMounted(async () => {
  await Promise.all([getBpaDoctors(), settingRefetch()]);
});

watch(
  () => settingData.value,
  (settings) => {
    if (!settings) return;

    resetForm({
      values: {
        establishment_name: settings.establishment_name ?? "",
        cnes: settings.cnes ?? "",
        default_doctor_id: settings.default_doctor_id ?? null,
      },
    });
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
:deep(.not-allowed .v-field__input) {
  cursor: not-allowed;
}
</style>
