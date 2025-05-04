<template>
  <BaseCard @close="emit('close')" title="Novas Recomendações">
    <v-card-text>
      <div  class="flex gap-4">
        <v-select
          :items="data"
          label="Recomendações prontas"
          variant="outlined"
          item-title="text"
          item-value="text"
          density="compact"
          @update:model-value="updateTextArea"
        />
        <v-btn
          prepend-icon="mdi-pencil"
          color="primary"
          @click="dialogRecomendationTable = true"
        >
          Editar
          <v-tooltip activator="parent">Editar e criar novas  recomendações</v-tooltip>
        </v-btn>
      </div>

      <v-textarea
        v-model="recomendation"
        variant="outlined"
        label="Recomendações"
        density="compact"
      >
      </v-textarea>
    </v-card-text>
    <div class="flex justify-end gap-2 m-4">
      <v-btn
        prepend-icon="mdi-close"
        color="error"
        @click="emit('close')"
      >
      Fechar
      <v-tooltip activator="parent">Fechar recomendações</v-tooltip>
      </v-btn>
      <v-btn
        prepend-icon="mdi-content-save"
        color="primary"
        @click="emit('save', recomendation)"
      >
        Salvar
        <v-tooltip activator="parent">Salvar novas recomendações</v-tooltip>
      </v-btn>
    </div>
  </BaseCard>
  <v-dialog
    v-model="dialogRecomendationTable"
    class="z-995"
  >
    <BaseCard @close="dialogRecomendationTable  = false" title="Lista de Recomendações Prontas">
      <div class="flex justify-end p-4">
        <v-btn
          prepend-icon="mdi-comment-plus"
          color="primary"
          @click="dialogNewRecomendation = true"
        >
          Adicionar
          <v-tooltip activator="parent">adicionar nova recomendação</v-tooltip>
        </v-btn>
      </div>

      <div class="mx-4 mb-8 overflow-y-auto">
        <BaseTable
          :items="data"
          :headers="headers"
          hide-default-footer
          @delete-item="handleDelete"
          @edit-item="handleEdit"
        />
    </div>
    </BaseCard>
  </v-dialog>
  <v-dialog
    v-model="dialogNewRecomendation"
    class="z-999"
    persistent
  >
  <BaseCard @close="handleCloseDialogNewRecomendation" :title="titleNewRecomentation" >
    <div class="p-4">
      <v-textarea
        v-model="newRecomendation"
        :error-messages="errors.text"
        variant="outlined"
        label="Recomendações"
        density="compact"
      />
      <div class="flex justify-end">
        <v-btn
        prepend-icon="mdi-content-save"
        color="primary"
        @click="createNewRecomendation"
      >
        Salvar
        <v-tooltip activator="parent">{{ tooltipSaveRecomendation }}</v-tooltip>
      </v-btn>
      </div>
    </div>

  </BaseCard>
  </v-dialog>
</template>

<script setup>
import { useRecomendationApi } from '@/composables/modules/useRecomendationModule';
import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
  recomendationDefault: { type: String, required: true}
})

const dialogRecomendationTable = ref(false);
const dialogNewRecomendation = ref(false);
const recomendation = ref(null);
const editingId = ref(null);
const isEditing = computed(() => !!editingId.value);
const titleNewRecomentation = computed(() => isEditing.value ? 'Editar Recomendação pronta' : 'Adicionar Nova Recomendação');
const tooltipSaveRecomendation = computed(() => isEditing.value ? 'Salvar edição' : 'Salvar nova recomendação')

const { data, refetch, create, update, destroy } = useRecomendationApi();
const { showFeedback, confirmModal } = useSweetAlertFeedback();

const emit = defineEmits(['close', 'save']);

const updateTextArea = newValue => {
  recomendation.value = newValue
}

const schema = yup.object({
  text: yup.string().required('O texto da recomendação não pode ser salva em branco')
})
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    text: ''
  }
});

const { value: newRecomendation } = useField('text');

const createNewRecomendation = handleSubmit(async values => {
  if (editingId.value) {
    await showFeedback(() => update(editingId.value, values));
  } else {
    await showFeedback(() => create(values));
  }

  await refetch();
  dialogNewRecomendation.value = false;
  editingId.value = null;
  resetForm({ values: { text: '' } });
});

onMounted( async () => {
  await refetch();
  recomendation.value = props.recomendationDefault
});

const handleDelete = async (recomendation) => {
  const confirm =  await confirmModal('Realmente deseja excluir essa recomendação?', 'Atenção');
  if(confirm) {
    await showFeedback(() => destroy(recomendation));
    refetch();
  }
};
const handleCloseDialogNewRecomendation = () => {
  editingId.value = null;
  resetForm({ values: { text: '' } });
  dialogNewRecomendation.value = false;
};

const handleEdit = (recomendation) =>  {
  resetForm({ values: recomendation })
  editingId.value = recomendation.id
  dialogNewRecomendation.value = true
}

const headers = computed( () => {
    const baseHeaders = [

      {
        title: 'Recomendação',
        key: 'text',
        sortable: false,
        align: 'left',

      },

      {
        title: 'Ações',
        value: 'action',
        width: '200px',
        align: 'center',
      }
    ];
    return baseHeaders
  });
</script>
