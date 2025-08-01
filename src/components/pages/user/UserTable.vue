<template>
  <div>
    <user-search @search-user="search">
      <slot />
    </user-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
      @view-item="viewUser"
    />
  </div>
  <v-dialog v-model="viewUserDetails">
    <user-details :user-data="userData" @close="viewUserDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editUser"
    class="z-999"
  >
    <user-form :model-value="selectedUser" @close="editUser = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useUserApi } from '@/composables/modules/useUserModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useUserApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewUserDetails = ref(false);
  const userData = ref({});
  const editUser = ref(false);
  const selectedUser = ref({});

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = user => {
    selectedUser.value = user
    editUser.value = true
  };

  const submit = async user => {
    await showFeedback(() => update(user.id, user));
    refetch();
    editUser.value = false
  };

  const handleDelete = async user => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir o usuário <strong>${user.user}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(user)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('user', v);
    await nextTick()
    refetch();
  }, 500);

  const viewUser = v => {
    userData.value = v;
    viewUserDetails.value = true;
  }


  watch(
    () => options.value,
    async newOptions => {
      await nextTick()
      setTableOptions(newOptions)
      refetch()
    },
    { deep: true }
  )


  const headers = computed( () => {
    const baseHeaders = [
      {
        title: 'Detalhes',
        value: 'view',
        align: 'center',
        width: '100px',
      },
      {
        title: 'Usuário',
        key: 'user',
        sortable: true,
        align: 'center',
      },
      {
        title: 'Unidade de Saúde',
        key: 'health_unit',
        sortable: true,
        align: 'center',
      },

    ];
    if(props.edit || props.showDelete) {
      baseHeaders.push({
        title: 'Ações',
        value: 'action',
        width: '200px',
        align: 'center',
      });
    }
    return baseHeaders
  });

  defineExpose({
    refetch,
  });
</script>
