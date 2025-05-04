import { ref } from 'vue'

export function useQueryFilters (defaultParams = {}) {
  const page = ref(defaultParams.page)
  const perPage = ref(defaultParams.per_page)
  const filters = ref({})
  const sort = ref(null)
  const include = ref(null)

  const params = ref({})

  const buildParams = () => {
    const newParams = {
      page: page.value,
      per_page: perPage.value,
    }

    // Aplica filtros
    for (const key in filters.value) {
      if (filters.value[key] !== '' && filters.value[key] !== null) {
        newParams[`filter[${key}]`] = filters.value[key]
      }
    }

    // Ordenação
    if (sort.value) newParams.sort = sort.value

    // Includes
    if (include.value) newParams.include = include.value

    params.value = newParams
  }
  const setTableOptions = async options => {

    page.value = options.page
    perPage.value = options.per_page

    // Trata sort
    const sortField = options.sortBy
    const orderBy = options.order

    if (sortField) {
      sort.value = orderBy == 'desc' ? `-${sortField}` : sortField
    } else {
      sort.value = null
    }

  }

  // Recalcula sempre que algo mudar
  watchEffect(() => {
    buildParams()
  })


  // Inicializa
  buildParams()


  return {
    // filtros principais
    page, perPage, filters, sort, include,

    // objeto final que vai pro useQueryApi
    params,

    // utilitários
    setFilter: (key, value) => filters.value[key] = value,
    clearFilters: () => filters.value = {},
    setSort: val => sort.value = val,
    setInclude: val => include.value = val,
    setTableOptions,
    reset: () => {
      page.value = 1
      perPage.value = 10
      filters.value = {}
      sort.value = null
      include.value = null
    },
  }
}
