<template>
<v-card
  class="bg-white border border-slate-200 shadow-sm rounded-xs mb-6 overflow-auto"
  flat
>

    <!-- Data Table -->
    <v-data-table-server
      class="uppercase"
      v-model:items-per-page="options.itemsPerPage"
      v-model:options="options"
      :headers="headers"
      density="compact"
      :header-props="{ class: 'text-ita-blue font-semibold text-sm normal-case' }"
      item-value="id"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      loading-text="Carregando..."
      :hide-default-footer="hideDefaultFooter"
    >
      <template
        v-for="header in headers"
        #[`item.${header.key}`]="{ item }"
      >
        <slot
          :item="item"
          :name="`item.${header.key}`"
        >
          {{ (header.value?.(item)) ?? item[header.key] }}
        </slot>
      </template>
      <template #item.view="{ item }">
        <v-tooltip :text="textView">
          <template #activator="{ props }">
            <v-btn
              :class="classView"
              :icon="iconView"
              variant="text"
              v-bind="props"
              @click="emit('view-item',item)"
            />
          </template>
        </v-tooltip>
      </template>
      <!-- Actions Column -->
      <template #item.action="{ item }">
        <v-btn-group
          divided
          variant="outlined"
        >
        <div v-if="handleConditionalAction(item)">
          <v-tooltip
            v-if="newAction"
            :text="textNewAction"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :class="currentStatus(item) ? 'text-slate-500 border-0 ml-1 h-full' : classNewAction"
                :disabled="currentStatus(item)"
                icon
                @click.stop="selectItemNewAction(item)"
              >
                <v-icon>{{ currentStatus(item) ? 'mdi-account-off' : iconNewAction }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
        <div v-if="handleConditionalActionNot(item)">
          <template
           v-if="edit"
          >
            <span>
              <v-btn
                v-if="(item?.role != 'admin')"
                v-bind="props"
                :disabled="!(deletable || item.deletable || editOn)"
                :class="item.deletable || deletable || editOn ? classEdit : 'text-slate-500 border-0  ml-1 h-full'"
                icon
                @click.stop="selectItem(item)"
              >
                  <v-icon>
                    {{ item.deletable || deletable  || editOn ? iconEdit : 'mdi-pencil-off' }}
                  </v-icon>
              </v-btn>
              <v-tooltip
               activator="parent"
              >

                  {{ item.deletable || deletable || editOn ? textEdit : 'Não é possível editar' }}
              </v-tooltip>
            </span>
          </template>
        </div>


          <v-tooltip
            v-if="register"
            text="Cadastrar"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="text-green-600 bg-white/0order-0"
                icon
                size="large"
                @click.stop="selectItemRegister(item)"
              >
                <v-icon>{{ iconRegister }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <template v-if="showDelete">
            <span>
              <v-btn
                v-if="(item?.role != 'admin') || (role == 'super admin')"
                :class="item.deletable || deletable ? chooseClassDelete(item?.status) : 'text-slate-500 border-0 ml-1 h-full'"
                :disabled="!(deletable || item.deletable)"
                icon
                @click="selectItemDelete(item)"
              >
                <v-icon>{{ item.deletable || deletable ? chooseIconDelete(item?.status, iconDelete)  : 'mdi-delete-off' }}</v-icon>
              </v-btn>

              <v-tooltip
                activator="parent"
              >
                {{ item.deletable || deletable ? chooseTextDelete(item?.status, textDelete) : tooltipTextDelete }}
              </v-tooltip>
            </span>
          </template>
        </v-btn-group>
      </template>

      <!-- No Data Slot -->
      <template #no-data>
        <v-container fluid>
          <v-row
            align="center"
            justify="center"
          >
            <v-col
              class="text-center"
              cols="12"
            >
              <v-icon
                color="grey"
                size="large"
              >
                mdi-database-off
              </v-icon>
              <div class="text-h6 mt-2 text-medium-emphasis">
                Nenhum dado encontrado
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useTheme } from 'vuetify'

  const theme = useTheme()

 const props = defineProps({
    role: { type: String, default: 'user' },
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    totalItems: { type: [Number, String], default: 0 },
    loading: { type: Boolean, default: false },
    tab: { type: String, default: 'finalizadas' },
    edit: { type: Boolean, default: true },
    classEdit: { type: String, default: 'text-ita-blue bg-white/0/0 border-0 ml-1 h-full'},
    register: { type: Boolean, default: false },
    showDelete: { type: Boolean, default: true },
    iconRegister: { type: String, default: 'mdi-plus' },
    iconDelete: { type: String, default: 'mdi-delete' },
    iconView: { type: String, default: 'mdi-eye'},
    textView: { type: String, default: 'Visualizar todos os dados'},
    classView: { type: String, default: 'text-blue-500'},
    textDelete: { type: String, default: 'Excluir' },
    iconEdit: { type: String, default: 'mdi-pencil' },
    textEdit: { type: String, default: 'Editar' },
    newAction: { type: Boolean, default: false},
    classNewAction: { type: String, default: 'text-ita-green bg-white/0 border-0 ml-1 h-full'},
    iconNewAction: { type: String, default: 'mdi-plus'},
    textNewAction: { type: String, default: 'Ação'},
    tooltipTextDelete: { type: String, default: 'Não é possivel excluir pois há outros registros vinculados' },
    deletable: { type: Boolean, default: false },
    hideDefaultFooter: { type: Boolean, default: false },
    editOn: { type: Boolean, default: true},
    condiationalAction: { type: Boolean, default: false}
  });

  const emit = defineEmits([
    'delete-item',
    'edit-item',
    'update-options',
    'view-item',
    'register-item',
    'new-action'
  ]);

  const selectedItem = ref(null);

  const options = ref({
    page: 1,
    itemsPerPage: 10,
  });
  const handleConditionalAction = (item) => {
    if (props.condiationalAction) {
      return item.status !== 'scheduled'
    } else {
      return true
    }
  }
  const handleConditionalActionNot = (item) => {
    if (props.condiationalAction) {
      return item.status === 'scheduled'
    } else {
      return true
    }
  }
  const currentStatus = (item) => {
    if (props.condiationalAction) {
      return item.status == 'not-present'
    } else {
      return false
    }
  }
  const chooseIconDelete = (status, iconDelete) => {
   const mapIcon = {
      'not-present' : 'mdi-arrow-u-left-top',
      'realized' : 'mdi-arrow-u-left-top',
    }
    return mapIcon[status] || iconDelete
  }
  const chooseClassDelete = (status) => {
    const mapClass = {
      'not-present': 'text-ita-yellow bg-white/0 border-0 ml-1 h-full',
      'realized': 'text-ita-yellow bg-white/0 border-0 ml-1 h-full'
    }
    return mapClass[status] || 'text-red-600 bg-white/0 border-0 ml-1 h-full';
  }
  const chooseTextDelete = (status, textDelete) => {
    const mapText = {
      'not-present': 'Desfazer',
      'realized': 'Desfazer'
    }
    return mapText[status] || textDelete;
  }
  const selectItem = item => {
    selectedItem.value = { ...item };
    emit('edit-item', selectedItem.value)
  };
  const selectItemNewAction = item => {
    selectedItem.value = { ...item };
    emit('new-action', selectedItem.value)
  };

  const selectItemDelete = item => {
    selectedItem.value = { ...item };
    emit('delete-item', selectedItem.value)
  };
  const selectItemRegister = item => {
    selectedItem.value = { ...item };
    emit('register-item', selectedItem.value)
  };

  const filters = ref({
    page: options.value.page,
    per_page: options.value.itemsPerPage,
  })

  watch(
    () => options.value,
    newOptions => {
      filters.value.page = newOptions.page;
      filters.value.per_page = newOptions.itemsPerPage;
      filters.value.sortBy = newOptions.sortBy[0]?.key;
      filters.value.order = newOptions.sortBy[0]?.order;

      emit('update-options', filters.value)
    },
    { deep: true }
  );


  onMounted(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.global.name.value = 'dark'
    }
  })
</script>

<style scoped>
.v-btn-group {
  gap: 4px;
}
:deep(tbody > tr:nth-child(odd)) {
  background-color: #f8fafc; /* Tailwind slate-50 */
}

:deep(tbody > tr:hover) {
  background-color: #e0f2fe; /* Tailwind blue-100 */
}

:deep(.v-data-table-footer) {
  @apply  normal-case
}
</style>
