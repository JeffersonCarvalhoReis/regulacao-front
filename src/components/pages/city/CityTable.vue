<template>
  <div>
    <city-search @search-city="search">
      <slot />
    </city-search>
    <base-table
      class="rounted-t-none"
      :edit="props.edit"
      :headers="headers"
      :items="data"
      :loading="loadingList"
      :show-delete="props.showDelete"
      :tooltip-text-delete="tooltipTextDelete"
      :total-items="meta.total"
      @delete-item="handleDelete"
      @edit-item="handleEdit"
      @update-options="updateOptions"
      @view-item="viewCity"
    />
  </div>
  <v-dialog v-model="viewCityDetails">
    <city-details :city-data="cityData" @close="viewCityDetails = false" />
  </v-dialog>

  <v-dialog
    v-model="editCity"
    class="z-999"
  >
    <city-form :model-value="selectedCity" @close="editCity = false" @save="submit" />
  </v-dialog>
</template>

<script setup>
  import { useCityApi } from '@/composables/modules/useCityModule';
  import { useSweetAlertFeedback } from '@/composables/feedback/useSweetAlert';
  import debounce from 'lodash/debounce'

  const props = defineProps({
    edit: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: false },

  })
  const { data, loadingList, refetch, setTableOptions, meta, setFilter, update, destroy } = useCityApi();
  const { showFeedback, confirmModal } = useSweetAlertFeedback();

  const options = ref({});
  const viewCityDetails = ref(false);
  const cityData = ref({});
  const editCity = ref(false);
  const selectedCity = ref({});
  const tooltipTextDelete = '.'

  const updateOptions = newOptions => {
    options.value = { ...newOptions }
  };

  const handleEdit = city => {
    selectedCity.value = city
    editCity.value = true
  };

  const submit = async city => {
    await showFeedback(() => update(city.id, city));
    refetch();
    editCity.value = false
  };

  const handleDelete = async city => {
    const confirm = await confirmModal(`Tem certeza que deseja excluir a cidade <strong>${city.name}</strong>?`, 'Atenção');
    if(confirm) {
      await showFeedback(() => destroy(city)) ;
      refetch()
    }
  };

  const search = debounce(async v => {
    setFilter('name', v);
    await nextTick()
    refetch();
  }, 500);

  const viewCity = v => {
    cityData.value = v;
    viewCityDetails.value = true;
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
        align: 'left',
        width: '200px',
      },
      {
        title: 'Cidade',
        key: 'name',
        sortable: true,
        align: 'left',

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
